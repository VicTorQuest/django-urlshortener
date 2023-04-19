from django import forms
from .validators import validate_url

class SubmitUrl(forms.Form):
    # url = forms.CharField(widget=forms.URLInput(attrs={
    #     'placeholder': 'Input your urls',
    #     'name': 'url',
    #     'required': 'True'
        
    # }), label='')
    url = forms.CharField(label='', validators=[validate_url])

    # def clean(self):
    #     cleaned_data = super(SubmitUrl, self).clean()
    #     url = cleaned_data.get('url')

    # def clean_url(self):
    #     url = self.cleaned_data.get('url')
    #     url_validator = URLValidator()
    #     try:
    #         url_validator(url)
         
    #     except:
    #         raise ValidationError(_("Invalid url '{}' ".format(url)))
    #     return url