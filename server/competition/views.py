from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
    SAFE_METHODS,
)
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone

from competition.models import (
    Competition,
    CompetitionPortfolio,
    CompetitionPortfolioHolding,
)
from competition.serializers import (
    CompetitionSerializer,
    CompetitionPortfolioSerializer,
    CompetitionPortfolioWithHoldingSerializer,
)
from portfolio.models import Stock, StockData


class IsAdminUserOrReadOnly(IsAdminUser):
    def has_permission(self, request, view):
        is_admin = super().has_permission(request, view)
        return request.method in SAFE_METHODS or is_admin


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = (IsAdminUserOrReadOnly,)

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="portfolios",
        permission_classes=(IsAuthenticatedOrReadOnly,),
    )
    def portfolios(self, request, pk=None):
        try:
            comp = Competition.objects.get(id=pk)
        except Competition.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if request.method == "GET":
            portfolios = CompetitionPortfolio.objects.filter(competition=comp)
            serializer = CompetitionPortfolioWithHoldingSerializer(
                portfolios, many=True
            )
            return Response({"results": serializer.data})
        elif request.method == "POST":
            now = timezone.now()
            if now < comp.startDate or now > comp.submissionClose:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            data = {
                "competition": pk,
                "createdBy": request.user.id,
            }
            serializer = CompetitionPortfolioSerializer(data=data)
            try:
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["get", "delete", "put"],
        url_path="portfolios/(?P<portfolioId>\d+)",
        permission_classes=(IsAuthenticatedOrReadOnly,),
    )
    def portfolio(self, request, portfolioId=None):
        try:
            if request.method == "GET":
                portfolio = CompetitionPortfolio.objects.get(id=portfolioId)
                serializer = CompetitionPortfolioWithHoldingSerializer(portfolio)
                return Response({"result": serializer.data})
            portfolio = CompetitionPortfolio.objects.get(id=portfolioId)
            now = timezone.now()
            if (
                now < portfolio.competition.startDate
                or now > portfolio.competition.endDate
            ):
                raise Exception("The competition is not accepting submissions")
            if portfolio.createdBy != request.user:
                raise PermissionDenied("Invalid Access")
            if request.method == "DELETE":
                portfolio.delete()
                return Response(status=status.HTTP_200_OK)
            elif request.method == "PUT":
                newHoldingsValue = self.holdingsValue(request.data["holdings"])
                if newHoldingsValue > portfolio.competition.maxStartingValue:
                    raise Exception("Total value of portfolio exceeds maximum allowed")
                currentHoldings = CompetitionPortfolioHolding.objects.filter(
                    portfolio=portfolio
                )
                for holding in currentHoldings:
                    if holding.stock.ticker in request.data["holdings"].keys():
                        holding.quantity = request.data["holdings"][
                            holding.stock.ticker
                        ]
                        holding.save()
                    else:
                        holding.delete()
                for ticker in request.data["holdings"].keys():
                    try:
                        holding = CompetitionPortfolioHolding.objects.get(
                            portfolio=portfolio, stock__ticker=ticker
                        )
                    except CompetitionPortfolioHolding.DoesNotExist:
                        stock = Stock.objects.get(ticker=ticker)
                        quantity = request.data["holdings"][ticker]
                        new = CompetitionPortfolioHolding(
                            portfolio=portfolio, stock=stock, quantity=quantity
                        )
                        new.save()
                return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["get"],
        url_path="portfolios/(?P<portfolioId>\d+)/value",
        permission_classes=(IsAuthenticatedOrReadOnly,),
    )
    def getHoldingsValue(self, request, portfolioId=None):
        try:
            portfolio = CompetitionPortfolio.objects.get(id=portfolioId)
            holdings = CompetitionPortfolioHolding.objects.filter(portfolio=portfolio)
            maxDate = portfolio.competition.endDate.date()
            holdingsDict = {h.stock.ticker: h.quantity for h in holdings}
            return Response({"data": self.holdingsValue(holdingsDict, maxDate)})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["get"],
        url_path="portfolios/(?P<portfolioId>\d+)/holdingvalue/(?P<holdingId>\d+)",
        permission_classes=(IsAuthenticatedOrReadOnly,),
    )
    def getHolding(self, request, portfolioId=None, holdingId=None):
        try:
            portfolio = CompetitionPortfolio.objects.get(id=portfolioId)
            holding = CompetitionPortfolioHolding.objects.get(
                portfolio=portfolio, id=holdingId
            )
            now = timezone.now()
            maxDate = portfolio.competition.endDate.date()
            if now.date() > maxDate:
                price = StockData.objects.get(stock=holding.stock, date=maxDate).close
            else:
                price = holding.stock.latestPrice
            value = price * holding.quantity
            return Response(
                {"value": value, "price": price, "quantity": holding.quantity}
            )
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def holdingsValue(self, holdings, maxDate=None):
        total = 0
        for ticker in holdings.keys():
            stock = Stock.objects.get(ticker=ticker)
            if maxDate:
                now = timezone.now()
                if now.date() > maxDate:
                    price = StockData.objects.get(stock=stock, date=maxDate).close
                else:
                    price = stock.latestPrice
            else:
                price = stock.latestPrice
            total += price * holdings[ticker]
        return total
