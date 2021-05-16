import decimal

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from system.models import Colour


class Market(models.Model):
    """Stock market"""

    name = models.TextField()
    ticker = models.TextField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.ticker})"


class Stock(models.Model):
    """Stock in a market"""

    name = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    ticker = models.TextField(unique=True)
    sector = models.TextField(blank=True, null=True)
    latestPrice = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=9
    )  # fits the most expensive share BRK.A (NYSE)
    isDiscontinued = models.BooleanField(default=False)
    predictedNextDayPrice = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=9
    )

    def __str__(self):
        return f"{self.name} ({self.ticker}): {self.latestPrice}"


class Portfolio(models.Model):
    """Stock portfolio"""

    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    colour = models.ForeignKey(Colour, on_delete=models.SET_DEFAULT, default=1)
    isPublic = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    createdBy = models.ForeignKey(
        User,
        blank=True,
        editable=False,
        null=True,
        on_delete=models.SET_NULL,
        related_name="portfolioCreatedBy",
        verbose_name="Created by",
    )
    updatedBy = models.ForeignKey(
        User, editable=False, null=True, on_delete=models.SET_NULL
    )

    def __str__(self):
        return f"{self.name} (created by {self.createdBy})"

    class Meta:
        unique_together = [
            "createdBy",
            "name",
        ]  # restriction to help the distinction of portfolios


def validate_non_zero(value):
    if decimal.Decimal(value) == 0.0:
        raise ValidationError("This field must not be 0")
    return value


def validate_non_negative(value):
    if decimal.Decimal(value) < 0:
        raise ValidationError("This field must not be less than 0")
    return value


class Holding(models.Model):
    """Stock holding in a portfolio"""

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.DecimalField(
        editable=False,
        blank=True,
        default=0,
        decimal_places=2,
        max_digits=15,
    )  # fits the stock with the most shares: AAPL (NASDAQ)
    portfolio = models.ForeignKey(
        Portfolio, related_name="holdings", on_delete=models.CASCADE
    )

    def __str__(self):
        quantityPlural = "s" if self.quantity > 1 else ""
        return f"Holding {self.quantity} share{quantityPlural} of {self.stock} in {self.portfolio})"

    class Meta:
        unique_together = ["stock", "portfolio"]


class Transaction(models.Model):
    """Stock transaction in a portfolio"""

    holding = models.ForeignKey(Holding, on_delete=models.CASCADE)
    price = models.DecimalField(
        editable=False,
        blank=True,
        decimal_places=2,
        max_digits=9,
        verbose_name="Price per share",
    )  # fits the stock with the most expensive price per share: BRK.A (NYSE)
    quantity = models.DecimalField(
        decimal_places=2,
        max_digits=15,
        verbose_name="Quantity (buy is positive, sell is negative)",
    )  # fits the stock with the most shares: AAPL (NASDAQ)
    date = models.DateField(
        verbose_name="Transaction date"
    )  # leave default=datetime.datetime.today() to the front end
    cost = models.DecimalField(
        editable=False, blank=True, decimal_places=2, max_digits=18
    )  # fits the company with the most value: Apple Inc.
    createdAt = models.DateTimeField(auto_now_add=True)
    createdBy = models.ForeignKey(
        User,
        editable=False,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        verbose_name="Created by",
    )

    def __str__(self):
        return f"Transaction ID {self.id} (created by {self.createdBy})"

    def save(self, *args, **kwargs):
        self.price = self.holding.stock.latestPrice  # should use date to look up price
        self.cost = self.price * self.quantity
        super(Transaction, self).save(*args, **kwargs)

    def is_valid(self):
        """check the validity of the transaction"""
        return self.holding.quantity + self.quantity >= 0

    def update_holding(self):
        """update holding"""
        self.holding.quantity += self.quantity
        self.holding.save()


@receiver(pre_save, sender=Transaction)
def pre_save_transaction_handler(sender, instance, *args, **kwargs):
    if not instance.is_valid():
        raise Exception("Invalid transaction: can not sell more than current holding")


@receiver(post_save, sender=Transaction)
def post_save_transaction_handler(sender, instance, created, **kwargs):
    instance.update_holding()


class StockData(models.Model):
    class Meta:
        unique_together = ("stock", "date")

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    date = models.DateField()
    open = models.DecimalField(decimal_places=4, max_digits=9, null=True)
    close = models.DecimalField(decimal_places=4, max_digits=9, null=True)
    high = models.DecimalField(decimal_places=4, max_digits=9, null=True)
    low = models.DecimalField(decimal_places=4, max_digits=9, null=True)
    volume = models.IntegerField(null=True)

    def __str__(self):
        return f"({self.stock.name}, {self.date}, {self.open}, {self.high}, {self.low}, {self.close}, {self.volume})"


class EmailSubscription(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    subscribed = models.BooleanField(default=True)
    user = models.ForeignKey(
        User,
        blank=True,
        editable=False,
        null=True,
        on_delete=models.SET_NULL,
    )
