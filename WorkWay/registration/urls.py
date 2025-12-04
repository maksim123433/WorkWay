

from django.contrib import admin
from django.urls import path, include

from registration.views import RegistView

urlpatterns = [
    path("registr/", RegistView.as_view(), name = "register"),
]
