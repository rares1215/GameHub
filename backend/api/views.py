from rest_framework import generics,serializers,status,viewsets
from .serializers import CustomUserSerializer,GameSerializer,ReviewSerializer,FavoriteSerializer,CustomTokenObtainPairSerializer
from .models import CustomUser,Game,Review,Favorite
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from .permissions import IsOwnerOrReadOnly
from rest_framework.response import Response
from .filters import GameFilter,ReviewFilter
from django.db.models import Avg,Count
from rest_framework.pagination import PageNumberPagination

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache

from django.views.decorators.vary import vary_on_headers

from rest_framework_simplejwt.views import TokenObtainPairView



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
    search_fields = ['title', 'developer']
    ordering_fields = ['release_date', 'avg_rating', 'all_ratings']
    ordering = ['-release_date']

    def get_queryset(self):
        """
        Cacheăm Doar ID-urile jocurilor.
        Apoi reconstruim queryset-ul real pentru Django Filters.
        """
        cached_ids = cache.get("cached_game_ids")

        if cached_ids is None:
            print("⚙️ Caching game IDs in Redis...")
            cached_ids = list(
                Game.objects.annotate(
                    avg_rating=Avg("reviews__rating"),
                    all_ratings=Count("reviews")
                ).values_list("id", flat=True)
            )
            cache.set("cached_game_ids", cached_ids, 60 * 15)  # 15 minute

        # reconstruim queryset-ul real din IDs
        return (
            Game.objects.filter(id__in=cached_ids)
            .prefetch_related("reviews")
            .annotate(
                avg_rating=Avg("reviews__rating"),
                all_ratings=Count("reviews")
            )
        )

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        if user.is_authenticated:
            favorite_ids = set(
                Favorite.objects.filter(user=user).values_list("game_id", flat=True)
            )
            context["favorite_ids"] = favorite_ids
        return context
    

########################### Review Views ######################

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    filterset_class = ReviewFilter
    lookup_url_kwarg = 'review_id'
    ordering_fields = ['created_at']
    ordering = ['created_at']
    pagination_class = PageNumberPagination
    pagination_class.page_size = 30

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        queryset = Review.objects.select_related('user', 'game')
        if game_id:
            return Review.objects.select_related('user','game').filter(game_id=game_id)
        return queryset

    def perform_create(self,serializer):
        user = self.request.user
        game_id = self.kwargs.get('game_id')
        if Review.objects.filter(user=user,game_id=game_id).exists():
            raise serializers.ValidationError("You have already reviewd this Game")
        
        serializer.save(user=user, game_id=game_id)

    def get_permissions(self):
        if self.action in ['create' , 'update' , 'partial_update' , 'destroy']:
            self.permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


##################################### Favorite View ######################




class ToggleFavoriteViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_page(60 * 15, key_prefix='favorites_list'))
    @method_decorator(vary_on_headers('Authorization'))
    def list(self,request):
        queryset = Favorite.objects.select_related('game').filter(user=self.request.user)
        serializer = FavoriteSerializer(queryset, many=True)
        return Response(serializer.data)
    def create(self,request,game_id):
        user = self.request.user
        try:
            game = Game.objects.get(id=game_id)
        except:
            return Response({'detail': "The game does not exists!"}, status=status.HTTP_404_NOT_FOUND)
        
        favorite,created = Favorite.objects.get_or_create(user=user,game=game)
        if not created:
            favorite.delete()
            return Response({"status": "Removed from favorites"})
        return Response({"status": "Added to favorites"})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer