# views.py
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from employer.models import Vacancy, Application

@login_required
def apply_to_vacancy(request, vacancy_id):
    if request.method == "POST":
        vacancy = get_object_or_404(Vacancy, id=vacancy_id)
        applicant = request.user
        application, created = Application.objects.get_or_create(
            vacancy=vacancy,
            applicant=applicant,
            defaults={'status': 'new'}
        )
        return JsonResponse({'success': created})
    return JsonResponse({'success': False, 'message': 'Метод не поддерживается'})


from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Otklik, Vacancy


@login_required
def get_vacancy_otkliks(request, vacancy_id):
    """Получить все отклики на вакансию в формате JSON для модального окна"""
    vacancy = get_object_or_404(Vacancy, id=vacancy_id)

    # Проверяем, что пользователь - владелец вакансии
    if request.user != vacancy.employer and not request.user.is_staff:
        return JsonResponse({'error': 'Нет доступа'}, status=403)

    # Получаем отклики
    otkliks = Otklik.objects.filter(vacancy=vacancy).select_related(
        'applicant'
    ).order_by('-created_at')

    # Формируем данные для ответа
    otkliks_data = []
    for otklik in otkliks:
        # Основная информация о соискателе
        applicant = otklik.applicant

        otkliks_data.append({
            'id': otklik.id,
            'applicant_id': applicant.id,
            'full_name': f"{applicant.first_name} {applicant.last_name}",
            'email': applicant.email,
            'phone': applicant.phone or 'Не указан',
            'position': applicant.position or 'Не указана',
            'experience': applicant.experience or 'Не указан',
            'skills': applicant.skills or 'Не указаны',
            'city': applicant.city or 'Не указан',
            'avatar_url': applicant.avatar.url if hasattr(applicant,
                                                          'avatar') and applicant.avatar else '/static/images/default-avatar.png',
            'created_at': otklik.created_at.strftime('%d.%m.%Y %H:%M'),
            'has_resume': hasattr(applicant, 'resume') and bool(applicant.resume),  # если есть поле resume
        })

    return JsonResponse({
        'success': True,
        'vacancy_title': vacancy.title,
        'total_count': len(otkliks_data),
        'otkliks': otkliks_data
    })