from rest_framework import serializers

from system.models import Colour


class ColourSerializer(serializers.ModelSerializer):
    hex_for_display = serializers.SerializerMethodField()

    @staticmethod
    def get_hex_for_display(obj):
        return f"#{obj.hex}"

    class Meta:
        model = Colour
        fields = "__all__"
        http_method_names = ["get"]
