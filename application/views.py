from re import template
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.views import View
from .models import Newurl
from .forms import SubmitUrl
from django.contrib import messages

# Create your views here.
class home(View):
    def get(self, request, *args, **kwargs):
        form = SubmitUrl()
        return render(request, 'application/home.html', {"form": form})

    def post(self, request, *args, **kwargs):
        form = SubmitUrl(request.POST or None)
        template = 'application/home.html'
        context = {'form': form}
        if form.is_valid():
            newurl = form.cleaned_data.get('url')
            obj, created = Newurl.objects.get_or_create(url=newurl)
            context = {
                'obj': obj,
                'created': created
            }
            if created:
                template = 'application/success.html'
            else:
                template = 'application/exists.html'

        
        # if request.POST.get('url') != "":
        #     url = request.POST.get('url')
        #     messages.success(request, "Your url '{}' was submitted".format(url))
        # else:
        #     messages.error(request, 'Empty or invalid url')
        #     url = ''
        # print(url)
        
        return render(request, template, context)

class NewView(View):
    def get(self, request,  shortcode, *args, **kwargs):
        obj = get_object_or_404(Newurl, shortcode=shortcode)
        return HttpResponse("<h1>Home in currect url({})</h1>".format(obj.url))

