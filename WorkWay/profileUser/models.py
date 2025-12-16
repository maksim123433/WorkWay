import json
from django.db import models
from django.contrib.auth.models import AbstractUser


class Profile(AbstractUser):
    # Типы аккаунта
    ACCOUNT_TYPE_CHOICES = [
        ('job_seeker', 'Соискатель'),
        ('employer', 'Работодатель'),
    ]

    # Выбор пола
    GENDER_CHOICES = [
        ('male', 'Мужской'),
        ('female', 'Женский'),
        ('other', 'Другой'),
    ]

    # Типы занятости для соискателя
    EMPLOYMENT_TYPE_CHOICES = [
        ('full', 'Полная занятость'),
        ('part', 'Частичная занятость'),
        ('project', 'Проектная работа'),
        ('volunteer', 'Волонтерство'),
        ('internship', 'Стажировка'),
    ]

    # График работы для соискателя
    WORK_SCHEDULE_CHOICES = [
        ('full_day', 'Полный день'),
        ('shift', 'Сменный график'),
        ('flexible', 'Гибкий график'),
        ('remote', 'Удаленная работа'),
        ('hybrid', 'Гибридный формат'),
    ]

    # Семейное положение
    MARITAL_STATUS_CHOICES = [
        ('single', 'Холост/Не замужем'),
        ('married', 'Женат/Замужем'),
        ('divorced', 'Разведен(а)'),
        ('widowed', 'Вдовец/Вдова'),
    ]

    username = None
    first_name = models.CharField('Имя', max_length=50)
    last_name = models.CharField('Фамилия', max_length=50)
    email = models.EmailField('Email', unique=True)
    USERNAME_FIELD = 'email'  # теперь логинимся по email
    REQUIRED_FIELDS = []


    # Общие контактные данные
    phone = models.CharField('Телефон', max_length=20, blank=True, null=True)
    city = models.CharField('Город', max_length=100, blank=True, null=True)
    country = models.CharField('Страна', max_length=100, blank=True, null=True)
    citizenship = models.CharField('Гражданство', max_length=100, blank=True, null=True)

    # Тип аккаунта
    account_type = models.CharField(
        'Тип аккаунта',
        max_length=20,
        choices=ACCOUNT_TYPE_CHOICES
    )

    # Поля для соискателя
    position = models.CharField(
        'Желаемая должность',
        max_length=200,
        blank=True,
        null=True
    )

    experience = models.CharField(
        'Опыт работы',
        max_length=200,
        blank=True,
        null=True
    )

    skills = models.TextField('Ключевые навыки', blank=True, null=True)
    education = models.TextField('Образование', blank=True, null=True)

    # Старое поле (можно оставить для обратной совместимости)
    previous_work = models.TextField('Ранее занимаемые должности', blank=True, null=True)

    # Новые структурированные данные о предыдущих должностях
    previous_positions = models.JSONField(
        'Ранее занимаемые должности',
        blank=True,
        null=True,
        default=list,
        help_text='Список предыдущих должностей в формате JSON'
    )

    about = models.TextField('О себе', blank=True, null=True)

    # Дополнительные поля для соискателя
    employment_type = models.CharField(
        'Тип занятости',
        max_length=50,
        blank=True,
        null=True,
        choices=EMPLOYMENT_TYPE_CHOICES
    )

    work_schedule = models.CharField(
        'График работы',
        max_length=50,
        blank=True,
        null=True,
        choices=WORK_SCHEDULE_CHOICES
    )

    relocation_ready = models.BooleanField('Готовность к переезду', default=False)
    business_trips_ready = models.BooleanField('Готовность к командировкам', default=False)

    # Персональные данные соискателя
    birth_date = models.DateField('Дата рождения', blank=True, null=True)

    gender = models.CharField(
        'Пол',
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )

    marital_status = models.CharField(
        'Семейное положение',
        max_length=50,
        blank=True,
        null=True,
        choices=MARITAL_STATUS_CHOICES
    )

    languages = models.TextField(
        'Иностранные языки',
        blank=True,
        null=True
    )

    driving_license = models.BooleanField('Водительские права', default=False)
    driver_license_category = models.CharField(
        'Категория прав',
        max_length=50,
        blank=True,
        null=True
    )

    achievements = models.TextField('Достижения', blank=True, null=True)
    portfolio_link = models.URLField('Портфолио', blank=True, null=True)
    github_url = models.URLField('GitHub', blank=True, null=True)

    # Поля для работодателя
    company_name = models.CharField('Название компании', max_length=200, blank=True, null=True)
    industry = models.CharField('Сфера деятельности', max_length=200, blank=True, null=True)
    company_size = models.CharField('Количество сотрудников', max_length=100, blank=True, null=True)
    company_description = models.TextField('О компании', blank=True, null=True)

    # Дополнительные поля для работодателя
    company_website = models.URLField('Сайт компании', blank=True, null=True)
    company_address = models.TextField('Адрес компании', blank=True, null=True)

    # Соглашения
    terms_accepted = models.BooleanField(
        'Согласие с пользовательским соглашением',
        default=False
    )

    newsletter = models.BooleanField(
        'Подписка на рассылку',
        default=False
    )

    # Методы для проверки типа аккаунта
    def is_job_seeker(self):
        return self.account_type == 'job_seeker'

    def is_employer(self):
        return self.account_type == 'employer'

    # Метод для добавления предыдущей должности
    def add_previous_position(self, period, position, company="", description=""):
        """Добавить предыдущую должность"""
        if not self.previous_positions:
            self.previous_positions = []

        position_data = {
            'period': period,  # Например: "2015-2016"
            'position': position,
            'company': company,
            'description': description,
            'order': len(self.previous_positions)
        }

        self.previous_positions.append(position_data)
        self.save()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_account_type_display()})"

    def get_previous_positions(self):
        """Получить предыдущие должности в виде списка"""
        if self.previous_positions:
            if isinstance(self.previous_positions, str):
                try:
                    return json.loads(self.previous_positions)
                except json.JSONDecodeError:
                    return []
            return self.previous_positions
        return []

    def set_previous_positions(self, positions_list):
        """Установить предыдущие должности"""
        self.previous_positions = json.dumps(positions_list) if isinstance(positions_list, list) else positions_list

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'