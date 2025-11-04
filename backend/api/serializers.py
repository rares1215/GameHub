from rest_framework import serializers
from .models import CustomUser,Game,Review,Favorite
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(max_length=100, write_only=True)
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'username',
            'password',
            'password2',
        )
        extra_kwargs = {"password": {"write_only": True}}


    
    def validate(self,attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Both passwords must match!'})

        if len(attrs['password']) < 8:
            raise serializers.ValidationError({'password': 'Password must be at least 8 characters'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    game = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Review
        fields = (
            'id',
            'user',
            'game',
            'comments',
            'rating',
            'created_at',
        )
        extra_kwargs = {"created_at":{"read_only":True}}


    
    def validate_rating(self,value):
        if not (1<=value<=5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value



class GameSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True,read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_ratings = serializers.IntegerField(read_only=True)
    class Meta:
        model = Game
        fields = (
            'id',
            'title',
            'description',
            'release_date',
            'genre',
            'reviews',
            'average_rating',
            'total_ratings',
            'developer',
            'image',
            'created_at',
        )
        extra_kwargs = {"created_at":{"read_only":True}}

    
    def validate_release_date(self,value):
        curr_time = timezone.now().date()
        if value>curr_time:
            raise serializers.ValidationError("The release date can't be in the future!")
        return value

class FavoriteSerializer(serializers.ModelSerializer):
    game_title = serializers.CharField(source="game.title", read_only=True)
    game_id = serializers.IntegerField(source="game.id", read_only=True)
    class Meta:
        model = Favorite
        fields = (
            'game_id',
            'game_title',
            'created_at',
        )
        extra_kwargs = {"created_at":{"read_only":True}}




##### Custom for Access jwt token #######

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # 👇 adăugăm atributele utile
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        return token