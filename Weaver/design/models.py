from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Design(models.Model):
    name = models.CharField(max_length=64)
    image = models.ImageField()
    photo = models.ImageField()
    createdDate = models.DateField()
    lastEditDate = models.DateField()
    public = models.BooleanField()
    bitmap = models.FileField()
    user = models.OneToOneField(User)
    
    
    def __unicode__(self):
        return self.name