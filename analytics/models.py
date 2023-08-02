from django.db import models
from shortener.models import Link

# Create your models here.
class Click(models.Model):
    clicked_url = models.ForeignKey(Link, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField(null=True, default='Anonymous')
    timestamp = models.DateTimeField(auto_now_add=True)

