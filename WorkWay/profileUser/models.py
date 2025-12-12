from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    # Типы аккаунта
    ACCOUNT_TYPE_CHOICES = [
        ('job_seeker', 'Соискатель'),
        ('employer', 'Работодатель'),
    ]

    # Основные поля (общие для всех)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField('Имя', max_length=50)
    last_name = models.CharField('Фамилия', max_length=50)
    email = models.EmailField('Email', unique=True)

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
    previous_work = models.TextField('Ранее занимаемые должности', blank=True, null=True)
    about = models.TextField('О себе', blank=True, null=True)

    # Поля для работодателя
    company_name = models.CharField('Название компании', max_length=200, blank=True, null=True)
    industry = models.CharField('Сфера деятельности', max_length=200, blank=True, null=True)
    company_size = models.CharField('Количество сотрудников', max_length=100, blank=True, null=True)
    company_description = models.TextField('О компании', blank=True, null=True)

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

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_account_type_display()})"

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'