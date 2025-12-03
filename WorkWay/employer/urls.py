from django.contrib import admin
from django.urls import path, include

from employer.views import EmployerView

urlpatterns = [
    path("employer/", EmployerView.as_view(), name="employer"),


]
