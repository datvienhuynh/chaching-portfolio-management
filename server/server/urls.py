"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from authentication.views import UserViewSet
from django.contrib import admin
from django.urls import include, path
from goal.views import GoalViewSet
from forum.views import ForumViewSet, PostViewSet, CommentViewSet
from portfolio.views import (
    HoldingViewSet,
    MarketViewSet,
    PortfolioViewSet,
    StockViewSet,
    TransactionViewSet,
    getAVDaily,
    getAVGlobalQuote,
    getMarketPerformers,
    getAVOverview,
    getAVWeekly,
    makePrediction,
    subscribeToEmail,
    unSubscribeFromAllStock,
    getSubscribedStock,
    checkSubscribedForSingleStock,
    getYFOverview,
    getYFDaily,
    getYFWeekly,
    getYFQuote,
    getYFNews,
    getMarketInfo,
    getYFHoldingDaily,
)
from competition.views import CompetitionViewSet
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from system.views import ColourViewSet

router = routers.DefaultRouter()

router.register(r"v1/users", UserViewSet)
router.register(r"v1/colours", ColourViewSet)
router.register(r"v1/markets", MarketViewSet)
router.register(r"v1/stocks", StockViewSet)
router.register(r"v1/portfolios", PortfolioViewSet)
router.register(r"v1/holdings", HoldingViewSet)
router.register(r"v1/transactions", TransactionViewSet)
router.register(r"v1/goals", GoalViewSet)
router.register(r"v1/forums", ForumViewSet)
router.register(r"v1/posts", PostViewSet)
router.register(r"v1/comments", CommentViewSet)
router.register(r"v1/competition", CompetitionViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/v1/auth/signup", include("rest_auth.registration.urls")),
    path("api/v1/auth/", include("rest_auth.urls")),
    path("api/", include(router.urls)),
    path("api/v1/avoverview/<str:pk>", getAVOverview, name="alphavantage_overview"),
    path("api/v1/avdaily/<str:pk>", getAVDaily, name="alphavantage_daily"),
    path("api/v1/avweekly/<str:pk>", getAVWeekly, name="alphavantage_weekly"),
    path(
        "api/v1/avglobalquote/<str:pk>",
        getAVGlobalQuote,
        name="alphavantage_global_quote",
    ),
    path("api/v1/market/", getMarketPerformers, name="market_performers"),
    path("api/v1/prediction/<str:pk>", makePrediction, name="make_prediction"),
    path("api/v1/subscribeToEmail", subscribeToEmail, name="subscribe_to_email"),
    path(
        "api/v1/unSubscribeFromAllStock",
        unSubscribeFromAllStock,
        name="unSubscribeFromAllStock",
    ),
    path("api/v1/getSubscribedStock", getSubscribedStock, name="getSubscribedStock"),
    path(
        "api/v1/checkSubscribedForSingleStock",
        checkSubscribedForSingleStock,
        name="checkSubscribedForSingleStock",
    ),
    path("api/v1/yfoverview/<str:pk>", getYFOverview, name="yf_overview"),
    path("api/v1/yfdaily/<str:pk>", getYFDaily, name="yf_daily"),
    path("api/v1/yfweekly/<str:pk>", getYFWeekly, name="yf_weekly"),
    path("api/v1/yfquote/<str:pk>", getYFQuote, name="yf_quote"),
    path("api/v1/yfnews/<str:pk>", getYFNews, name="yf_news"),
    path("api/v1/marketinfo/", getMarketInfo, name="market_info"),
    path("api/v1/holdingdata/<str:pk>", getYFHoldingDaily, name="yf_holding_data"),
]
