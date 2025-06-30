from rest_framework import serializers
from .models import Link

class LinkSerializer(serializers.ModelSerializer):
    clicks = serializers.SerializerMethodField()
    shortened_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Link
        fields = ['id', 'url', 'short_code', 'shortened_url', 'clicks', 'created_at']


    def get_clicks(self, obj):
        """Expose total‑clicks if you have that helper."""
        if hasattr(obj, 'get_total_clicks'):
            return obj.get_total_clicks
        return None

    def get_shortened_url(self, obj):
        print('getting')
        request = self.context.get('request')
        print(request)
        if not request:
            return None
        domain_name = request.get_host()
        print(domain_name)
        print(obj.short_code)
        if hasattr(obj, 'short_code'):
            return f"https://{domain_name}/{obj.short_code}"
        return None
        
