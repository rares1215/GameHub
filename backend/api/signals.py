from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Game, Favorite
import os


# Invalidate cached game list when a game is added/updated/deleted
@receiver([post_save, post_delete], sender=Game)
def invalidate_game_cache(sender, instance, **kwargs):
    cache.delete_pattern("games_list*")
    print("🟣 Game list cache cleared due to Game change.")


# Invalidate cache when a Favorite is added or removed
@receiver([post_save, post_delete], sender=Favorite)
def invalidate_favorite_cache(sender, instance, **kwargs):
    cache.delete_pattern("games_list*")   # because is_favorite changes
    print("💛 Favorite updated → game list cache cleared.")


# When a game is deleted, delete its image
@receiver(post_delete, sender=Game)
def delete_game_image(sender, instance, **kwargs):
    if instance.image and hasattr(instance.image, 'path'):
        try:
            if os.path.isfile(instance.image.path):
                os.remove(instance.image.path)
                print(f"🗑️ Deleted image file: {instance.image.path}")
        except Exception as e:
            print(f"⚠️ Could not delete image file: {e}")
