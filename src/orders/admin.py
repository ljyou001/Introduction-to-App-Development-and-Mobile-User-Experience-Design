from django.contrib import admin

# Register your models here.
from .models import Order

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'invoice_no','customer','product','quantity','total_amount','created',)

admin.site.register(Order, OrderAdmin)