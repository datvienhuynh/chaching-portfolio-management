# Generated by Django 3.1.7 on 2021-03-13 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0003_auto_20210312_1032"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="quantity",
            field=models.DecimalField(
                decimal_places=2,
                max_digits=15,
                verbose_name="Quantity (buy is positive, sell is negative)",
            ),
        ),
    ]
