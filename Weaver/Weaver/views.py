from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse
import json

def index(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('index.html', locals())
    
def main(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('main.html', locals())

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/index/')
    
def design(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('design.html', locals())
    
def save(request):
    if request.GET and request.is_ajax:
        x = request.GET['x']
        y = request.GET['y']
        message = ' '.join([str(x), str(y)])
        return HttpResponse(json.dumps({'message':message}), content_type="application/json")