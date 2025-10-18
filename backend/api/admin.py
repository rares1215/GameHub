from django.contrib import admin
from .models import Game,CustomUser,Review

# Register your models here.
admin.site.register((Game,CustomUser,Review))