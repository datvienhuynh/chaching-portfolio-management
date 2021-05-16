from rest_framework import serializers

from goal.models import Goal
from system.serializers import ColourSerializer


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = "__all__"
        http_method_names = ["get", "post", "patch"]


class GoalSerializerWithColour(GoalSerializer):
    colour = ColourSerializer()
