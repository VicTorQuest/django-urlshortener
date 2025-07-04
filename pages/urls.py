from django.urls import path

from .views import (
    home,
    contact,
    faqs,
    cookie_policy,
    privacy_policy,
    terms
)

urlpatterns = [
    path('', home, name='home'),
    path('contact/', contact, name="contact"),
    path('faqs/', faqs, name="faqs"),
    path('cookie-policy/', cookie_policy, name="cookie_policy"),
    path('privacy-policy/', privacy_policy, name="privacy_policy"),
    path('terms-of-service/', terms, name="terms"),
]
