from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.
class JobSeekerView(TemplateView):
    template_name = "job_seeker/employees.html"