from rest_framework import generics,serializers
from .serializers import CustomUserSerializer,GameSerializer,ReviewSerializer
from .models import CustomUser,Game,Review
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
# Create your views here.


#######################3 User views #############
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class GetUserProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    

    def get_object(self):
        return self.request.user



######################### Game Views ##########################
class GameListView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method =="POST":
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()


class UpdateDeleteGameView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    lookup_url_kwarg = "game_id"

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated]
        if self.request.method in ("PUT","PATCH","DELETE"):
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

########################### Review Views ######################

class ReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        game_id = self.kwargs["game_id"]
        return Review.objects.filter(game_id=game_id)

    def perform_create(self,serializer):
        user = self.request.user
        game_id = self.kwargs['game_id']

        if Review.objects.filter(user=user,game_id=game_id).exists():
            raise serializers.ValidationError("You have already reviewd this game.")

        serializer.save(user=user,game_id=game_id)
