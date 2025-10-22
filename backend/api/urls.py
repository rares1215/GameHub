from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('games', views.GameViewSet, basename='games')
router.register('reviews', views.ReviewViewSet, basename='reviews')


game_reviews = views.ReviewViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register-user'),
    path('profile/', views.GetUserProfileView.as_view(), name='user-profile'),
    path('games/<int:game_id>/reviews/', game_reviews, name='game-reviews'),
    path('games/<int:game_id>/favorite/', views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
    path('games/favorite/', views.ListFavoritesView.as_view(), name='favorite-games'),
]


urlpatterns +=router.urls