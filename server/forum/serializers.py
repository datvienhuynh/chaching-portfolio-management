from django.contrib.auth.models import User
from rest_framework import serializers

from forum.models import Forum, Post, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username",)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class CommentSerializerForDisplay(CommentSerializer):
    createdBy = UserSerializer()


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class PostSerializerForDisplay(PostSerializer):
    comments = CommentSerializer(many=True)
    createdBy = UserSerializer()

    class Meta:
        model = Post
        fields = (
            "id",
            "name",
            "content",
            "nLikes",
            "nDislikes",
            "createdAt",
            "portfolio",
            "forum",
            "createdBy",
            "comments",
        )


class ForumSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True)

    class Meta:
        model = Forum
        fields = (
            "id",
            "name",
            "description",
            "posts",
        )
        http_method_names = ["get"]
