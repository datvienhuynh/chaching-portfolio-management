from rest_framework import serializers

from portfolio.models import Market, Portfolio, Stock, Holding, Transaction
from system.serializers import ColourSerializer


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = "__all__"
        http_method_names = ["get"]


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"
        http_method_names = ["get"]


class StockWithoutDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["id", "name", "ticker", "sector", "latestPrice", "isDiscontinued"]


class HoldingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holding
        fields = "__all__"
        http_method_names = ["post"]


class HoldingSerializerWithStock(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Holding
        fields = "__all__"
        http_method_names = ["get"]


class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "colour",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "holdings",
            "isPublic",
        ]
        http_method_names = ["get", "post", "patch"]


class PortfolioSerializerWithColour(PortfolioSerializer):
    colour = ColourSerializer()
    holdings = HoldingSerializerWithStock(many=True, read_only=True)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
        http_method_names = ["get", "post"]
