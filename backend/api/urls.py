from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name = 'register-user'),   
    path('profile/', views.GetUserProfileView.as_view(), name = 'user-profile'),   
    path('games/', views.GameListView.as_view(), name = 'games-list'), 
    path('games/<int:game_id>/', views.UpdateDeleteGameView.as_view(), name = 'manage-game'), 
    path('games/<int:game_id>/reviews/', views.ReviewListView.as_view(), name = 'games-review'), 
    path('reviews/<int:review_id>/', views.DeleteUpdateReviewView.as_view(), name = 'manage-review'), 
    path('games/<int:game_id>/favorite/', views.ToggleFavoriteView.as_view(), name = 'toggle-favorite'), 
    path('games/favorite/', views.ListFavoritesView.as_view(), name = 'favorite-games'), 
]
