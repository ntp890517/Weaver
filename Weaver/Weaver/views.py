from django.shortcuts import render_to_response
from django.contrib.auth import views

def index(request):
    return render_to_response('index.html', locals())

def login(request):
    template_response = views.login(request)
    return templte_responase