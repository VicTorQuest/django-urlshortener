from django.urls import path
from .views import (
    create_short_link
)

urlpatterns = [
    path('shorten/', create_short_link, name='shorten'),
]
