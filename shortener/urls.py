from django.urls import path
from .views import home, UrlRedirectView

urlpatterns = [
    path('', home.as_view(), name='home'),
    path('<shortcode>/', UrlRedirectView.as_view(), name='shortened_url')
]
