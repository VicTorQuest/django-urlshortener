from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views import View
from ipware import get_client_ip
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from analytics.models import Click
from .models import Link
from .utils import get_or_set_cookie_id
from .validators import clean_and_validate_url, is_banned, is_own_short_url
from .serializers import LinkSerializer


support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tynee')
anon_limit = getattr(settings, 'ANON_LIMIT', 5)


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
        obj, created = Link.objects.get_or_create(user=request.user, url=url)
    else:
        cookie_id = get_or_set_cookie_id(request)
        obj, created = Link.objects.get_or_create(cookie_id=cookie_id, url=url)

    
    response = Response({
        "created": created,
        "link": {
            "id": obj.id,
            "url": obj.url,
            "shortened_url": obj.get_shortened_url(),
        }
    }, status=status.HTTP_201_CREATED  if created else status.HTTP_200_OK)

    # Only set cookie if it's not already in the request
    if not request.COOKIES.get('anon_id') and cookie_id:
        response.set_cookie('anon_id', cookie_id, max_age=60*60*24*365)


    return response

    

class UrlRedirectView(View):
    def get(self, request,  short_code, *args, **kwargs):
        obj = get_object_or_404(Link, short_code=short_code)
        ip_address = get_client_ip(request)
        Click.objects.create(clicked_url=obj, ip_address=ip_address)
        return HttpResponseRedirect(obj.url)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_links(request):
    f"""
    • Authenticated → return *all* of the user’s links
    • Anonymous     → return first {anon_limit} links + meta data
    """
    if request.user.is_authenticated:
        qs = Link.objects.filter(user=request.user).order_by('-created_at')
        limited = False
    else:
        cookie_id = get_or_set_cookie_id(request)
        qs = Link.objects.filter(cookie_id=cookie_id).order_by('-created_at')
        limited = True

    total_links = qs.count()

    # Slice for anonymous users
    if limited:
        qs = qs[:anon_limit]
    
    serializer = LinkSerializer(qs, many=True)
    return Response(
        {
            "links": serializer.data,
            "total_links": total_links,
            "showing": len(serializer.data),
            "limited": limited and total_links > anon_limit
        }, 
        status=status.HTTP_200_OK
    )
    
@api_view(["DELETE"])
@permission_classes([AllowAny])
def clear_user_url_history(request):
    """
    • Logged‑in user  → delete their links
    • Anonymous user → delete links bound to their anon_id cookie
    Returns how many rows were removed.
    """

    if request.user.is_authenticated:
        qs = Link.objects.filter(user=request.user)
    else:
        cookie_id = request.COOKIES.get('anon_id')
        if not cookie_id:   # visitor never shortened anything
            return Response({"deleted": 0}, status=status.HTTP_200_OK)
        qs = Link.objects.filter(cookie_id=cookie_id)
    
    deleted, _ = qs.delete()
    
    return Response({'deleted': deleted}, status=status.HTTP_200_OK)