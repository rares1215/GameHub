from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name = 'register-user'),   
    path('profile/<int:user_id>', views.GetUserProfileView.as_view(), name = 'user-profile'),   
]
