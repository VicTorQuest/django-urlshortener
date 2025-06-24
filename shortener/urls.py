from django.urls import path
from .views import (
    home,
    UrlRedirectView, 
    contact,
    faqs,
    cookie_policy,
    privacy_policy,
    terms
)

urlpatterns = [
    path('', home.as_view(), name='home'),
    path('shorten/<shortcode>/', UrlRedirectView.as_view(), name='shortened_url'),
    path('contact/', contact, name="contact"),
    path('faqs/', faqs, name="faqs"),
    path('cookie-policy/', cookie_policy, name="cookie_policy"),
    path('privacy-policy/', privacy_policy, name="privacy_policy"),
    path('terms-of-service/', terms, name="terms"),
]
