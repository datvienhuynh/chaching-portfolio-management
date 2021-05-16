# Generated by Django 3.1.7 on 2021-04-23 10:20

from django.db import migrations, models
import forum.models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0005_comment_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attitudetocomment',
            name='createdAt',
            field=models.DateTimeField(default=forum.models.get_default_time),
        ),
        migrations.AlterField(
            model_name='attitudetopost',
            name='createdAt',
            field=models.DateTimeField(default=forum.models.get_default_time),
        ),
        migrations.AlterField(
            model_name='comment',
            name='createdAt',
            field=models.DateTimeField(default=forum.models.get_default_time),
        ),
        migrations.AlterField(
            model_name='post',
            name='createdAt',
            field=models.DateTimeField(default=forum.models.get_default_time),
        ),
    ]