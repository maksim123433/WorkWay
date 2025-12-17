from django.db import models
from django.conf import settings  # Добавьте этот импорт
from django.contrib.auth import get_user_model  # Или этот вариант
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    """Модель для категорий вакансий"""
    name = models.CharField(max_length=100, verbose_name="Название категории")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']

    def __str__(self):
        return self.name


class EmploymentType(models.TextChoices):
    """Типы занятости"""
    FULL_TIME = 'full', 'Полная занятость'
    PART_TIME = 'part', 'Частичная занятость'
    PROJECT = 'project', 'Проектная работа'
    INTERNSHIP = 'internship', 'Стажировка'
    REMOTE = 'remote', 'Удалённая работа'
    FREELANCE = 'freelance', 'Фриланс'


class ExperienceLevel(models.TextChoices):
    """Уровень опыта"""
    NO_EXPERIENCE = 'no', 'Без опыта'
    JUNIOR = 'junior', 'Junior (до 1 года)'
    MIDDLE = 'middle', 'Middle (1-3 года)'
    SENIOR = 'senior', 'Senior (3-5 лет)'
    LEAD = 'lead', 'Lead (более 5 лет)'


class EducationLevel(models.TextChoices):
    """Уровень образования"""
    SECONDARY = 'secondary', 'Среднее'
    SPECIALIZED = 'specialized', 'Среднее специальное'
    INCOMPLETE_HIGHER = 'incomplete_higher', 'Неполное высшее'
    BACHELOR = 'bachelor', 'Бакалавр'
    MASTER = 'master', 'Магистр'
    PHD = 'phd', 'Кандидат наук'
    DOCTOR = 'doctor', 'Доктор наук'


class Currency(models.TextChoices):
    """Валюты"""
    RUB = 'RUB', '₽ Рубли'
    USD = 'USD', '$ Доллары'
    EUR = 'EUR', '€ Евро'
    KZT = 'KZT', '₸ Тенге'
    BYN = 'BYN', 'Br Белорусские рубли'


