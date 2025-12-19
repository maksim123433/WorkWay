from django.contrib import admin
from django.urls import path, include

from profileUser.views import MyLoginView, logout_view, edit_profile, export_profile_pdf,candidate_list, download_candidate_pdf
from profileUser.views import ProfileView

urlpatterns = [

    path("login/", MyLoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path('logout/', logout_view, name='logout'),
    path('edit/', edit_profile, name='edit'),
    path('profile/<int:pk>/pdf/', export_profile_pdf, name='export_profile_pdf'),


    # Простой список кандидатов для скачивания PDF
    path('candidates/', candidate_list, name='candidate_list'),

    # Прямая ссылка на скачивание PDF кандидата
    path('download-candidate/<int:pk>/', download_candidate_pdf, name='download_candidate')




]
