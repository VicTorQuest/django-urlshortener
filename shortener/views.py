from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.views import View
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from analytics.models import Click
from .models import Link
from .utils import get_client_ip, get_or_set_cookie_id
from .validators import clean_and_validate_url, is_banned, is_own_short_url
from .serializers import LinkSerializer
import time


support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tieny')


# API ENDPOINTS

@api_view(['POST'])
@permission_classes([AllowAny])
def create_short_link(request):
    raw_url = request.data.get('url', '')
    
    
    try:
        url = clean_and_validate_url(raw_url)
    except ValidationError as e:
        return Response({"error": e.messages[0]}, status=status.HTTP_400_BAD_REQUEST)

    if is_banned(url):
        return Response({'error': "URL is banned!"}, status=status.HTTP_400_BAD_REQUEST)
    
    if is_own_short_url(url, request):
        return Response({'error': "URL is banned!"}, status=status.HTTP_400_BAD_REQUEST)

    
    created = False
    cookie_id = None
    
    # Check if user is authenticated 
    if request.user.is_authenticated:
        print('get or creating short url')
        obj, created = Link.objects.get_or_create(user=request.user, url=url)
        print('gotten or created it')
    else:
        cookie_id = get_or_set_cookie_id(request)
        obj, created = Link.objects.get_or_create(cookie_id=cookie_id, url=url)

    
    response = Response({
        "created": created,
        "link": {
            "id": obj.id,
            "url": obj.url,
            "shortened_url": f"https://{request.get_host()}/{obj.short_code}",
        }
    }, status=status.HTTP_201_CREATED  if created else status.HTTP_200_OK)

    # Only set cookie if it's not already in the request
    if not request.COOKIES.get('anon_id') and cookie_id:
        response.set_cookie('anon_id', cookie_id, max_age=60*60*24*365)


    return response

    

class UrlRedirectView(View):
    def get(self, request,  shortcode, *args, **kwargs):
        obj = get_object_or_404(Link, short_code=shortcode)
        ip_address = get_client_ip(request)
        Click.objects.create(clicked_url=obj, ip_address=ip_address)
        return HttpResponseRedirect(obj.url)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_links(request):
    """
    Return every Link belonging to the logged‑in user,
    or to the current anonymous visitor.
    """
    if request.user.is_authenticated:
        qs = Link.objects.filter(user=request.user).order_by('-created_at')
    else:
        cookie_id = get_or_set_cookie_id(request)
        qs = Link.objects.filter(cookie_id=cookie_id).order_by('-created_at')
    
    serializer = LinkSerializer(qs, many=True, context={'request': request})
    time.sleep(2)
    return Response(serializer.data, status=status.HTTP_200_OK)
    




# PAGES
def home(request):
    return render(request, 'shortener/home.html', {
            "site_name": site_name,
    })
 
def contact(request):
    return render(request, 'shortener/contact.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def faqs(request):
    return render(request, 'shortener/faqs.html', {
        "site_name": site_name,
    })

def privacy_policy(request):
    return render(request, 'shortener/privacy.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def cookie_policy(request):
    return render(request, 'shortener/cookie.html', {
        "site_name": site_name,
        "support_email": support_email
    })

def terms(request):
    return render(request, 'shortener/terms.html', {
        "site_name": site_name,
        "support_email": support_email
    })