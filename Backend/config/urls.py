"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.auth_urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('risk.urls')),
    path('api/', include('careers.urls')),
    path('api/', include('marketplace.urls')),
    path('api/', include('stories.urls')),
    path('api/', include('helpcentre.urls')),
]
