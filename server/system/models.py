from django.core.validators import MinLengthValidator
from django.db import models


class Colour(models.Model):
    """Theme colour"""

    name = models.TextField(unique=True)
    hex = models.CharField(
        max_length=6, validators=[MinLengthValidator(6)], unique=True
    )

    def __str__(self):
        return f"{self.name} (#{self.hex})"
