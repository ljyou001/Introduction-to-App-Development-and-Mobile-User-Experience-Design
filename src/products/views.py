from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework import viewsets, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView
from rest_framework.response import Response

from .serializers import UserSerializer, ProductSerializer
from .models import Product


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class UserListCreateView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)


class UserRetrieveUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

# custom a ObtainAuthToken class


class CustomAuthToken(ObtainAuthToken):
    # when receive post request
    def post(self, request, *args, **kwargs):
        # get the user serializer
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        # get the user info
        user = serializer.validated_data['user']
        # get or create the user's token
        token, created = Token.objects.get_or_create(user=user)
        # return a response with user token and user id and username
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


'''
def list(self, request):
    pass

def create(self, request):
    pass

def retrieve(self, request, pk=None):
    pass

def update(self, request, pk=None):
    pass

def partial_update(self, request, pk=None):
    pass

def destroy(self, request, pk=None):
    pass
'''