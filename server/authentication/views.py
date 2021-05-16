from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from rest_framework.response import Response
from authentication.serializers import UserSerializer
from rest_framework import permissions
from rest_framework.decorators import action


class UserPagination(PageNumberPagination):
    page_size = 10


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def list(self, request):
        queryset = User.objects.filter(is_staff=False, is_superuser=False)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=(permissions.AllowAny,))
    def search(self, request):
        queryset = User.objects.filter(is_staff=False, is_superuser=False)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
