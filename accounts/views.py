import re
from django.conf import settings
from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import SignUpSerializer

User = get_user_model()

support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tynee')

# Create your views here.

# Endpoints
@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    """
    Signs a user in if the credentilas are correct
    Accepts JSON:
      { "loginCredential": "<username|email>",
        "password":        "<password>",
    """
    credential = request.data.get('loginCredential', '').strip()
    password = request.data.get("password", '')

    if not credential or not password:
        return Response(
            {"error": "Username / email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # check if the submitted sign in credential is an email
    email_regex = r"^[\w\.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$"
    if re.match(email_regex, credential, flags=re.I):
        user = User.objects.filter(email__iexact=credential).first()
        if not user:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        username = user.username
    else:
        username = credential

    user = authenticate(request, username=username, password=password)

    if user != None and user.is_active:
        login(request, user)
        return Response({'username': user.username}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'username': user.username, 'message': 'User registered successfully',}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Pages
def sign_in_page(request):
    return render(request, 'accounts/sign_in.html')

def sign_up_page(request):
    return render(request, 'accounts/sign_up.html')

def dashboard(request):
    return render(request, 'accounts/dashboard.html', {

    })