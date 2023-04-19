from django.urls import path
from .views import home, NewView

urlpatterns = [
    path('', home.as_view(), name='home'),
    path('new/<shortcode>/', NewView.as_view(), name='class based home')
]
