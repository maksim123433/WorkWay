from django.shortcuts import render
from django.views.generic import TemplateView

class MainUserView(TemplateView):
    template_name = "profileUser/index.html"

