# Generated by Django 3.1.7 on 2021-04-19 02:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('competition', '0005_auto_20210418_1153'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitionportfolio',
            name='createdAt',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='competitionportfolio',
            name='updatedAt',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='competitionportfolioholding',
            name='portfolio',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='holdings', to='competition.competitionportfolio'),
        ),
    ]
