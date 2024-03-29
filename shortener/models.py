from django.db import models
from .utils import create_shortcode
from django.conf import settings
from django_hosts.resolvers import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

shortcodemax = getattr(settings, 'SHORTCODE_MAX', 15)


# Create your models here.
class LinkManager(models.Manager):
    def all(self, *args, **kwargs):
        qs_main = super(LinkManager, self).all(*args, **kwargs)
        qs = qs_main.filter(active = True)
        return qs



    def refresh_shortcodes(self, *args, **kwargs):
        new_codes = 0
        qs = Link.objects.filter(id__gte = 1)
        for _ in qs:
            _.shortcode = create_shortcode(_, 6)
            _.active = True
            _.save()
            new_codes += 1
        return "{} shortcodes have been refreshed".format(new_codes)



class Link(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    url = models.URLField(max_length=400)
    shortcode = models.CharField(max_length=shortcodemax, unique=True, null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    active = models.BooleanField(default=True)


    objects = LinkManager()



    def __str__(self):
        return str(self.url)

    def __unicode__(self):
        return str(self.url)
    
    @property
    def get_total_clicks(self):
        from analytics.models import Click
        qs = Click.objects.filter(clicked_url=self)
        total_clicks = [click for click in qs]
        return len(total_clicks)
    
    def get_shortened_url(self):
        return reverse('shortened_url', kwargs={'shortcode': self.shortcode}, scheme='http')



    def save(self, *args, **kwargs):
        #the below code says is shorcode filled is empty or None
        if self.shortcode is None or self.shortcode == "":
            self.shortcode = create_shortcode(self, 6)
        super(Link, self).save(*args, **kwargs)