import random 
import string
import uuid
from django.conf import settings


short_code_min = getattr(settings, 'SHORT_CODE_MIN', 6)

def code_generator(size=short_code_min, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))

def create_short_code(instance, size):
    new_code = code_generator(size=size)
    klass  = instance.__class__
    #the below code runs this fuction again if short ode was already used or existed
    qs_exists = klass.objects.filter(short_code = new_code).exists()
    if qs_exists:
        return create_short_code(instance, size = size)
    return new_code

def get_or_set_cookie_id(request):
    return request.COOKIES.get('anon_id') or uuid.uuid4().hex

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    print(x_forwarded_for)
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip