from django.db import models
from django.db.models import UniqueConstraint
from django.utils import timezone
from django.core.validators import MinValueValidator

from django.contrib.auth.models import User
from portfolio.models import Stock


def get_default_start():
    return timezone.now().replace(hour=17, minute=0, second=0, microsecond=0)


def get_default_close():
    return timezone.now().replace(hour=23, minute=59, second=59, microsecond=0)


def get_default_end():
    now = timezone.now().replace(hour=17, minute=0, second=0, microsecond=0)
    nextMonth = now.month % 12 + 1
    return now.replace(month=nextMonth)


class Competition(models.Model):
    """Portfolio Competition"""

    startDate = models.DateTimeField(default=get_default_start, blank=False, null=False)
    submissionClose = models.DateTimeField(
        default=get_default_close, blank=False, null=False
    )
    endDate = models.DateTimeField(default=get_default_end, blank=False, null=False)
    maxStartingValue = models.DecimalField(
        decimal_places=2, max_digits=9, default=10000, blank=False, null=False
    )

    def __str__(self):
        return f"{self.startDate.date()} -> {self.endDate.date()}"


class CompetitionPortfolio(models.Model):
    """Portfolio Submitted to a Competition Portfolio"""

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    createdBy = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    createdAt = models.DateTimeField(default=timezone.now)
    updatedAt = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["competition", "createdBy"],
                name="unique_competition_submission",
            )
        ]

    def __str__(self):
        return f"{self.createdBy}: [{self.competition}]"


class CompetitionPortfolioHolding(models.Model):
    """Holding submitted to a competition portfolio"""

    portfolio = models.ForeignKey(
        CompetitionPortfolio, related_name="holdings", on_delete=models.CASCADE
    )
    stock = models.ForeignKey(Stock, null=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        constraints = [
            UniqueConstraint(fields=["portfolio", "stock"], name="unique_holdings")
        ]

    def __str__(self):
        return f"{self.portfolio} -> {self.stock}"
