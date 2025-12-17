from django.contrib import admin
from django.urls import path, include

from profileUser.views import MyLoginView, logout_view
from profileUser.views import ProfileView

urlpatterns = [

    path("login/", MyLoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path('logout/', logout_view, name='logout'),


]
