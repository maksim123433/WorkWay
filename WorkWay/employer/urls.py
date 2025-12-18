
from django.urls import path
from employer import views

urlpatterns = [
    path('employer/', views.employer_dashboard, name='employer_pro'),
    path('employer/vacancy/<int:pk>/details/', views.get_vacancy_details, name='vacancy_details'),
    path('employer/vacancy/<int:pk>/toggle/', views.toggle_vacancy_status, name='vacancy_toggle'),
    path('employer/vacancy/<int:pk>/delete/', views.delete_vacancy, name='vacancy_delete'),
    path('employer/vacancy/<int:pk>/edit/', views.edit_vacancy, name='vacancy_edit'),
    path('api/vacancies/<int:vacancy_id>/details/', views.vacancy_details_api, name='vacancy_details_api'),
    path('otkliki/<int:vacancia_id>/', views.otcliki, name='otkliki'),

]