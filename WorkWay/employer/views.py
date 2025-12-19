from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from .models import Vacancy, Application, Category
from .forms import VacancyForm, VacancySearchForm


@login_required
def employer_dashboard(request):
    """Панель управления работодателя с формой создания вакансии"""

    context = {
        'user': request.user,
    }

    # Если это POST запрос, обрабатываем форму
    if request.method == 'POST':
        form = VacancyForm(request.POST, user=request.user)
        if form.is_valid():
            vacancy = form.save()
            messages.success(request, 'Вакансия успешно создана!')

            # Если это AJAX запрос, возвращаем JSON
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Вакансия создана успешно!',
                    'vacancy_id': vacancy.id
                })
            return redirect('employer_pro')
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': form.errors
                }, status=400)
            context['form'] = form
    else:
        # Инициализируем пустую форму
        context['form'] = VacancyForm(user=request.user)

    # Получаем вакансии текущего пользователя
    vacancies = Vacancy.objects.filter(employer=request.user).order_by('-created_at')

    # Статистика
    active_vacancies = vacancies.filter(is_active=True).count()
    total_applications = Application.objects.filter(
        vacancy__employer=request.user
    ).count()

    # Новые отклики (последние 7 дней)
    from django.utils import timezone
    from datetime import timedelta
    week_ago = timezone.now() - timedelta(days=7)
    new_responses = Application.objects.filter(
        vacancy__employer=request.user,
        created_at__gte=week_ago
    ).count()

    # Применяем фильтры поиска
    search_form = VacancySearchForm(request.GET)
    if search_form.is_valid():
        search = search_form.cleaned_data.get('search')
        status = search_form.cleaned_data.get('status')

        if search:
            vacancies = vacancies.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )

        if status == 'active':
            vacancies = vacancies.filter(is_active=True)
        elif status == 'inactive':
            vacancies = vacancies.filter(is_active=False)

    context.update({
        'vacancies': vacancies,
        'vacancies_count': vacancies.count(),
        'active_vacancies': active_vacancies,
        'total_applications': total_applications,
        'new_responses': new_responses,
        'search_form': search_form,
    })

    return render(request, 'employer/employer_dashboard.html', context)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
import json
from datetime import datetime


