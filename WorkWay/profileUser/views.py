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

from django.shortcuts import redirect
from django.contrib.auth import logout

def logout_view(request):
    logout(request)  # удаляет данные пользователя из сессии
    return redirect('main')  # перенаправление на главную страницу

from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

# views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ProfileEditForm


@login_required
def edit_profile(request):
    profile = request.user

    if request.method == 'POST':
        form = ProfileEditForm(request.POST, instance=profile)

        if form.is_valid():
            form.save()
            messages.success(request, 'Профиль успешно обновлен!')
            return redirect('profile')
        else:
            messages.error(request, 'Пожалуйста, исправьте ошибки в форме')
    else:
        form = ProfileEditForm(instance=profile)

    context = {
        'form': form,
        'profile': profile,
    }

    return render(request, 'profileUser/edit_user.html', context)


import io
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from .models import Profile
import io
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from django.conf import settings
from .models import Profile


def register_cyrillic_fonts():
    """
    Регистрирует кириллические шрифты для ReportLab
    """
    try:
        # Попробуем использовать стандартный кириллический шрифт DejaVu
        font_path = os.path.join(settings.BASE_DIR, 'static', 'fonts', 'DejaVuSans.ttf')
        if os.path.exists(font_path):
            pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
            pdfmetrics.registerFont(TTFont('DejaVuSans-Bold',
                                           os.path.join(settings.BASE_DIR, 'static', 'fonts', 'DejaVuSans-Bold.ttf')))
            return 'DejaVuSans'
        else:
            # Или используем Arial, если он есть в системе
            try:
                pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
                pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
                return 'Arial'
            except:
                # Используем Helvetica как запасной вариант
                return 'Helvetica'
    except:
        return 'Helvetica'


