from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

from portfolio.models import Portfolio, validate_non_negative

def get_default_time():
    return timezone.now()

class Forum(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.description})"


class Post(models.Model):
    """Post in a forum post"""

    name = models.TextField()
    content = models.TextField()
    portfolio = models.ForeignKey(
        Portfolio, blank=True, null=True, on_delete=models.CASCADE
    )
    # forum ID 1 should be the main/general forum
    forum = models.ForeignKey(
        Forum,
        default=1,
        on_delete=models.SET_DEFAULT,
        related_name="posts",
    )
    nLikes = models.IntegerField(default=0, editable=False)
    nDislikes = models.IntegerField(default=0, editable=False)
    createdBy = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(default=get_default_time, blank=False, null=False)

    def __str__(self):
        return f"{self.name} ({self.content})"


class Comment(models.Model):
    """Comment to a post"""

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    content = models.TextField()
    rating = models.IntegerField(
        blank=True,
        null=True,
        verbose_name="rating to the post posted portfolio (if applicable)",
        validators=[validate_non_negative],
    )
    nLikes = models.PositiveIntegerField(default=0, editable=False)
    nDislikes = models.PositiveIntegerField(default=0, editable=False)
    createdBy = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(default=get_default_time, blank=False, null=False)

    def __str__(self):
        return f"(on post {self.post}) {self.content}"


ATTITUDE_CHOICES = [("like", "Like"), ("none", "None"), ("dislike", "Dislike")]


class Attitude(models.Model):
    """Abstract model of user's attitude (i.e. like / dislike / none)"""

    attitude = models.CharField(max_length=7, choices=ATTITUDE_CHOICES)
    createdBy = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(default=get_default_time, blank=False, null=False)

    class Meta:
        abstract = True


class AttitudeToPost(Attitude):
    """User's attitude (i.e. like / dislike / none) to a post"""

    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.createdBy} to {self.post}"

    class Meta:
        unique_together = [
            "post",
            "createdBy",
        ]
        verbose_name = "attitude to post"
        verbose_name_plural = "attitudes to post"


class AttitudeToComment(Attitude):
    """User's attitude (i.e. like / dislike / none) to a comment"""

    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.createdBy} to {self.comment}"

    class Meta:
        unique_together = [
            "comment",
            "createdBy",
        ]
        verbose_name = "attitude to comment"
        verbose_name_plural = "attitudes to comment"


@receiver([post_save, post_delete], sender=AttitudeToPost)
def update_post(sender, instance, *args, **kwargs):
    # tally and update attitudes on post
    instance.post.nLikes = sender.objects.filter(
        post=instance.post, attitude="like"
    ).count()
    instance.post.nDislikes = sender.objects.filter(
        post=instance.post, attitude="dislike"
    ).count()
    instance.post.save()


@receiver([post_save, post_delete], sender=AttitudeToComment)
def update_comment(sender, instance, *args, **kwargs):
    # tally and update attitudes on comment
    instance.comment.nLikes = sender.objects.filter(
        comment=instance.comment, attitude="like"
    ).count()
    instance.comment.nDislikes = sender.objects.filter(
        comment=instance.comment, attitude="dislike"
    ).count()
    instance.comment.save()
