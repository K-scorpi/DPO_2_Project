from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile_detail, name='profile-detail'),
    path('avatar/', views.update_avatar, name='update-avatar'),
    path('change-password/', views.change_password, name='change-password'),
] 