@login_required
def export_profile_pdf(request, pk=None):
    """
    Единая функция для экспорта профиля в PDF
    Принимает request и pk из URL
    """
    # Определяем какой профиль экспортировать
    if pk is None:
        # Экспорт своего профиля
        profile = request.user
    else:
        # Экспорт указанного профиля
        profile = get_object_or_404(Profile, pk=pk)


    # Регистрируем кириллические шрифты
    cyrillic_font = register_cyrillic_fonts()
    bold_font = f'{cyrillic_font}-Bold' if cyrillic_font != 'Helvetica' else 'Helvetica-Bold'

    # Генерация PDF
    buffer = io.BytesIO()

    # Создаем PDF документ с UTF-8 кодировкой
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
        encoding='utf-8'  # Явно указываем кодировку
    )

    elements = []
    styles = getSampleStyleSheet()

    # Создаем стили с кириллическими шрифтами
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName=bold_font,
        fontSize=16,
        spaceAfter=12,
        textColor=colors.HexColor('#1a237e'),
        encoding='utf-8'
    )

    section_style = ParagraphStyle(
        'CustomSection',
        parent=styles['Heading2'],
        fontName=bold_font,
        fontSize=14,
        spaceAfter=8,
        spaceBefore=12,
        textColor=colors.HexColor('#283593'),
        encoding='utf-8'
    )

    # Основной стиль для текста
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontName=cyrillic_font,
        fontSize=10,
        leading=12,
        encoding='utf-8'
    )

    bold_style = ParagraphStyle(
        'CustomBold',
        parent=normal_style,
        fontName=bold_font,
        encoding='utf-8'
    )

    # Функция для безопасного создания Paragraph с проверкой текста
    def safe_paragraph(text, style):
        """Создает Paragraph с безопасной обработкой текста"""
        if text is None:
            text = ""
        # Заменяем None на пустую строку
        text = str(text) if text is not None else ""
        # Убираем лишние пробелы и переносы
        text = ' '.join(text.split())
        return Paragraph(text, style)

    # Заголовок документа
    title = f"Профиль: {profile.first_name} {profile.last_name}"
    elements.append(safe_paragraph(title, title_style))
    elements.append(Spacer(1, 12))

    # Общая информация для всех типов аккаунтов
    elements.append(safe_paragraph("Общая информация", section_style))

    # Создаем данные для таблицы с безопасными значениями
    general_data = [
        ["Поле", "Значение"],
        ["Имя", profile.first_name or "Не указано"],
        ["Фамилия", profile.last_name or "Не указано"],
        ["Email", profile.email or "Не указано"],
        ["Тип аккаунта", profile.get_account_type_display() or "Не указано"],
        ["Телефон", profile.phone or "Не указано"],
        ["Город", profile.city or "Не указано"],
        ["Страна", profile.country or "Не указано"],
    ]

    # Преобразуем все значения в безопасные строки
    safe_general_data = []
    for row in general_data:
        safe_row = []
        for cell in row:
            safe_cell = str(cell) if cell is not None else ""
            safe_row.append(safe_cell)
        safe_general_data.append(safe_row)

    general_table = Table(safe_general_data, colWidths=[2 * inch, 4 * inch])
    general_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8eaf6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), bold_font),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 1), (-1, -1), cyrillic_font),
    ]))

    elements.append(general_table)
    elements.append(Spacer(1, 20))

    # Данные в зависимости от типа аккаунта
    if profile.account_type == 'job_seeker':
        elements.append(safe_paragraph("Информация для соискателя", section_style))

        # Основная информация соискателя
        job_seeker_data = [
            ["Поле", "Значение"],
            ["Желаемая должность", profile.position or "Не указано"],
            ["Опыт работы", profile.experience or "Не указано"],
            ["Тип занятости", profile.get_employment_type_display() if profile.employment_type else "Не указано"],
            ["График работы", profile.get_work_schedule_display() if profile.work_schedule else "Не указано"],
            ["Готовность к переезду", "Да" if profile.relocation_ready else "Нет"],
            ["Готовность к командировкам", "Да" if profile.business_trips_ready else "Нет"],
            ["Гражданство", profile.citizenship or "Не указано"],
        ]

        if profile.birth_date:
            job_seeker_data.append(["Дата рождения", profile.birth_date.strftime("%d.%m.%Y")])

        job_seeker_data.extend([
            ["Пол", profile.get_gender_display() if profile.gender else "Не указано"],
            ["Семейное положение", profile.get_marital_status_display() if profile.marital_status else "Не указано"],
            ["Водительские права", "Да" if profile.driving_license else "Нет"],
        ])

        if profile.driver_license_category:
            job_seeker_data.append(["Категория прав", profile.driver_license_category])

        # Преобразуем данные для безопасности
        safe_job_seeker_data = []
        for row in job_seeker_data:
            safe_row = []
            for cell in row:
                safe_cell = str(cell) if cell is not None else ""
                safe_row.append(safe_cell)
            safe_job_seeker_data.append(safe_row)

        job_seeker_table = Table(safe_job_seeker_data, colWidths=[2 * inch, 4 * inch])
        job_seeker_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8f5e8')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1b5e20')),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), bold_font),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f1f8e9')),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 1), (-1, -1), cyrillic_font),
        ]))

        elements.append(job_seeker_table)
        elements.append(Spacer(1, 20))

        # Навыки
        if profile.skills:
            elements.append(safe_paragraph("Ключевые навыки", section_style))
            elements.append(safe_paragraph(profile.skills, normal_style))
            elements.append(Spacer(1, 12))

        # Образование
        if profile.education:
            elements.append(safe_paragraph("Образование", section_style))
            elements.append(safe_paragraph(profile.education, normal_style))
            elements.append(Spacer(1, 12))

        # Предыдущие должности
        previous_positions = profile.get_previous_positions()
        if previous_positions:
            elements.append(safe_paragraph("Опыт работы (детально)", section_style))

            for idx, position in enumerate(previous_positions, 1):
                position_name = position.get('position', '') or ''
                period = position.get('period', '') or ''
                pos_title = f"{idx}. {position_name} ({period})"
                elements.append(safe_paragraph(pos_title, bold_style))

                company = position.get('company', '')
                if company:
                    elements.append(safe_paragraph(f"Компания: {company}", normal_style))

                description = position.get('description', '')
                if description:
                    elements.append(safe_paragraph(f"Описание: {description}", normal_style))

                elements.append(Spacer(1, 8))

        # Языки
        if profile.languages:
            elements.append(safe_paragraph("Иностранные языки", section_style))
            elements.append(safe_paragraph(profile.languages, normal_style))
            elements.append(Spacer(1, 12))

        # Достижения
        if profile.achievements:
            elements.append(safe_paragraph("Достижения", section_style))
            elements.append(safe_paragraph(profile.achievements, normal_style))
            elements.append(Spacer(1, 12))

        # О себе
        if profile.about:
            elements.append(safe_paragraph("О себе", section_style))
            elements.append(safe_paragraph(profile.about, normal_style))
            elements.append(Spacer(1, 12))

        # Ссылки
        links = []
        if profile.portfolio_link:
            links.append(f"Портфолио: {profile.portfolio_link}")
        if profile.github_url:
            links.append(f"GitHub: {profile.github_url}")

        if links:
            elements.append(safe_paragraph("Ссылки", section_style))
            for link in links:
                elements.append(safe_paragraph(link, normal_style))
            elements.append(Spacer(1, 12))

    elif profile.account_type == 'employer':
        elements.append(safe_paragraph("Информация для работодателя", section_style))

        # Основная информация работодателя
        employer_data = [
            ["Поле", "Значение"],
            ["Название компании", profile.company_name or "Не указано"],
            ["Сфера деятельности", profile.industry or "Не указано"],
            ["Количество сотрудников", profile.company_size or "Не указано"],
        ]

        if profile.company_website:
            employer_data.append(["Сайт компании", profile.company_website])

        if profile.company_address:
            employer_data.append(["Адрес компании", profile.company_address])

        # Преобразуем данные для безопасности
        safe_employer_data = []
        for row in employer_data:
            safe_row = []
            for cell in row:
                safe_cell = str(cell) if cell is not None else ""
                safe_row.append(safe_cell)
            safe_employer_data.append(safe_row)

        employer_table = Table(safe_employer_data, colWidths=[2 * inch, 4 * inch])
        employer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fff3e0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#e65100')),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), bold_font),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#fff8e1')),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 1), (-1, -1), cyrillic_font),
        ]))

        elements.append(employer_table)
        elements.append(Spacer(1, 20))

        # Описание компании
        if profile.company_description:
            elements.append(safe_paragraph("О компании", section_style))
            elements.append(safe_paragraph(profile.company_description, normal_style))
            elements.append(Spacer(1, 12))

    # Футер с датой генерации
    elements.append(Spacer(1, 20))
    current_time = datetime.now().strftime("%d.%m.%Y %H:%M")
    footer_text = f"Документ сгенерирован: {current_time}"

    footer_style = ParagraphStyle(
        'Footer',
        parent=normal_style,
        fontSize=8,
        textColor=colors.grey,
        alignment=1,  # Выравнивание по центру
        fontName=cyrillic_font,
        encoding='utf-8'
    )

    elements.append(safe_paragraph(footer_text, footer_style))

    # Собираем PDF
    try:
        doc.build(elements)
    except Exception as e:
        # В случае ошибки возвращаем сообщение
        return HttpResponse(f"Ошибка при создании PDF: {str(e)}", status=500)

    # Получаем содержимое буфера
    pdf = buffer.getvalue()
    buffer.close()

    # Формируем имя файла (безопасное для файловой системы)
    safe_filename = f"profile_{profile.id}_{profile.account_type}.pdf"

    # Создаем HTTP ответ с правильными заголовками
    response = HttpResponse(pdf, content_type='application/pdf; charset=utf-8')
    response['Content-Disposition'] = f'attachment; filename="{safe_filename}"'
    response['Content-Length'] = len(pdf)

    return response


# views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Profile


@login_required
def candidate_list(request):
    """
    Простой список всех кандидатов с ссылками на скачивание PDF
    """
    # Получаем всех соискателей
    candidates = Profile.objects.filter(account_type='job_seeker')

    # Можно добавить фильтрацию по правам
    # Например, только если пользователь работодатель
    if request.user.account_type != 'employer' and not request.user.is_staff:
        candidates = candidates.filter(id=request.user.id)

    context = {
        'candidates': candidates
    }

    return render(request, 'profileUser/candidate_search.html', context)


# Или еще проще - один кандидат = одна ссылка
@login_required
def download_candidate_pdf(request, pk):
    """
    Прямой редирект на скачивание PDF кандидата
    """
    candidate = get_object_or_404(Profile, pk=pk)

    # Проверка прав (работодатели могут скачивать всех, соискатели только себя)
    if request.user.account_type == 'job_seeker' and request.user.id != candidate.id:
        return HttpResponse("Доступ запрещен", status=403)

    # Используем существующую функцию export_profile_pdf
    return export_profile_pdf(request, pk)