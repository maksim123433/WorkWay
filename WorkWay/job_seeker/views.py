from django.shortcuts import render
from django.db.models import Q
from django.core.paginator import Paginator
from employer.models import Vacancy

def job_seeker(request):
    vacancies = Vacancy.objects.all()  # Все вакансии, не только работодателя

    # --- Фильтры ---
    search_query = request.GET.get('search', '')
    if search_query:
        vacancies = vacancies.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(employer__username__icontains=search_query)
        )

    # Специализация / категория
    categories = request.GET.getlist('category')
    if categories:
        vacancies = vacancies.filter(category__in=categories)

    # Тип занятости
    employment_types = request.GET.getlist('employment_type')
    if employment_types:
        vacancies = vacancies.filter(employment_type__in=employment_types)

    # Опыт
    experience = request.GET.get('experience')
    if experience:
        vacancies = vacancies.filter(experience=experience)

    # Город
    location = request.GET.get('location')
    if location:
        vacancies = vacancies.filter(location__icontains=location)

    # Зарплата
    salary_min = request.GET.get('salary_min')
    salary_max = request.GET.get('salary_max')
    if salary_min:
        vacancies = vacancies.filter(salary_min__gte=salary_min)
    if salary_max:
        vacancies = vacancies.filter(salary_max__lte=salary_max)

    # Метки: срочно / рекомендуем
    if request.GET.get('urgent') == '1':
        vacancies = vacancies.filter(is_urgent=True)
    if request.GET.get('featured') == '1':
        vacancies = vacancies.filter(is_featured=True)

    # Сортировка
    sort_by = request.GET.get('sort', '-created_at')
    vacancies = vacancies.order_by(sort_by)

    # Пагинация
    paginator = Paginator(vacancies, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'vacancies': page_obj,
    }
    return render(request, 'job_seeker/employees.html', context)
