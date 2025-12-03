from django.contrib import admin
from django.urls import path, include

from profileUser.views import MainUserView

urlpatterns = [
    path("profile/", MainUserView.as_view(), name="profile"),


]
