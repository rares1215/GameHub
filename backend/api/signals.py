from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Game, Favorite
import os


@receiver([post_save, post_delete], sender=Game)
def invalidate_game_cache(sender, instance, **kwargs):
    """
    Golește cache-ul cu ID-urile jocurilor când adaugi / ștergi un joc.
    """
    cache.delete("cached_game_ids")
    print("Game cache cleared, Game updated or deleted.")


@receiver([post_save, post_delete], sender=Favorite)
def invalidate_favorite_cache(sender, instance, **kwargs):
    """
    Golește cache-ul când userul adaugă sau scoate un joc de la favorite.
    """
    cache.delete("cached_game_ids")
    print("Favorite changed, game cache cleared.")

@receiver(post_delete, sender=Game)
def delete_game_image(sender, instance, **kwargs):
    """
    Delete image file from storage when a Game is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
            print(f"🗑️ Deleted image file: {instance.image.path}")

