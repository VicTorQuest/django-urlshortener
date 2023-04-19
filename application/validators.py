from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils.translation import gettext_lazy as _ 


def validate_url(value):
    value1_invalid = False
    value2_invalid = False
    url_validator = URLValidator()

    try:
        url_validator(value)
    except:
        value1_invalid = True
    value2_url = 'https://' + value
    
    try:
        url_validator(value2_url)
    except:
        value2_invalid = True
    if value1_invalid == True and value2_invalid == True:
        raise ValidationError(_("Invalid url '{}' ".format(value)))
    return value
