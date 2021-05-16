import decimal

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from system.models import Colour


def validate_non_negative(value):
    if decimal.Decimal(value) < 0:
        raise ValidationError("This field must not be less than 0")
    return value


class Goal(models.Model):
    """user-created customised goals"""

    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    colour = models.ForeignKey(Colour, on_delete=models.SET_DEFAULT, default=1)
    startTime = models.DateTimeField(default=timezone.now)
    startAmount = models.DecimalField(
        decimal_places=2, max_digits=9, validators=[validate_non_negative]
    )
    targetTime = models.DateTimeField(default=timezone.now)
    target = models.DecimalField(
        decimal_places=2, max_digits=9, validators=[validate_non_negative]
    )
    createAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    createdBy = models.ForeignKey(
        User,
        blank=True,
        editable=False,
        null=True,
        on_delete=models.SET_NULL,
        related_name="goalCreatedBy",
        verbose_name="Created by",
    )
    updatedBy = models.ForeignKey(
        User, editable=False, null=True, on_delete=models.SET_NULL
    )

    def __str__(self):
        return f"{self.name} (created by {self.createdBy})"

    # constraints
    def clean(self):
        if self.startTime > self.targetTime:
            raise ValidationError("The target time must be after the start time.")
        if self.target < self.startAmount:
            raise ValidationError(
                "The target amount must be greater than the start amount. Why would you want to lose money?"
            )

    class Meta:
        unique_together = [
            "createdBy",
            "name",
        ]  # restriction to help the distinction of goals
