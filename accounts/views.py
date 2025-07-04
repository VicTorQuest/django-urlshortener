from django.shortcuts import render
from django.conf import settings

support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tynee')

# Create your views here.
def sign_in(request):
    return render(request, 'accounts/sign_in.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def sign_up(request):
    return render(request, 'accounts/sign_up.html', {
        "site_name": site_name,
        "support_email": support_email
    })