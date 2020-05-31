from django.db import models

# Create your models here.

def upload_location(instance, filename):
    filebase, extension = filename.split(".") # 123abc.jpg > filebase=123abc, extension=jpg
    return "img/%s.%s" % (instance.name, extension)


class Product(models.Model):
    name            = models.CharField(unique=True, max_length=50)
    price           = models.DecimalField(max_digits=10, decimal_places=2)
    discount        = models.IntegerField(default=1)
    quantity        = models.IntegerField(default=0)
    description      = models.TextField()
    picture         = models.ImageField(
                        upload_to=upload_location,
                        height_field="height_field",
                        width_field="width_field",
                        null=True,
                        blank=True)
    # height_field & width_field is for setting image size
    height_field    = models.IntegerField(default=0)
    width_field     = models.IntegerField(default=0)
    created         = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated         = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-created"]