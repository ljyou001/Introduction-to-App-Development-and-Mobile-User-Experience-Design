from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User

from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .serializers import OrderSerializer
from .models import Order
from products.models import Product
from .paypal_api import create_payment, execute_payment_process


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if (user.is_authenticated):
            return Order.objects.filter(customer=user)
        return None


'''
POST data as following
data = {
    customer: user_id,
    product: product_id,
    quantity: quantity,
    total_amount: total_amount
};
'''


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def make_payment(request):
    if (request.method == "POST"):
        if (request.user.is_authenticated):
            payment_response = create_payment(request.data.get("total_amount"))
            if payment_response.get("error"):
                return JsonResponse(payment_response)
            else:
                data = request.data
                # data['approval_url'] = payment_response.get("approval_url") # new in 2019
                data['payment_id'] = payment_response.get("payment_id")
                data['payment_token'] = payment_response.get("payment_token")
                ###  New for display product name ###
                product = Product.objects.get(id=data.get("product"))
                customer = User.objects.get(id=int(data.get("customer")))
                print("payment response in views:", payment_response)
                print("data in views:", data)
                serializer = OrderSerializer(data=data)
                if serializer.is_valid():
                    print("!! Order serializer is valid !!")
                    print(serializer.initial_data)
                    serializer.save(customer=customer, product=product) ## new for show product name ###
                    print("Order created successfully in server")
                    return JsonResponse(payment_response)  # {"approval_url": approval_url}
                print("System Error in views, Cannot Create Order")
                return JsonResponse({"error": "Cannot create order"})
        raise PermissionDenied()


# http://127.0.0.1:8000/cancel/?token=EC-8X333147JK744044X
@api_view(['GET'])
def cancel_payment(request):
    if (request.method == "GET"):
        print(request.user)
        token = request.GET.get("token")
        try:
            canceled_order = Order.objects.get(payment_token=token)
            canceled_order.delete()
        except Exception as e:
            print("Cannot delete object")
            print(e)
        finally:
            return HttpResponse("<H1>Payment Cancelled</H1>")


# http://127.0.0.1:8000/process?paymentId=PAYID-LSDZWMA0HA96543F7393463Y&token=EC-27430308GD746773K&PayerID=7FLA4P82VMUFL
@api_view(['GET'])
def confirm_payment(request):
    if (request.method == "GET"):
        print(request.user)
        paymentId = request.GET.get("paymentId")
        PayerID = request.GET.get("PayerID")
        token = request.GET.get("token")
        payment_response = execute_payment_process(paymentId, PayerID)
        if payment_response.get("error"):
            return HttpResponse("<H1>Error</H1>")

        order = Order.objects.get(payment_id=paymentId)
        order.confirm_order()
        return HttpResponse("<H1>Payment Completed</H1>")