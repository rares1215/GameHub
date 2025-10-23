from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('games', views.GameViewSet, basename='games')
router.register('user/favorites', views.ToggleFavoriteViewSet, basename='favorites')

game_reviews = views.ReviewViewSet.as_view({
    'get': 'list',
    'post': 'create'
})


game_review_detail = views.ReviewViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})


toggle_favorite = views.ToggleFavoriteViewSet.as_view({
    'post': 'create'
})

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register-user'),
    path('profile/', views.GetUserProfileView.as_view(), name='user-profile'),
    path('games/<int:game_id>/reviews/', game_reviews, name='game-reviews'),
    path('games/<int:game_id>/reviews/<int:review_id>/', game_review_detail, name='game-review-detail'),
    path('games/<int:game_id>/favorite/', toggle_favorite, name='toggle-favorite'),
    # path('games/favorite/', views.ListFavoritesView.as_view(), name='favorite-games'),
]


urlpatterns +=router.urls