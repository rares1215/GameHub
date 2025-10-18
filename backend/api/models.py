from django.db import models
from django.contrib.auth.models import AbstractUser

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

