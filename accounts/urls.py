from django.urls import path
from django.contrib.auth import views as auth_views
from .views import (
    sign_in,
    sign_up,
    sign_in_page,
    sign_up_page,
    dashboard
)

urlpatterns = [
    path('sign-in/', sign_in_page, name="sign_in_page"),
    path('sign-up/', sign_up_page, name="sign_up_page"),
    path('dashboard/', dashboard, name="dashboard"),
    path('auth/sign-in/', sign_in, name="sign_in"),
    path('auth/sign-up/', sign_up, name="sign_up"),
    path('reset_password', auth_views.PasswordResetView.as_view(template_name='accounts/password_reset.html'), name='reset_password'),
    path('reset_password_sent', auth_views.PasswordResetDoneView.as_view(template_name='accounts/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='accounts/password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset_password_complete', auth_views.PasswordResetCompleteView.as_view(template_name='accounts/password_reset_complete.html'), name='password_reset_complete'),
]
