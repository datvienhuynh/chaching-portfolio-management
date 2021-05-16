import json
import numbers
from datetime import datetime

import requests
import yahoo_fin.news as news
import yahoo_fin.stock_info as YFStockInfo
import yahoo_fin.stock_info as si
import yfinance as yf
from dateutil.relativedelta import relativedelta
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import (
    action,
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from portfolio.models import (
    EmailSubscription,
    Holding,
    Market,
    Portfolio,
    Stock,
    StockData,
    Transaction,
)
from portfolio.serializers import (
    HoldingSerializer,
    HoldingSerializerWithStock,
    MarketSerializer,
    PortfolioSerializer,
    PortfolioSerializerWithColour,
    StockSerializer,
    TransactionSerializer,
)
from portfolio.stock_info import get_stock_sd, raw_get_daily_info
from portfolio.stock_predict import make_prediction


class MarketViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    filter_backends = (SearchFilter,)
    search_fields = ("name", "ticker")


class PortfolioPermission(permissions.BasePermission):
    """ Return `True` if permission is granted, `False` otherwise. """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_active:
            return False
        if request.user.is_superuser:
            return True
        if request.method == "GET":
            return True
        return request.user == obj.createdBy


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ("colour", "createdBy")
    search_fields = ("name",)
    permission_classes = (IsAuthenticatedOrReadOnly, PortfolioPermission)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        isOwner = self.request.user.id == serializer.data["createdBy"]
        return Response({"result": serializer.data, "isOwner": isOwner})

    def perform_create(self, serializer):
        """ Include logging information """
        if self.request.user:
            serializer.save(createdBy=self.request.user, updatedBy=self.request.user)

    def perform_update(self, serializer):
        """ Include logging information """
        if self.request.user:
            serializer.save(createdBy=self.request.user, updatedBy=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PortfolioSerializerWithColour
        return PortfolioSerializer

    @action(detail=False, methods=["get"], permission_classes=(permissions.AllowAny,))
    def getPublicPortfolioById(self, request):
        portfolioId = request.query_params.get("portfolioId")

        portfolios = Portfolio.objects.filter(isPublic=True, id=portfolioId)
        serializer = self.get_serializer(portfolios, many=True)
        return Response({"results": serializer.data})

    @action(detail=False, methods=["get"])
    def mine(self, request):
        portfolios = Portfolio.objects.filter(createdBy=request.user.id)
        serializer = self.get_serializer(portfolios, many=True)
        return Response({"results": serializer.data})  # mimic a paginated response

    def get_stock_price(self, ticker, date):
        stock_data = StockData.objects.get(stock__ticker=ticker, date=date)
        if stock_data:
            return stock_data.close
        else:
            return 0

    @action(detail=False, methods=["get"], permission_classes=(permissions.AllowAny,))
    def publicPortfoliosRankedByValue(self, request):
        portfolios = Portfolio.objects.raw(
            "SELECT p.*   FROM `portfolio_portfolio` as p inner JOIN  portfolio_holding as h  on p.id =h.portfolio_id  INNER JOIN portfolio_stock as s on h.stock_id = s.id  where p.isPublic = true ORDER BY h.quantity * s.latestPrice DESC"
        )
        serializer = self.get_serializer(portfolios, many=True)
        return Response({"results": serializer.data})

    @action(detail=False, methods=["get"], permission_classes=(permissions.AllowAny,))
    def publicPortfolio(self, request):
        userId = request.query_params.get("userId")
        portfolios = Portfolio.objects.filter(createdBy=userId, isPublic=True)
        serializer = self.get_serializer(portfolios, many=True)
        return Response({"results": serializer.data})

    @action(
        detail=False, methods=["get"], url_path=r"wealth(/(?P<date>\d{4}-\d{2}-\d{2}))?"
    )
    def wealth(self, request, date=None):
        total = 0
        portfolios = Portfolio.objects.filter(createdBy=request.user.id)
        for p in portfolios:
            for h in p.holdings.all():
                if not date:
                    total += h.quantity * h.stock.latestPrice
                else:
                    price = self.get_stock_price(h.stock.ticker, date)
                    total += h.quantity * price
        return Response({"result": total})


class HoldingViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("stock", "portfolio")

    def perform_create(self, serializer):
        """ Validate portfolio ownership """
        if self.request.user != serializer.validated_data["portfolio"].createdBy:
            raise PermissionDenied()
        else:
            serializer.save()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return HoldingSerializerWithStock
        return HoldingSerializer


class TransactionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("holding", "date")
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        """ Check validity and include logging information """
        if (
            self.request.user
            != serializer.validated_data["holding"].portfolio.createdBy
        ):
            raise PermissionDenied()
        elif (
            serializer.validated_data["holding"].quantity
            + serializer.validated_data["quantity"]
            < 0
        ):
            raise ValidationError(
                {
                    "detail": "Invalid transaction: can not sell more than current holding"
                }
            )
        else:
            if self.request.user:
                serializer.save(createdBy=self.request.user)


# Alpha Vantage API settings
ALPHA_VANTAGE_API_KEY = "AZTXQQ34LZGWS91T"
ALPHA_VANTAGE_QUERY_URL = "https://www.alphavantage.co/query?"
# RapidAPI settings
X_RAPIDAPI_KEY = "757c2b7e75mshb63842a57d07068p18a47ajsnb74461ebefc2"
X_RAPIDAPI_HOST = "apidojo-yahoo-finance-v1.p.rapidapi.com"
RAPID_API_URL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/"


# Make an API call to Alpha Vantage with given stock ID and function
# Return the response
def makeAVRequest(id, function, interval=0):
    stock = Stock.objects.get(id=id)
    ticker = stock.ticker
    params = {
        "function": function,
        "symbol": ticker,
        "apikey": ALPHA_VANTAGE_API_KEY,
    }
    response = requests.get(ALPHA_VANTAGE_QUERY_URL, params=params)
    return response


# Make an API call to Rapid API with given stock ID and function
def makeRapidAPIRequest(function, region, start=0, count=10):
    url = RAPID_API_URL + function
    querystring = {"region": region, "lang": "en-US", "start": start, "count": count}
    headers = {"x-rapidapi-key": X_RAPIDAPI_KEY, "x-rapidapi-host": X_RAPIDAPI_HOST}
    response = requests.request("GET", url, headers=headers, params=querystring)
    return response


# Return OVERVIEW data of given stock from Alpha Vantage
@api_view(["GET"])
def getAVOverview(request, pk):
    response = makeAVRequest(pk, "OVERVIEW")
    return Response(response.json())


# Return DAILY data of given stock from Alpha Vantage
@api_view(["GET"])
def getAVDaily(request, pk):
    response = makeAVRequest(pk, "TIME_SERIES_DAILY")
    return Response(response.json())


# Return WEEKLY data of given stock from Alpha Vantage
@api_view(["GET"])
def getAVWeekly(request, pk):
    response = makeAVRequest(pk, "TIME_SERIES_WEEKLY")
    return Response(response.json())


# Return GLOBAL QUOTE data of given stock from Alpha Vantage
@api_view(["GET"])
def getAVGlobalQuote(request, pk):
    response = makeAVRequest(pk, "GLOBAL_QUOTE")
    return Response(response.json())


# Return TOP GAINERS/LOSERS data from Yahoo Finance
@api_view(["GET"])
def getMarketPerformers(request):
    response_gainers = raw_get_daily_info(
        "https://au.finance.yahoo.com/gainers?count=100&offset=0"
    )[:10]
    response_losers = raw_get_daily_info(
        "https://au.finance.yahoo.com/losers?count=100&offset=0"
    )[:10]
    gainers_data = json.loads(response_gainers.to_json(orient="records"))
    losers_data = json.loads(response_losers.to_json(orient="records"))
    return Response({"gainers": gainers_data, "losers": losers_data})


# Return overview, quote and news of ASX market
@api_view(["GET"])
def getMarketInfo(request):
    ticker = "^AXJO"
    market = yf.Ticker(ticker)
    overview = market.info
    quote = si.get_quote_table(ticker)
    quote = removeNaNvalues(quote)
    if isinstance(quote["Quote Price"], numbers.Number) and isinstance(
        quote["Previous Close"], numbers.Number
    ):
        quote["Price Change"] = quote["Quote Price"] - quote["Previous Close"]
        quote["Change Percent"] = (quote["Price Change"] * 100) / quote[
            "Previous Close"
        ]
    else:
        quote["Price Change"] = 0
        quote["Change Percent"] = 0
    marketNews = news.get_yf_rss(ticker)
    marketNews = [removeNaNvalues(news) for news in marketNews][0:10]
    latestPrice = quote["Quote Price"]
    data = {
        "overview": overview,
        "quote": quote,
        "news": marketNews,
        "latestPrice": latestPrice,
    }
    return Response(data)


# Return stock info using yfinance API
@api_view(["GET"])
def getYFOverview(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    stock = yf.Ticker(ticker)
    data = stock.info
    data["sd"] = get_stock_sd(ticker)
    return Response(data)


# Return daily price data in the last 3 years using yahoo_fin API
@api_view(["GET"])
def getYFDaily(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    three_years_ago = datetime.now() - relativedelta(years=3)
    start_date = three_years_ago.strftime("%d/%m/%Y")
    data = si.get_data(ticker, start_date=start_date, index_as_date=False)
    return Response(data.dropna())


# Given a holding id
# Return daily price data in the last 3 years using yahoo_fin API and the date when the stock was bought
@api_view(["GET"])
def getYFHoldingDaily(request, pk):
    holding = Holding.objects.get(id=pk)
    ticker = holding.stock.ticker + ".AX"
    transactions = Transaction.objects.filter(holding=holding.id)
    curr = transactions[0]
    for t in transactions:
        if t.quantity > 0 and t.date < curr.date:
            curr = t
    boughtAt = curr.date
    three_years_ago = datetime.now() - relativedelta(years=3)
    start_date = three_years_ago.strftime("%d/%m/%Y")
    data = si.get_data(ticker, start_date=start_date, index_as_date=False)
    return Response({"results": data.dropna(), "boughtAt": boughtAt})


# Return weekly price data using yahoo_fin API
@api_view(["GET"])
def getYFWeekly(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    data = si.get_data(ticker, interval="1wk", index_as_date=False)
    return Response(data.dropna())


# Return quote data using yahoo_fin API
@api_view(["GET"])
def getYFQuote(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    data = si.get_quote_table(ticker)
    data = removeNaNvalues(data)
    if isinstance(data["Quote Price"], numbers.Number) and isinstance(
        data["Previous Close"], numbers.Number
    ):
        data["Price Change"] = data["Quote Price"] - data["Previous Close"]
        data["Change Percent"] = (data["Price Change"] * 100) / data["Previous Close"]
    else:
        data["Price Change"] = 0
        data["Change Percent"] = 0
    return Response(data)


# Return news of a given stock using yahoo_fin API
@api_view(["GET"])
def getYFNews(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    data = news.get_yf_rss(ticker)
    data = [removeNaNvalues(news) for news in data]
    return Response(data)


# Replace NaN values by string 'N/A'
def removeNaNvalues(data):
    data = {key: value if value == value else "N/A" for key, value in data.items()}
    return data


@api_view(["GET"])
def makePrediction(request, pk):
    stock = Stock.objects.get(id=pk)
    ticker = stock.ticker + ".AX"
    response = make_prediction(ticker, 15)
    return Response(response)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def subscribeToEmail(request):
    stock = Stock.objects.get(id=request.data.get("stockId"))
    try:
        subscription = EmailSubscription.objects.get(user=request.user, stock=stock)
        subscription.subscribed = request.data.get("isSubscribed")
        subscription.save()

    except Exception as e:
        print(e)
        EmailSubscription.objects.create(
            user=request.user, stock=stock, subscribed=request.data.get("isSubscribed")
        )

    return Response(True)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def unSubscribeFromAllStock(request):
    EmailSubscription.objects.filter(user=request.user).update(subscribed=False)
    return Response(True)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSubscribedStock(request):
    count = EmailSubscription.objects.filter(user=request.user, subscribed=True)
    return Response(count.__len__())


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkSubscribedForSingleStock(request):
    try:
        stock = Stock.objects.get(id=request.data.get("stockId"))
        EmailSubscription.objects.get(user=request.user, stock=stock, subscribed=True)
        return Response(True)
    except:
        return Response(False)
