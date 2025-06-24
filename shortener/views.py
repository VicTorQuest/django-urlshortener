from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.views import View
from .models import Link
from .forms import SubmitUrl
from .utils import get_client_ip
from django.contrib import messages
from analytics.models import Click


support_email = getattr(settings, 'SUPPORT_EMAIL')
site_name = getattr(settings, 'SITE_NAME', 'Tieny')


# Create your views here.
class home(View):
    def get(self, request, *args, **kwargs):
        form = SubmitUrl()
        return render(request, 'shortener/home.html', {
            "site_name": site_name,
            "form": form
    })

    def post(self, request, *args, **kwargs):
        form = SubmitUrl(request.POST or None)
        template = 'shortener/home.html'
        context = {'form': form}
        if form.is_valid():
            newurl = form.cleaned_data.get('url')
            obj, created = Link.objects.get_or_create(url=newurl)
            obj.get_total_clicks
            context = {
                "site_name": site_name,
                'obj': obj,
                'created': created
            }
            if created:
                template = 'shortener/success.html'
            else:
                template = 'shortener/exists.html'

        
        # if request.POST.get('url') != "":
        #     url = request.POST.get('url')
        #     messages.success(request, "Your url '{}' was submitted".format(url))
        # else:
        #     messages.error(request, 'Empty or invalid url')
        #     url = ''
        # print(url)
        
        return render(request, template, context)

class UrlRedirectView(View):
    def get(self, request,  shortcode, *args, **kwargs):
        obj = get_object_or_404(Link, shortcode=shortcode)
        ip_address = get_client_ip(request)
        Click.objects.create(clicked_url=obj, ip_address=ip_address)
        return HttpResponseRedirect(obj.url)


# PAGES
 
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