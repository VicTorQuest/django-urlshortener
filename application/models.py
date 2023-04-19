from django.db import models
from .utils import create_shortcode
from django.conf import settings

shortcodemax = getattr(settings, 'SHORTCODE_MAX', 15)


# Create your models here.
class UrlManager(models.Manager):
    def all(self, *args, **kwargs):
        qs_main = super(UrlManager, self).all(*args, **kwargs)
        qs = qs_main.filter(active = True)
        return qs



    def refresh_shortcodes(self, *args, **kwargs):
        new_codes = 0
        qs = Newurl.objects.filter(id__gte = 1)
        for _ in qs:
            _.shortcode = create_shortcode(_, 6)
            _.active = True
            _.save()
            new_codes += 1
        return "{} shortcodes have been refreshed".format(new_codes)



class Newurl(models.Model):
    url = models.URLField(max_length=400)
    shortcode = models.CharField(max_length=shortcodemax, unique=True, null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    active = models.BooleanField(default=True)


    objects = UrlManager()



    def __str__(self):
        return str(self.url)

    def __unicode__(self):
        return str(self.url)


    def save(self, *args, **kwargs):
        #the below code says is shorcode filled is empty or None
        if self.shortcode is None or self.shortcode == "":
            self.shortcode = create_shortcode(self, 6)
        super(Newurl, self).save(*args, **kwargs)