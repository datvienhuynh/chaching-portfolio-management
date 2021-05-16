# Generated by Django 3.1.7 on 2021-03-13 04:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import goal.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("system", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Goal",
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
                ("name", models.TextField()),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "target",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=9,
                        validators=[goal.models.validate_non_negative],
                    ),
                ),
                ("startTime", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "startAmount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=9,
                        validators=[goal.models.validate_non_negative],
                    ),
                ),
                ("targetTime", models.DateTimeField(default=django.utils.timezone.now)),
                ("createAt", models.DateTimeField(auto_now_add=True)),
                ("updatedAt", models.DateTimeField(auto_now=True)),
                ("deleted", models.BooleanField(default=True)),
                (
                    "colour",
                    models.ForeignKey(
                        default=1,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        to="system.colour",
                    ),
                ),
                (
                    "createdBy",
                    models.ForeignKey(
                        blank=True,
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="goalCreatedBy",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created by",
                    ),
                ),
                (
                    "updatedBy",
                    models.ForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("createdBy", "name")},
            },
        ),
    ]
