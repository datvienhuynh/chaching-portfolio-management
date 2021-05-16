# Generated by Django 3.1.7 on 2021-03-21 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0004_auto_20210313_1853"),
    ]

    operations = [
        migrations.AlterField(
            model_name="holding",
            name="quantity",
            field=models.DecimalField(
                blank=True, decimal_places=2, default=0, editable=False, max_digits=15
            ),
        ),
    ]