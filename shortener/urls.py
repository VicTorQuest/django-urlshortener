from django.urls import path
from .views import (
    home,
    UrlRedirectView, 
    contact,
    faqs
)

urlpatterns = [
    path('', home.as_view(), name='home'),
    path('shorten/<shortcode>/', UrlRedirectView.as_view(), name='shortened_url'),
    path('contact/', contact, name="contact"),
    path('faqs/', faqs, name="faqs"),
]
