from rest_framework import serializers

from competition.models import (
    Competition,
    CompetitionPortfolio,
    CompetitionPortfolioHolding,
)
from portfolio.serializers import StockWithoutDescriptionSerializer


class CompetitionPortfolioHoldingSerializer(serializers.ModelSerializer):
    stock = StockWithoutDescriptionSerializer()

    class Meta:
        model = CompetitionPortfolioHolding
        fields = ["id", "stock", "quantity"]
        http_methods_names = ["get"]


class CompetitionPortfolioWithHoldingSerializer(serializers.ModelSerializer):
    holdings = CompetitionPortfolioHoldingSerializer(many=True, read_only=True)

    class Meta:
        model = CompetitionPortfolio
        fields = [
            "id",
            "competition",
            "createdBy",
            "createdAt",
            "updatedAt",
            "holdings",
        ]
        http_methods_names = ["get"]


class CompetitionPortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionPortfolio
        fields = "__all__"
        http_methods_names = ["get", "post"]


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = "__all__"
        http_method_names = ["get"]
