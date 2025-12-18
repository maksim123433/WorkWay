# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('apply/<int:vacancy_id>/', views.apply_to_vacancy, name='apply_to_vacancy'),
    path('api/vacancies/<int:vacancy_id>/otkliks/', views.get_vacancy_otkliks, name='get_vacancy_otkliks'),

]
