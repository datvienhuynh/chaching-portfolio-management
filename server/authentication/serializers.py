from django.contrib.auth.models import User
from rest_framework import serializers
from portfolio.models import Portfolio
from portfolio.serializers import PortfolioSerializerWithColour


class UserSerializer(serializers.ModelSerializer):
    portfolios = serializers.SerializerMethodField()

    class Meta:
        model = User
        http_method_names = ["get", "post"]
        fields = ["email", "username", "portfolios", "id"]

    @staticmethod
    def get_portfolios(album):
        user = User.objects.get(username=album)
        return PortfolioSerializerWithColour(
            Portfolio.objects.filter(createdBy=user, isPublic=True),
            many=True,
            read_only=True,
        ).data
