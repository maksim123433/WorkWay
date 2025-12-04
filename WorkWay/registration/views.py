from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.
class RegistView(TemplateView):
    template_name = "registration/registration.html"
