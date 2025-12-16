from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView

from profileUser.forms import CustomAuthenticationForm


class MyLoginView(LoginView):
    template_name = 'profileUser/index.html'
    form_class =CustomAuthenticationForm

    next_page = reverse_lazy('profile')


from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Profile
from django.shortcuts import get_object_or_404

from django.views.generic import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import Profile


class ProfileView(LoginRequiredMixin, DetailView):
    model = Profile
    template_name = 'ProfileUser/profile.html'
    context_object_name = 'profile'

    def get_object(self, queryset=None):
        # Текущий пользователь уже является Profile
        return self.request.user

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        profile = self.get_object()


        # Определяем тип аккаунта
        is_job_seeker = profile.account_type == 'job_seeker'
        is_employer = profile.account_type == 'employer'

        # Обработка JSON поля previous_positions
        previous_positions = []
        if profile.previous_positions:
            try:
                import json
                positions_data = profile.previous_positions
                if isinstance(positions_data, str):
                    positions_data = json.loads(positions_data)

                if isinstance(positions_data, list):
                    for pos in positions_data:
                        if isinstance(pos, dict):
                            previous_positions.append({
                                'period': pos.get('period', ''),
                                'position': pos.get('position', ''),
                                'company': pos.get('company', ''),
                                'description': pos.get('description', ''),
                                'order': pos.get('order', 0)
                            })
            except (json.JSONDecodeError, TypeError) as e:
                print(f"Ошибка обработки previous_positions: {e}")
                previous_positions = []

        # Сортируем по порядку
        previous_positions.sort(key=lambda x: x.get('order', 0))

        # Основные данные профиля
        context.update({
            'is_job_seeker': is_job_seeker,
            'is_employer': is_employer,
            'previous_positions': previous_positions,

            'profile_completion': self.calculate_profile_completion(profile),
        })

        # Данные для соискателя
        if is_job_seeker:
            context.update({
                'skills_list': self.parse_skills(profile.skills),
                'languages_list': self.parse_languages(profile.languages),
                'stats': self.get_job_seeker_stats(profile),
                'profile_sections': self.get_job_seeker_sections(profile),
            })

        # Данные для работодателя
        elif is_employer:
            context.update({
                'company_info_complete': self.check_company_info_complete(profile),
                'stats': self.get_employer_stats(profile),
                'profile_sections': self.get_employer_sections(profile),
            })

        return context

    def calculate_profile_completion(self, profile):
        """Рассчитывает процент заполнения профиля"""
        total_fields = 0
        filled_fields = 0

        # Основные поля
        basic_fields = ['first_name', 'last_name', 'email', 'phone',
                        'city', 'country', 'account_type']

        for field in basic_fields:
            total_fields += 1
            if getattr(profile, field, None):
                filled_fields += 1

        # Поля в зависимости от типа аккаунта
        if profile.account_type == 'job_seeker':
            job_seeker_fields = ['position', 'experience', 'skills',
                                 'education', 'employment_type']
            for field in job_seeker_fields:
                total_fields += 1
                if getattr(profile, field, None):
                    filled_fields += 1

        elif profile.account_type == 'employer':
            employer_fields = ['company_name', 'industry', 'company_description']
            for field in employer_fields:
                total_fields += 1
                if getattr(profile, field, None):
                    filled_fields += 1

        return round((filled_fields / total_fields) * 100) if total_fields > 0 else 0

    def parse_skills(self, skills_text):
        """Парсит навыки из текстового поля"""
        if not skills_text:
            return []

        skills = []
        for line in skills_text.split('\n'):
            line = line.strip()
            if line:
                # Убираем маркеры списка
                if line.startswith('- '):
                    line = line[2:]
                elif line.startswith('• '):
                    line = line[2:]
                skills.append(line)

        return skills

    def parse_languages(self, languages_text):
        """Парсит языки из текстового поля"""
        if not languages_text:
            return []

        languages = []
        for line in languages_text.split('\n'):
            line = line.strip()
            if line:
                languages.append(line)

        return languages

    def get_job_seeker_stats(self, profile):
        """Статистика для соискателя (заглушки, можно заменить реальными данными)"""
        return {
            'profile_views': 45,
            'vacancies_viewed': 128,
            'responses_sent': 12,
            'responses_viewed': 8,
            'invitations_received': 3,
            'interviews_passed': 1,
            'saved_vacancies': 7,
        }

    def get_employer_stats(self, profile):
        """Статистика для работодателя (заглушки, можно заменить реальными данными)"""
        return {
            'profile_views': 89,
            'vacancies_published': 5,
            'active_vacancies': 3,
            'total_responses': 74,
            'new_responses': 12,
            'candidates_invited': 8,
            'positions_filled': 2,
        }

    def get_job_seeker_sections(self, profile):
        """Определяет, какие секции профиля заполнены у соискателя"""
        return {
            'basic_info': bool(profile.first_name and profile.last_name and profile.email),
            'career': bool(profile.position or profile.experience),
            'education': bool(profile.education),
            'skills': bool(profile.skills),
            'experience': bool(profile.previous_positions or profile.experience),
            'languages': bool(profile.languages),
            'additional_info': bool(profile.about or profile.achievements),
            'portfolio': bool(profile.portfolio_link or profile.github_url),
        }

    def get_employer_sections(self, profile):
        """Определяет, какие секции профиля заполнены у работодателя"""
        return {
            'company_info': bool(profile.company_name and profile.industry),
            'company_description': bool(profile.company_description),
            'contacts': bool(profile.phone and profile.email),
            'website': bool(profile.company_website),
            'address': bool(profile.company_address),
        }

    def check_company_info_complete(self, profile):
        """Проверяет, полностью ли заполнена информация о компании"""
        required_fields = ['company_name', 'industry', 'company_description']
        return all(bool(getattr(profile, field)) for field in required_fields)