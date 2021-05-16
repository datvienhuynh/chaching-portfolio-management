# Generated by Django 3.1.7 on 2021-03-29 10:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0005_auto_20210321_2014"),
    ]

    operations = [
        migrations.CreateModel(
            name="StockData",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField()),
                ("open", models.DecimalField(decimal_places=4, max_digits=9)),
                ("close", models.DecimalField(decimal_places=4, max_digits=9)),
                ("high", models.DecimalField(decimal_places=4, max_digits=9)),
                ("low", models.DecimalField(decimal_places=4, max_digits=9)),
                ("volume", models.IntegerField()),
                (
                    "stock",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="portfolio.stock",
                    ),
                ),
            ],
        ),
    ]