class Vacancy(models.Model):
    """Модель вакансии"""
    # Основная информация
    title = models.CharField(max_length=200, verbose_name="Название должности")


    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vacancies',
        verbose_name="Работодатель"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Категория"
    )

    # Местоположение и тип работы
    location = models.CharField(
        max_length=200,
        verbose_name="Местоположение",
        help_text="Например: Москва, удалённо"
    )
    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
        verbose_name="Тип занятости"
    )

    # Зарплата
    salary_min = models.PositiveIntegerField(
        verbose_name="Зарплата от",
        null=True,
        blank=True,
        help_text="Минимальная зарплата"
    )
    salary_max = models.PositiveIntegerField(
        verbose_name="Зарплата до",
        null=True,
        blank=True,
        help_text="Максимальная зарплата"
    )
    currency = models.CharField(
        max_length=3,
        choices=Currency.choices,
        default=Currency.RUB,
        verbose_name="Валюта"
    )

    # Описание
    description = models.TextField(
        verbose_name="Описание вакансии",
        help_text="Опишите должностные обязанности"
    )
    requirements = models.TextField(
        verbose_name="Требования к кандидату",
        blank=True,
        help_text="Опыт работы, навыки, образование..."
    )
    benefits = models.TextField(
        verbose_name="Мы предлагаем",
        blank=True,
        help_text="Условия работы, бонусы, льготы..."
    )

    # Требования к кандидату
    experience = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.MIDDLE,
        verbose_name="Требуемый опыт"
    )
    education = models.CharField(
        max_length=50,
        choices=EducationLevel.choices,
        blank=True,
        null=True,
        verbose_name="Образование"
    )
    skills = models.TextField(
        verbose_name="Ключевые навыки",
        blank=True,
        help_text="Укажите ключевые навыки через запятую"
    )

    # Контактная информация
    contact_person = models.CharField(
        max_length=100,
        verbose_name="Контактное лицо",
        blank=True
    )
    contact_email = models.EmailField(
        verbose_name="Контактный email",
        blank=True
    )
    contact_phone = models.CharField(
        max_length=20,
        verbose_name="Контактный телефон",
        blank=True
    )

    # Статус и метаданные
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активна"
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Рекомендуемая"
    )
    is_urgent = models.BooleanField(
        default=False,
        verbose_name="Срочная"
    )

    # Статистика
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество просмотров"
    )
    applications_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество откликов"
    )

    # Даты
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления"
    )

    class Meta:
        verbose_name = "Вакансия"
        verbose_name_plural = "Вакансии"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active']),
            models.Index(fields=['employer']),
        ]

    def __str__(self):
        User = get_user_model()  # Получаем модель пользователя
        return f"{self.title} - {self.employer.username}"

    def get_display_name(self):
        """Получить отображаемое имя для модели"""
        return self.title

    def get_employment_type_display(self):
        """Получить отображаемое значение типа занятости"""
        return dict(EmploymentType.choices).get(self.employment_type, '')

    def get_experience_display(self):
        """Получить отображаемое значение опыта"""
        return dict(ExperienceLevel.choices).get(self.experience, '')

    def get_currency_display(self):
        """Получить отображаемое значение валюты"""
        return dict(Currency.choices).get(self.currency, '')

    def get_education_display(self):
        """Получить отображаемое значение образования"""
        if self.education:
            return dict(EducationLevel.choices).get(self.education, '')
        return ''

    def get_category_display(self):
        """Получить отображаемое название категории"""
        return self.category.name if self.category else 'IT'

    def get_company_display(self):
        """Получить отображаемое название компании"""
        # Проверяем, есть ли у пользователя Profile с полем company_name
        try:
            if hasattr(self.employer, 'company_name') and self.employer.company_name:
                return self.employer.company_name
        except AttributeError:
            pass
        return self.employer.username

    def get_skills_display(self):
        """Получить отображаемые навыки"""
        return ', '.join(self.get_skills_list())

    def get_short_description(self):
        """Короткое описание вакансии"""
        return self.description[:200] + '...' if len(self.description) > 200 else self.description

    def get_short_requirements(self):
        """Короткие требования"""
        return self.requirements[:200] + '...' if len(self.requirements) > 200 else self.requirements

    def get_short_benefits(self):
        """Короткие преимущества"""
        return self.benefits[:200] + '...' if len(self.benefits) > 200 else self.benefits

    @property
    def has_salary(self):
        """Есть ли указана зарплата"""
        return bool(self.salary_min or self.salary_max)

    @property
    def salary_range(self):
        """Диапазон зарплаты"""
        return {
            'min': self.salary_min or 0,
            'max': self.salary_max or 0
        }

    @property
    def days_since_created(self):
        """Количество дней с момента создания"""
        from django.utils import timezone
        return (timezone.now() - self.created_at).days

    @property
    def is_new(self):
        """Вакансия новая (менее 3 дней)"""
        return self.days_since_created < 3

    def get_salary_display(self):
        """Отображение зарплаты в удобном формате"""
        if self.salary_min and self.salary_max:
            return f"{self.salary_min:,} - {self.salary_max:,} {self.get_currency_display()}"
        elif self.salary_min:
            return f"от {self.salary_min:,} {self.get_currency_display()}"
        elif self.salary_max:
            return f"до {self.salary_max:,} {self.get_currency_display()}"
        else:
            return "По договорённости"

    def get_experience_display_short(self):
        """Короткое отображение опыта"""
        experience_map = {
            'no': 'Без опыта',
            'junior': 'До 1 года',
            'middle': '1-3 года',
            'senior': '3-5 лет',
            'lead': 'Более 5 лет'
        }
        return experience_map.get(self.experience, 'Не указано')

    def increment_views(self):
        """Увеличить счетчик просмотров"""
        self.views_count += 1
        self.save(update_fields=['views_count'])

    def increment_applications(self):
        """Увеличить счетчик откликов"""
        self.applications_count += 1
        self.save(update_fields=['applications_count'])

    def get_skills_list(self):
        """Получить список навыков"""
        if self.skills:
            return [skill.strip() for skill in self.skills.split(',')]
        return []

    @property
    def is_expired(self):
        """Проверка, истекла ли вакансия"""
        if self.expires_at:
            from django.utils import timezone
            return timezone.now() > self.expires_at
        return False


class Application(models.Model):
    """Модель отклика на вакансию"""
    vacancy = models.ForeignKey(
        Vacancy,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name="Вакансия"
    )

    # Используйте AUTH_USER_MODEL
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Изменено здесь
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name="Соискатель"
    )

    cover_letter = models.TextField(
        verbose_name="Сопроводительное письмо",
        blank=True
    )
    resume_file = models.FileField(
        upload_to='resumes/%Y/%m/%d/',
        null=True,
        blank=True,
        verbose_name="Файл резюме"
    )

    # Статус отклика
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('reviewed', 'Просмотрено'),
        ('invited', 'Приглашён на собеседование'),
        ('rejected', 'Отклонено'),
        ('accepted', 'Принято'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Статус"
    )

    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата отклика")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Отклик"
        verbose_name_plural = "Отклики"
        unique_together = ['vacancy', 'applicant']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.applicant.username} → {self.vacancy.title}"

    def save(self, *args, **kwargs):
        """При сохранении нового отклика увеличиваем счетчик"""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.vacancy.increment_applications()


class SavedVacancy(models.Model):
    """Сохраненные вакансии пользователей"""

    # Используйте AUTH_USER_MODEL
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Изменено здесь
        on_delete=models.CASCADE,
        related_name='saved_vacancies',
        verbose_name="Пользователь"
    )

    vacancy = models.ForeignKey(
        Vacancy,
        on_delete=models.CASCADE,
        related_name='saved_by',
        verbose_name="Вакансия"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата сохранения")

    class Meta:
        verbose_name = "Сохраненная вакансия"
        verbose_name_plural = "Сохраненные вакансии"
        unique_together = ['user', 'vacancy']

    def __str__(self):
        return f"{self.user.username} сохранил {self.vacancy.title}"