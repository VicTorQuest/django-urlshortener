from django.urls import path
from .views import (
    create_short_link,
    get_user_links
)

urlpatterns = [
    path('shorten/', create_short_link, name='shorten'),
    path('my-urls/', get_user_links, name='my_urls')
]
