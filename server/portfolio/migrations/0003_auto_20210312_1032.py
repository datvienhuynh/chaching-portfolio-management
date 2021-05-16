# Generated by Django 3.1.7 on 2021-03-11 23:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import portfolio.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("portfolio", "0002_auto_20210306_0045"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="portfolio",
            name="isDeleted",
        ),
        migrations.AlterField(
            model_name="holding",
            name="portfolio",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="holdings",
                to="portfolio.portfolio",
            ),
        ),
        migrations.AlterField(
            model_name="holding",
            name="quantity",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                default=0,
                editable=False,
                max_digits=15,
                validators=[portfolio.models.validate_non_negative],
            ),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="createdBy",
            field=models.ForeignKey(
                blank=True,
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="portfolioCreatedBy",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Created by",
            ),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="updatedBy",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="cost",
            field=models.DecimalField(
                blank=True, decimal_places=2, editable=False, max_digits=18
            ),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="createdBy",
            field=models.ForeignKey(
                blank=True,
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="Created by",
            ),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="price",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                editable=False,
                max_digits=9,
                verbose_name="Price per share",
            ),
        ),
    ]