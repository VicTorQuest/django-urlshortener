"""urlshortner URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from shortener.views import (
    home,
    contact,
    faqs,
    cookie_policy,
    privacy_policy,
    terms,
    UrlRedirectView
)


# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/v1/', include("shortener.urls")),
    # path('rest-framwork/', include(router.urls)),

    path('', home, name='home'),
    path('contact/', contact, name="contact"),
    path('faqs/', faqs, name="faqs"),
    path('cookie-policy/', cookie_policy, name="cookie_policy"),
    path('privacy-policy/', privacy_policy, name="privacy_policy"),
    path('terms-of-service/', terms, name="terms"),

    re_path(r'^(?P<short_code>[a-zA-Z0-9]{6,})/$', UrlRedirectView.as_view(), name='shortened_url')
]
