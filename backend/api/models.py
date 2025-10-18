from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Avg
# Create your models here.

class CustomUser(AbstractUser):
    pass


class Game(models.Model):
    title = models.CharField(max_length=150,unique=True)
    description = models.TextField()
    release_date = models.DateField()
    genre = models.CharField(max_length=20)
    developer = models.CharField(max_length=100)
    image = models.ImageField(upload_to = 'game_images/', null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    @property
    def average_rating(self):
        avrg = self.reviews.aggregate(avrg = Avg("rating"))['avrg']
        return round(avrg, 1) if avrg is not None else 0
    @property
    def total_ratings(self):
        return self.reviews.count()

    def __str__(self):
        return f"{self.title} released at {self.release_date} by {self.developer}"

class Review(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='reviews')    
    game = models.ForeignKey(Game,on_delete=models.CASCADE, related_name = 'reviews')   
    comments = models.TextField(null=True, blank=True)
    rating = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game')

    def __str__(self):
        return f"{self.user.username} rated {self.game.title} with {self.rating}/5"


class Favorite(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    game = models.ForeignKey(Game,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game')

    def __str__(self):
        return f"{self.game.title} added to favorites by {self.user.username}"
    
