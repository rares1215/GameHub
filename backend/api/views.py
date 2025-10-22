from rest_framework import generics,serializers,status,viewsets
from .serializers import CustomUserSerializer,GameSerializer,ReviewSerializer,FavoriteSerializer
from .models import CustomUser,Game,Review,Favorite
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from .permissions import IsOwnerOrReadOnly
from rest_framework.response import Response
from .filters import GameFilter,ReviewFilter
from django.db.models import Avg,Count
from rest_framework.pagination import PageNumberPagination
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


class GameViewSet(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    filterset_class = GameFilter
    search_fields = ['title','developer']
    ordering_fields =['release_date', 'avg_rating' , 'all_ratings']
    ordering = ['-release_date']


    def get_queryset(self):
        return(
            Game.objects.prefetch_related('reviews').annotate(
                avg_rating = Avg('reviews__rating'),
                all_ratings = Count('reviews')
            )
        )

    def get_permissions(self):
        if self.action in ['create', 'update' , 'partial_update' , 'destroy']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes  = [IsAuthenticated]
        return super().get_permissions()
    

########################### Review Views ######################

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    filterset_class = ReviewFilter
    ordering_fields = ['created_at']
    ordering = ['created_at']
    pagination_class = PageNumberPagination
    pagination_class.page_size = 30

    def get_queryset(self):
        game_id = self.kwargs["game_id"]
        if game_id:
            return Review.objects.select_related('user','game').filter(game_id=game_id)
        return queryset

    def perform_create(self,serializer):
        user = self.request.user
        game_id = self.kwargs['game_id']
        if Review.objects.filter(user=user,game_id=game_id).exists():
            raise serializers.ValidationError("You have already reviewd this Game")
        
        serializer.save(user=user, game_id=game_id)

    def get_permissions(self):
        if self.action in ['create' , 'update' , 'partial_update' , 'destroy']:
            self.permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()



# class ReviewListView(generics.ListCreateAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [IsAuthenticated]
#     filterset_class = ReviewFilter
#     ordering_fields = ['created_at']
#     ordering = ['created_at']
#     pagination_class = PageNumberPagination
#     pagination_class.page_size = 30


#     def get_queryset(self):
#         game_id = self.kwargs["game_id"]
#         return Review.objects.select_related("user", 'game').filter(game_id=game_id,)

#     def perform_create(self,serializer):
#         user = self.request.user
#         game_id = self.kwargs['game_id']

#         if Review.objects.filter(user=user,game_id=game_id).exists():
#             raise serializers.ValidationError("You have already reviewd this game.")

#         serializer.save(user=user,game_id=game_id)

# class DeleteUpdateReviewView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Review.objects.all()
#     serializer_class = ReviewSerializer
#     lookup_url_kwarg = 'review_id'


#     def get_permissions(self):
#         self.permission_classes = [IsAuthenticated]
#         if self.request.method in ['PUT','DELETE','PATCH']:
#             self.permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]
    
#         return super().get_permissions()



##################################### Favorite View ######################

class ToggleFavoriteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,game_id):
        user = request.user
        try:
            game = Game.objects.get(id=game_id)
        except:
            return Response({"detail": "The game does not exists!"},status=status.HTTP_404_NOT_FOUND)

        favorite,created = Favorite.objects.get_or_create(user=user,game=game)
        if not created:
            favorite.delete()
            return Response({"status": "Removed from favorites"})
        return Response({"status": "Added to favorites"})

class ListFavoritesView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 20

    def get_queryset(self):
        return Favorite.objects.select_related('game').filter(user=self.request.user)