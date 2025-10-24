from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from .models import Game,Favorite
from django.core.cache import cache


@receiver([post_save,post_delete], sender=Game)
def invalidate_game_cache(sender,instance,**kwargs):


    print("Clearing game cache.")

    ## Clear cache for games_list when creating or deleting a game.
    cache.delete_pattern('*games_list*')

@receiver([post_save,post_delete], sender=Favorite)
def invalidate_favorite_cache(sender,instance,**kwargs):
    key_pattern = f"*favorites_list*{instance.user.id}*"
    cache.delete_pattern(key_pattern)
    print("Clearing Favorite cache")