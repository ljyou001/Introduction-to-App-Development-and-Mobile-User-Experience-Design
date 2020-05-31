from django.urls import path

from .views import make_payment, confirm_payment, cancel_payment

urlpatterns = [
    path('payment/', make_payment, ),
    path('process/', confirm_payment, ),
    path('cancel/', cancel_payment),
]
