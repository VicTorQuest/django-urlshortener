from django.shortcuts import render
from django.conf import settings

support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tynee')

# PAGES
def home(request):
    return render(request, 'pages/home.html', {
            "site_name": site_name,
    })
 
def contact(request):
    return render(request, 'pages/contact.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def faqs(request):
    return render(request, 'pages/faqs.html', {
        "site_name": site_name,
    })

def privacy_policy(request):
    return render(request, 'pages/privacy.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def cookie_policy(request):
    return render(request, 'pages/cookie.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def terms(request):
    return render(request, 'pages/terms.html', {
        "site_name": site_name,
        "support_email": support_email
    })
