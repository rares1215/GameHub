import django_filters
from .models import Game,Review

class GameFilter(django_filters.FilterSet):
    class Meta:
        model = Game
        fields = {
            'genre': ['icontains'],
            'developer': ['icontains'],
            'release_date':['exact', 'year__gt','year__lt'],
        }
class ReviewFilter(django_filters.FilterSet):
    class Meta:
        model = Review
        fields = {
            'rating': ['exact','gte'],
        }