"""Weaver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
import django.contrib.auth.urls
from django.contrib.auth import views as auth_views
from views import main, index, design, logout, save, downloadImage

urlpatterns = [
    url(r'^$', index),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^index/$', index),
    url(r'^login/$', auth_views.login, {'redirect_field_name':'/index/'}),
    url(r'^logout/$', logout),
    url(r'^design/$', design),
    url(r'^save', save),
    url(r'^images/(?P<imageName>\w+)', downloadImage),
]
