# Generated by Django 4.2.8 on 2024-03-29 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('srcs_game', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='is_finish',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='game',
            name='tournament_id',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
