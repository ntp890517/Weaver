from django.shortcuts import render_to_response
from django.contrib import auth
from django.http import HttpResponseRedirect

def index(request):
    return render_to_response('index.html', locals())
    
def main(request):
    return render_to_response('main.html', locals())

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/index/')
    
def home(request):
    return render_to_response('home.html', locals())
    
def design(request):
    return render_to_response('design.html', locals())