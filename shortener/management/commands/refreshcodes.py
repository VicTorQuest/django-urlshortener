from django.core.management.base import BaseCommand, CommandError
from application.models import Newurl
class Command(BaseCommand):
    help = 'Refreshes the shortcode for all urls'

    # def add_arguments(self, parser):
    #     parser.add_argument('poll_ids', nargs='+', type=int)

    def handle(self, *args, **options):
        return Newurl.objects.refresh_shortcodes()