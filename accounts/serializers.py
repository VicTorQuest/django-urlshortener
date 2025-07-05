from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from rest_framework.validators import UniqueValidator

User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=150, 
        validators=[UniqueValidator(
            queryset = User.objects.all(),
            message = "User with this username already exists."
            )])
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset = User.objects.all(),
            message = "User with this email already exists."
        )])
    password = serializers.CharField(
        write_only = True,
        style = {"input_type": "password"},
        min_length = 8,
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password'
        ]
    
    def validate_password(self, value):
        password_validation.validate_password(value, self.instance)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)