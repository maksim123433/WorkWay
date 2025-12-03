from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.
class EmployerView(TemplateView):
    template_name = "employer/employer_dashboard.html"


from django.shortcuts import render

# Create your views here.
