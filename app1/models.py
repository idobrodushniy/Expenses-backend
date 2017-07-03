from django.db import models
from django.utils import timezone
from datetime import date

# Create your models here.

class Expenses(models.Model):
    cost = models.FloatField(null=False)
    text = models.CharField(null=False, max_length=150)
    date = models.DateField(default=date.today)
    time = models.TimeField(null=True,blank=True,default=timezone.now().time())
    owner = models.ForeignKey('auth.User', related_name='expenses',
                              on_delete=models.CASCADE)
    def __str__(self):
        return '<Cost = {0};Text = {1};Date = {2};Time = {3}>;Owner = {4}'.format(
            self.cost,
            self.text,
            self.date,
            self.time,
            self.owner
        )
    class Meta:
        ordering = ('date','time')