from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from forum.models import Forum, Post, Comment, AttitudeToPost, AttitudeToComment
from forum.serializers import (
    PostSerializer,
    CommentSerializer,
    ForumSerializer,
    CommentSerializerForDisplay,
    PostSerializerForDisplay,
)


class ForumViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = (SearchFilter, OrderingFilter, DjangoFilterBackend)
    search_fields = ("name", "content")
    ordering_fields = ("createdAt", "nLikes")
    filter_fields = ("forum",)
    ordering = ("-createdAt",)
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filterset_fields = {
        "forum": ["exact"],
        "createdAt": ["gte", "lte"],
    }

    def perform_create(self, serializer):
        """ Include logging information """
        if self.request.user:
            serializer.save(createdBy=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PostSerializerForDisplay
        return PostSerializer

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def express(self, request, pk=None):
        """Express user's attitude towards a post"""

        # guard to check the validity of pk and the existence of the post
        if not pk or not Post.objects.filter(pk=pk).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        # guard to check the presence of the attitude ('like', 'dislike' or 'none')
        if not self.request.data.get("attitude"):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.get(pk=pk)
        attitude = self.request.data.get("attitude")

        # if attitude already exists
        if AttitudeToPost.objects.filter(post=post, createdBy=request.user).exists():
            # use .get() since 'post' and 'createdBy' fields are unique together
            attitudeObject = AttitudeToPost.objects.get(
                post=post, createdBy=request.user
            )
            # already exists a like
            if attitudeObject.attitude == attitude:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                attitudeObject.attitude = attitude
                attitudeObject.save()

        # if attitude does not exist
        else:
            attitudeObject = AttitudeToPost(
                attitude=attitude, post=post, createdBy=request.user
            )
            attitudeObject.save()

        return Response(status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = (SearchFilter, OrderingFilter, DjangoFilterBackend)
    search_fields = ("name", "content")
    ordering_fields = ("createdAt", "nLikes")
    filter_fields = ("post",)
    ordering = ("-createdAt",)
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filterset_fields = {
        "post": ["exact"],
        "createdAt": ["gte", "lte"],
    }

    def perform_create(self, serializer):
        """ Include logging information """
        if self.request.user:
            serializer.save(createdBy=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return CommentSerializerForDisplay
        return CommentSerializer

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def express(self, request, pk=None):
        """Express user's attitude towards a comment"""

        # guard to check the validity of pk and the existence of the comment
        if not pk or not Comment.objects.filter(pk=pk).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        # guard to check the presence of the attitude ('like', 'dislike' or 'none')
        if not self.request.data.get("attitude"):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.get(pk=pk)
        attitude = self.request.data.get("attitude")

        # if attitude already exists
        if AttitudeToComment.objects.filter(
            comment=comment, createdBy=request.user
        ).exists():
            # use .get() since 'comment' and 'createdBy' fields are unique together
            attitudeObject = AttitudeToComment.objects.get(
                comment=comment, createdBy=request.user
            )
            # already exists a like
            if attitudeObject.attitude == attitude:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                attitudeObject.attitude = attitude
                attitudeObject.save()

        # if attitude does not exist
        else:
            attitudeObject = AttitudeToComment(
                attitude=attitude, comment=comment, createdBy=request.user
            )
            attitudeObject.save()

        return Response(status=status.HTTP_201_CREATED)
