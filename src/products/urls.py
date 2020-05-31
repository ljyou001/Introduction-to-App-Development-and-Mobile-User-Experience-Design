from django.urls import path
from .views import UserListCreateView, UserRetrieveUpdateView, CustomAuthToken

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('users/', UserListCreateView.as_view(), name="user-list"),
    path('user/<int:pk>/', UserRetrieveUpdateView.as_view(), name="user-detail"),
    path('api-token-auth/', CustomAuthToken.as_view()),
]