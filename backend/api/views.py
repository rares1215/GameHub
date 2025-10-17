from rest_framework import generics
from .serializers import CustomUserSerializer
from .models import CustomUser
from rest_framework.permissions import AllowAny,IsAuthenticated

# Create your views here.

class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class GetUserProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "user_id"