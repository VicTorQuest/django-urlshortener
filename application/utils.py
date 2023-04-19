import random 
import string
from django.conf import settings


shortcodemin = getattr(settings, 'SHORTCODE_MIN', 6)

def code_generator(size=shortcodemin, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))

def create_shortcode(instance, size):
    new_code = code_generator(size=size)
    klass  = instance.__class__
    print(klass.__name__)
    #the below code runs this fuction again if shortcode was already used or existed
    qs_exists = klass.objects.filter(shortcode = new_code).exists()
    if qs_exists:
        return create_shortcode(instance, size = size)
    return new_code