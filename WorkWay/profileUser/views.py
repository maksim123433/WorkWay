from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView

from profileUser.forms import CustomAuthenticationForm


class MyLoginView(LoginView):
    template_name = 'profileUser/index.html'
    form_class = CustomAuthenticationForm

    next_page = reverse_lazy('profile')


from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Profile
from django.shortcuts import get_object_or_404


class ProfileView(LoginRequiredMixin, ListView):
    model = Profile
    template_name = 'ProfileUser/profile.html'
    context_object_name = 'profile'

    def get_queryset(self):
        # Получаем профиль текущего пользователя
        return get_object_or_404(Profile, user=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Добавляем дополнительные данные в контекст
        profile = self.get_queryset()

        # Статистика для соискателя (можно вынести в отдельную модель/метод)
        if profile.is_job_seeker():
            # Здесь можно добавить логику для подсчета статистики
            # Пока используем заглушки
            context['stats'] = {
                'sent_responses': 12,
                'viewed_responses': 8,
                'invitations': 3,
                'total_views': 45
            }

        # Вакансии для работодателя (заглушки)
        if profile.is_employer():
            context['vacancies'] = [
                {
                    'title': 'Senior Frontend Developer',
                    'status': 'active',
                    'location': 'Удаленно',
                    'salary': 'От 200 000 ₽',
                    'responses': 24
                },
                {
                    'title': 'UI/UX Designer',
                    'status': 'active',
                    'location': 'Москва',
                    'salary': 'От 150 000 ₽',
                    'responses': 18
                },
                {
                    'title': 'Backend Developer',
                    'status': 'closed',
                    'location': 'Санкт-Петербург',
                    'salary': 'От 180 000 ₽',
                    'responses': 32
                }
            ]

        # Добавляем пользователя в контекст
        context['user'] = self.request.user

        return context