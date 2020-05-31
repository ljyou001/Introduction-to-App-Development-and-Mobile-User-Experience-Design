from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Product


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'password', 'email', 'is_staff')
        extra_kwargs = {'password': {'write_only': True}}

    # following method is used to control when creating user
    def create(self, validated_data):
        # create temporary user instance with username
        user = User(
            username = validated_data['username'],
        )
        # set the password for this user
        user.set_password(validated_data['password'])
        # call save method which save to database
        user.save()
        return user

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ('id',
            'name',
            'price',
            'discount',
            'quantity',
            'description',
            'picture',
            'created',
            'updated',
        )