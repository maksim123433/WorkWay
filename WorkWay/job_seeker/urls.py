from django.contrib import admin
from django.urls import path, include
from job_seeker.views import job_seeker

from django.urls import path
from job_seeker import views

urlpatterns = [
    path('job-seeker/', views.job_seeker, name='job_seeker'),
    # path('create-vacancy/', views.create_vacancy, name='create_vacancy'),
    # path('edit-vacancy/<int:vacancy_id>/', views.edit_vacancy, name='edit_vacancy'),
    # path('view-applications/<int:vacancy_id>/', views.view_applications, name='view_applications'),
]