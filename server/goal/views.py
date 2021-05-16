from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from goal.models import Goal
from goal.serializers import GoalSerializer, GoalSerializerWithColour


class GoalPermission(permissions.BasePermission):
    """ Return `True` if permission is granted, `False` otherwise. """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_active:
            return False
        if request.user.is_superuser:
            return True
        if request.method == "GET":
            return True
        return request.user == obj.createdBy


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ("colour", "createdBy")
    search_fields = ("name",)
    permission_classes = (IsAuthenticatedOrReadOnly, GoalPermission)

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
            return GoalSerializerWithColour
        return GoalSerializer

    @action(detail=False, methods=["get"])
    def mine(self, request):
        portfolios = Goal.objects.filter(createdBy=request.user.id)
        serializer = self.get_serializer(portfolios, many=True)
        return Response({"results": serializer.data})  # mimic a paginated response
