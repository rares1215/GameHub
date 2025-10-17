from rest_framework import serializers
from .models import CustomUser


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