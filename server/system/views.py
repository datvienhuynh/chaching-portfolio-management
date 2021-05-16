from rest_framework import viewsets

from system.models import Colour
from system.serializers import ColourSerializer


class ColourViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Colour.objects.all()
    serializer_class = ColourSerializer
