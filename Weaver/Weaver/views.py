from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.core.files import File
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse
from PIL import Image, ImageDraw, ImageFont
import json
from django.core.servers.basehttp import FileWrapper

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

class ImageDrawDesign(ImageDraw.ImageDraw):

    def RadiusRectangle(self, xy, rad, fill=None):
        [x0, y0, x1, y1] = [i[j] for i in xy for j in range(len(i))]
        self.rectangle([x0, y0+rad, x1, y1-rad], fill=fill)
        self.rectangle([x0+rad, y0, x1-rad, y1], fill=fill)
        self.pieslice([x0, y1-2*rad, x0+2*rad, y1], start=90, end=180, fill=fill)
        self.pieslice([x0, y0, x0+2*rad, y0+2*rad], start=180, end=270, fill=fill)
        self.pieslice([x1-2*rad, y0, x1, y0+2*rad], start=270, end=0, fill=fill)
        self.pieslice([x1-2*rad, y1-2*rad, x1, y1], start=0, end=90, fill=fill)
        
    def DrawPixel(self, x, y, w, s, color):
        self.RadiusRectangle([(2*s+w+x*(w+s),2*s+w+y*(w+s)),(2*s+w+x*(w+s)+w,2*s+w+y*(w+s)+w)], 5, fill=color)
        
def NewDesign(x, y, gridW, space, bm):
    im = Image.new("RGB", ((x+1)*gridW+(x+2)*space, (y+1)*gridW+(y+2)*space), color='#FFFFFF')
    ds = ImageDrawDesign(im)
    
    font = ImageFont.truetype("arial.ttf", 20)
    
    for i in range(x):
        ds.text((2*space+gridW+i*(space+gridW),space), str(i+1), font=font, fill='#000000')
        
    for i in range(y):
        ds.text((space,2*space+gridW+i*(space+gridW)), str(i+1), font=font, fill='#000000')
        
    for i in range(x):
        for j in range(y):
            color = bm[i+j*y]
            ds.DrawPixel(i, j, gridW, space, color)

    return im

def save(request):
    pixelList = request.POST['pixelArray'].split(',')
    im = NewDesign(int(request.POST['x']), int(request.POST['y']), 25, 5, pixelList)
    im.save("images/test.jpg")
    
    data = {}
    data['url'] = '/images/test.jpg'
    return HttpResponse(json.dumps(data), content_type = "application/json")

def downloadImage(request, imageName):
    wrapper = FileWrapper(open('images/'+imageName+'.jpg', 'rb'))
    response = HttpResponse(wrapper, content_type="image/jpg")
    response['Content-Disposition'] = "attachment; filename=images/test.jpg"
    return response
    
