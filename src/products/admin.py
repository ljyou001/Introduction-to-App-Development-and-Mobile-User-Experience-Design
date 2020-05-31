from django.contrib import admin
# Register your models here.
from .models import Product
class ProductAdmin(admin.ModelAdmin):
	readonly_fields = ('created', 'updated',)
#Show the created and updated time of the products in admin web server.
admin.site.register(Product, ProductAdmin)