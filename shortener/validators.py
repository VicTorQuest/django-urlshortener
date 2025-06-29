import re
from urllib.parse import urlparse
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils.translation import gettext_lazy as _ 


def clean_and_validate_url(raw_url):
    """
    • Strips whitespace
    • Adds https:// if no scheme is present
    • Validates it is a proper http/https URL
    • Returns the normalised URL (so you always store the same form)
    """
    if not raw_url or not raw_url.strip():
        raise ValidationError("URL cannot be empty.")

    url = raw_url.strip()

    # If the user did not supply a scheme, add https://
    if not re.match(r'^[a-z][a-z0-9+\-.]*://', url, re.IGNORECASE):
        url = 'https://' + url        

    validate_url = URLValidator(schemes=['http', 'https'])

    validate_url(url)

    parsed = urlparse(url)
    normalized = parsed._replace(
        netloc=parsed.netloc.lower(),
        path=parsed.path.rstrip('/') or '/'
    ).geturl()

    return normalized


BANNED_DOMAINS = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'is.gd',
    'cutt.ly', 'shorturl.at', 'ow.ly', 'shorte.st', 'buff.ly', 'rb.gy'
}


def is_banned(url):
    domain = urlparse(url).netloc.lower().replace('www.', '')
    return domain in BANNED_DOMAINS

def is_own_short_url(url, request):
    parsed = urlparse(url)
    current_domain = request.get_host()
    return parsed.netloc == current_domain or parsed.netloc == f"www.{current_domain}"
