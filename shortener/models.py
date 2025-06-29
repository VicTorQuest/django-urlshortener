from django.db import models
from .utils import create_short_code
from django.conf import settings
from django_hosts.resolvers import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

short_code_max = getattr(settings, 'SHORT_CODE_MAX', 15)


# Create your models here.
class LinkManager(models.Manager):
    def all(self, *args, **kwargs):
        qs_main = super(LinkManager, self).all(*args, **kwargs)
        qs = qs_main.filter(active = True)
        return qs



    def refresh_short_codes(self, *args, **kwargs):
        new_codes = 0
        qs = Link.objects.filter(id__gte = 1)
        for _ in qs:
            _.short_code = create_short_code(_, 6)
            _.active = True
            _.save()
            new_codes += 1
        return "{} short codes have been refreshed".format(new_codes)



class Link(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    cookie_id = models.CharField(max_length=64, null=True, blank=True)
    url = models.URLField(max_length=400)
    short_code = models.CharField(max_length=short_code_max, unique=True, null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = [('user', 'url'), ('cookie_id', 'url')] # Enforce uniqueness per user or cookie


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
        return reverse('shortened_url', kwargs={'short_code': self.short_code}, scheme='http')



    def save(self, *args, **kwargs):
        #the below code says is shorcode filled is empty or None
        if self.short_code is None or self.short_code == "":
            self.short_code = create_short_code(self, 6)
        super(Link, self).save(*args, **kwargs)