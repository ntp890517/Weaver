from django.shortcuts import render_to_response
from django.contrib import auth

def index(request):
    return render_to_response('index.html', locals())
    
def main(request):
    return render_to_response('main.html', locals())

def login(request):
    template_response = views.login(request)
    return templte_responase
    
def home(request):
    return render_to_response('home.html', locals())