@login_required
def get_vacancy_details(request, pk):
    """Получение деталей вакансии для AJAX"""
    try:
        vacancy = get_object_or_404(Vacancy, pk=pk, employer=request.user)

        # Формируем данные для JSON
        data = {
            'id': vacancy.id,
            'title': vacancy.title,
            'description': vacancy.description,
            'location': vacancy.location,
            'salary': vacancy.get_salary_display(),
            'employment_type': vacancy.get_employment_type_display(),
            'experience': vacancy.get_experience_display(),
            'education': vacancy.get_education_display() if vacancy.education else None,
            'currency': vacancy.get_currency_display(),
            'requirements': vacancy.requirements,
            'benefits': vacancy.benefits,
            'skills': vacancy.skills,
            'contact_person': vacancy.contact_person,
            'contact_email': vacancy.contact_email,
            'contact_phone': vacancy.contact_phone,
            'is_active': vacancy.is_active,
            'is_featured': vacancy.is_featured,
            'is_urgent': vacancy.is_urgent,
            'views_count': vacancy.views_count,
            'applications_count': vacancy.applications_count,
            'created_at': vacancy.created_at.strftime('%d.%m.%Y %H:%M'),
            'updated_at': vacancy.updated_at.strftime('%d.%m.%Y %H:%M'),
            'category': str(vacancy.category) if vacancy.category else None,
        }

        return JsonResponse(data, safe=True)

    except Vacancy.DoesNotExist:
        return JsonResponse({'error': 'Вакансия не найдена'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def edit_vacancy(request, pk):
    """Редактирование вакансии через AJAX"""
    vacancy = get_object_or_404(Vacancy, pk=pk, employer=request.user)

    if request.method == 'POST':
        form = VacancyForm(request.POST, instance=vacancy, user=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'success': True,
                'message': 'Вакансия успешно обновлена!'
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            }, status=400)

    # GET запрос - возвращаем форму для редактирования
    form = VacancyForm(instance=vacancy, user=request.user)
    form_html = render(request, 'employer/partials/vacancy_form.html', {
        'form': form,
        'vacancy': vacancy
    }).content.decode('utf-8')

    return JsonResponse({
        'success': True,
        'form_html': form_html,
        'title': f'Редактирование: {vacancy.title}'
    })


@login_required
def toggle_vacancy_status(request, pk):
    """Активация/деактивация вакансии через AJAX"""
    if request.method == 'POST':
        vacancy = get_object_or_404(Vacancy, pk=pk, employer=request.user)
        vacancy.is_active = not vacancy.is_active
        vacancy.save()

        return JsonResponse({
            'success': True,
            'is_active': vacancy.is_active,
            'message': f'Вакансия {"активирована" if vacancy.is_active else "деактивирована"}'
        })

    return JsonResponse({'success': False}, status=400)


@login_required
def delete_vacancy(request, pk):
    """Удаление вакансии через AJAX"""
    if request.method == 'POST':
        vacancy = get_object_or_404(Vacancy, pk=pk, employer=request.user)
        title = vacancy.title
        vacancy.delete()

        return JsonResponse({
            'success': True,
            'message': f'Вакансия "{title}" удалена'
        })

    return JsonResponse({'success': False}, status=400)


@login_required
def duplicate_vacancy(request, pk):
    """Дублирование вакансии через AJAX"""
    if request.method == 'POST':
        original = get_object_or_404(Vacancy, pk=pk, employer=request.user)

        # Создаем копию
        vacancy_copy = Vacancy.objects.get(pk=original.pk)
        vacancy_copy.pk = None
        vacancy_copy.title = f"{original.title} (копия)"
        vacancy_copy.views_count = 0
        vacancy_copy.applications_count = 0
        vacancy_copy.is_active = False
        vacancy_copy.save()

        return JsonResponse({
            'success': True,
            'message': 'Вакансия успешно продублирована!',
            'new_id': vacancy_copy.id
        })

    return JsonResponse({'success': False}, status=400)


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Vacancy
import json


def vacancy_details_api(request, vacancy_id):
    """API endpoint для получения деталей вакансии"""
    try:
        vacancy = get_object_or_404(Vacancy, id=vacancy_id)

        # Увеличиваем счетчик просмотров
        vacancy.increment_views()

        # Подготавливаем данные для JSON
        data = {
            'id': vacancy.id,
            'title': vacancy.title,
            'employer_name': vacancy.employer.username if vacancy.employer else 'Не указано',
            'location': vacancy.location,
            'employment_type': vacancy.employment_type,
            'employment_type_display': vacancy.get_employment_type_display(),
            'salary_min': vacancy.salary_min,
            'salary_max': vacancy.salary_max,
            'currency': vacancy.currency,
            'description': vacancy.description,
            'requirements': vacancy.requirements,
            'benefits': vacancy.benefits,
            'experience': vacancy.experience,
            'experience_display': vacancy.get_experience_display(),
            'education': vacancy.education,
            'education_display': vacancy.get_education_display() if vacancy.education else 'Не указано',
            'skills': vacancy.skills,
            'contact_person': vacancy.contact_person,
            'contact_email': vacancy.contact_email,
            'contact_phone': vacancy.contact_phone,
            'is_active': vacancy.is_active,
            'is_featured': vacancy.is_featured,
            'is_urgent': vacancy.is_urgent,
            'views_count': vacancy.views_count,
            'applications_count': vacancy.applications_count,
            'created_at': vacancy.created_at.isoformat(),
            'updated_at': vacancy.updated_at.isoformat(),
        }

        return JsonResponse(data)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from django.shortcuts import get_object_or_404, render
from responses.models import Otklik
from employer.models import Vacancy

from django.shortcuts import get_object_or_404, render
from employer.models import Vacancy
from responses.models import  Otklik

from django.http import JsonResponse
from django.shortcuts import get_object_or_404


@login_required
def otcliki(request, vacancia_id):
    vacancy = get_object_or_404(Vacancy, id=vacancia_id)

    persons = Otklik.objects.filter(vacancy=vacancy)

    persons_data = []
    for person in persons:
        applicant = person.applicant
        persons_data.append({
            'id': applicant.id,
            'first_name': applicant.first_name,
            'last_name': applicant.last_name,
            'email': applicant.email,
            'phone': applicant.phone,
            'city': applicant.city,
            'country': applicant.country,
            'citizenship': applicant.citizenship,
            'account_type': applicant.account_type,
            'position': applicant.position,
            'experience': applicant.experience,
            'skills': applicant.skills,
            'education': applicant.education,
            'previous_positions': applicant.get_previous_positions(),
            'about': applicant.about,
            'employment_type': applicant.employment_type,
            'work_schedule': applicant.work_schedule,
            'relocation_ready': applicant.relocation_ready,
            'business_trips_ready': applicant.business_trips_ready,
            'birth_date': applicant.birth_date.strftime('%Y-%m-%d') if applicant.birth_date else None,
            'gender': applicant.gender,
            'marital_status': applicant.marital_status,
            'languages': applicant.languages,
            'driving_license': applicant.driving_license,
            'driver_license_category': applicant.driver_license_category,
            'achievements': applicant.achievements,
            'portfolio_link': applicant.portfolio_link,
            'github_url': applicant.github_url,
            'company_name': applicant.company_name,
            'industry': applicant.industry,
            'company_size': applicant.company_size,
            'company_description': applicant.company_description,
            'company_website': applicant.company_website,
            'company_address': applicant.company_address,
            'terms_accepted': applicant.terms_accepted,
            'newsletter': applicant.newsletter,
            'created_at': person.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        })

    return JsonResponse({
        'success': True,
        'vacancy_id': vacancia_id,
        'count': len(persons_data),
        'persons': persons_data
    })
