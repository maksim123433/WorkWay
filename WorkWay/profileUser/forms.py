from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        label='Email',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Введите email',
            'autofocus': True
        })
    )
    password = forms.CharField(
        label='Пароль',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Введите пароль'
        })
    )

    error_messages = {
        'invalid_login': 'Неверный email или пароль. Попробуйте снова.',
        'inactive': 'Аккаунт неактивен.',
    }

    def clean(self):
        # AuthenticationForm сам вызывает authenticate(username=..., password=...)
        # В твоём случае username = email, потому что USERNAME_FIELD = 'email'
        return super().clean()


# forms.py
from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Profile
import json
import re


class ProfileEditForm(forms.ModelForm):
    # Поле для пароля (опционально)
    new_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Оставьте пустым, если не хотите менять пароль',
            'class': 'form-control'
        }),
        required=False,
        label="Новый пароль",
        min_length=8,
        help_text="Минимум 8 символов"
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Повторите новый пароль',
            'class': 'form-control'
        }),
        required=False,
        label="Подтвердите пароль"
    )

    class Meta:
        model = Profile
        fields = [
            # Основная информация (всегда доступна)
            'first_name', 'last_name', 'email', 'phone',
            'city', 'country', 'citizenship',
            'about', 'newsletter',
            'birth_date', 'gender', 'marital_status',
        ]

        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Иван'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Иванов'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'ivan@example.com'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '+7 999 123-45-67'
            }),
            'city': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Москва'
            }),
            'country': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Россия'
            }),
            'citizenship': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Российская Федерация'
            }),
            'about': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Расскажите о себе...'
            }),
            'birth_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control'
            }),
            'gender': forms.Select(attrs={'class': 'form-control'}),
            'marital_status': forms.Select(attrs={'class': 'form-control'}),
            'newsletter': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

        labels = {
            'first_name': 'Имя',
            'last_name': 'Фамилия',
            'email': 'Email',
            'phone': 'Телефон',
            'city': 'Город',
            'country': 'Страна',
            'citizenship': 'Гражданство',
            'about': 'О себе',
            'birth_date': 'Дата рождения',
            'gender': 'Пол',
            'marital_status': 'Семейное положение',
            'newsletter': 'Подписка на рассылку',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.instance = kwargs.get('instance')

        if self.instance and self.instance.pk:
            # Делаем email read-only для существующих пользователей
            self.fields['email'].widget.attrs['readonly'] = True
            self.fields['email'].help_text = "Email нельзя изменить"

            # Добавляем поле для отображения типа аккаунта (только чтение)
            self.fields['account_type_display'] = forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'readonly': True,
                    'style': 'background-color: #f8f9fa;'
                }),
                required=False,
                label="Тип аккаунта",
                initial=self.instance.get_account_type_display()
            )

            # В зависимости от типа аккаунта добавляем соответствующие поля
            if self.instance.account_type == 'job_seeker':
                self._add_job_seeker_fields()
            elif self.instance.account_type == 'employer':
                self._add_employer_fields()

    def _add_job_seeker_fields(self):
        """Добавить поля для соискателя"""
        # Профессиональные поля соискателя
        job_seeker_fields = {
            'position': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'Python разработчик'
                }),
                required=False,
                label="Желаемая должность"
            ),
            'experience': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': '3 года'
                }),
                required=False,
                label="Опыт работы"
            ),
            'skills': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 3,
                    'placeholder': 'Python, Django, SQL, JavaScript...'
                }),
                required=False,
                label="Ключевые навыки",
                help_text="Перечислите навыки через запятую"
            ),
            'education': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 4,
                    'placeholder': '2015-2020: МГУ, Факультет вычислительной математики...'
                }),
                required=False,
                label="Образование"
            ),
            'employment_type': forms.ChoiceField(
                choices=Profile.EMPLOYMENT_TYPE_CHOICES,
                widget=forms.Select(attrs={'class': 'form-control'}),
                required=False,
                label="Тип занятости"
            ),
            'work_schedule': forms.ChoiceField(
                choices=Profile.WORK_SCHEDULE_CHOICES,
                widget=forms.Select(attrs={'class': 'form-control'}),
                required=False,
                label="График работы"
            ),
            'relocation_ready': forms.BooleanField(
                widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
                required=False,
                label="Готовность к переезду"
            ),
            'business_trips_ready': forms.BooleanField(
                widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
                required=False,
                label="Готовность к командировкам"
            ),
            'languages': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 2,
                    'placeholder': 'Английский (B2), Немецкий (A1)'
                }),
                required=False,
                label="Иностранные языки"
            ),
            'achievements': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 3,
                    'placeholder': 'Ваши профессиональные достижения...'
                }),
                required=False,
                label="Достижения"
            ),
            'driving_license': forms.BooleanField(
                widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
                required=False,
                label="Водительские права"
            ),
            'driver_license_category': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'B, C'
                }),
                required=False,
                label="Категория прав"
            ),
            'portfolio_link': forms.URLField(
                widget=forms.URLInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'https://myportfolio.com'
                }),
                required=False,
                label="Ссылка на портфолио"
            ),
            'github_url': forms.URLField(
                widget=forms.URLInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'https://github.com/username'
                }),
                required=False,
                label="GitHub профиль"
            ),
            'previous_positions_json': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 6,
                    'placeholder': 'В формате JSON...'
                }),
                required=False,
                label="Предыдущие должности",
                help_text="""В формате JSON: [{"period": "2020-2022", "position": "Разработчик", "company": "Компания", "description": "Описание"}]"""
            )
        }

        # Добавляем поля в форму
        for field_name, field in job_seeker_fields.items():
            self.fields[field_name] = field
            if hasattr(self.instance, field_name):
                self.fields[field_name].initial = getattr(self.instance, field_name)

        # Заполняем предыдущие должности
        if self.instance.previous_positions:
            try:
                positions_json = json.dumps(
                    self.instance.previous_positions,
                    ensure_ascii=False,
                    indent=2
                )
                self.fields['previous_positions_json'].initial = positions_json
            except:
                pass

    def _add_employer_fields(self):
        """Добавить поля для работодателя"""
        # Поля компании для работодателя
        employer_fields = {
            'company_name': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'ООО "Моя Компания"'
                }),
                required=False,
                label="Название компании"
            ),
            'industry': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'IT, Разработка ПО'
                }),
                required=False,
                label="Сфера деятельности"
            ),
            'company_size': forms.CharField(
                widget=forms.TextInput(attrs={
                    'class': 'form-control',
                    'placeholder': '50-100 сотрудников'
                }),
                required=False,
                label="Количество сотрудников"
            ),
            'company_description': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 4,
                    'placeholder': 'Описание деятельности компании...'
                }),
                required=False,
                label="Описание компании"
            ),
            'company_website': forms.URLField(
                widget=forms.URLInput(attrs={
                    'class': 'form-control',
                    'placeholder': 'https://company.com'
                }),
                required=False,
                label="Сайт компании"
            ),
            'company_address': forms.CharField(
                widget=forms.Textarea(attrs={
                    'class': 'form-control',
                    'rows': 2,
                    'placeholder': 'г. Москва, ул. Примерная, д. 1'
                }),
                required=False,
                label="Адрес компании"
            ),
        }

        # Добавляем поля в форму
        for field_name, field in employer_fields.items():
            self.fields[field_name] = field
            if hasattr(self.instance, field_name):
                self.fields[field_name].initial = getattr(self.instance, field_name)



    def clean_email(self):
        email = self.cleaned_data.get('email')
        if self.instance.pk:
            if Profile.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
                raise ValidationError("Этот email уже используется другим пользователем")
        return email

    def clean_birth_date(self):
        birth_date = self.cleaned_data.get('birth_date')
        if birth_date:
            if birth_date > timezone.now().date():
                raise ValidationError("Дата рождения не может быть в будущем")

            min_date = timezone.now().date() - timezone.timedelta(days=150 * 365)
            if birth_date < min_date:
                raise ValidationError("Пожалуйста, проверьте дату рождения")

            fourteen_years_ago = timezone.now().date() - timezone.timedelta(days=14 * 365)
            if birth_date > fourteen_years_ago:
                raise ValidationError("Вам должно быть больше 14 лет")

        return birth_date

    def clean_previous_positions_json(self):
        if 'previous_positions_json' in self.cleaned_data:
            json_data = self.cleaned_data.get('previous_positions_json', '')
            if json_data and json_data.strip():
                try:
                    positions = json.loads(json_data)
                    if not isinstance(positions, list):
                        raise ValidationError("Данные должны быть в формате JSON массива")

                    for i, position in enumerate(positions):
                        if not isinstance(position, dict):
                            raise ValidationError(f"Позиция {i + 1} должна быть объектом")

                        if 'period' not in position or 'position' not in position:
                            raise ValidationError(f"В позиции {i + 1} отсутствуют обязательные поля")

                    return positions
                except json.JSONDecodeError as e:
                    raise ValidationError(f"Ошибка в формате JSON: {str(e)}")

        return []

    def clean_company_website(self):
        if 'company_website' in self.cleaned_data:
            website = self.cleaned_data.get('company_website')
            if website:
                if not website.startswith(('http://', 'https://')):
                    website = 'https://' + website
            return website
        return None

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_password = cleaned_data.get('confirm_password')

        if new_password and confirm_password:
            if new_password != confirm_password:
                self.add_error('confirm_password', "Пароли не совпадают")

        return cleaned_data

    def save(self, commit=True):
        profile = super().save(commit=False)

        # Обрабатываем пароль
        new_password = self.cleaned_data.get('new_password')
        if new_password:
            profile.set_password(new_password)

        # Сохраняем поля в зависимости от типа аккаунта
        if profile.account_type == 'job_seeker':
            # Сохраняем поля соискателя
            job_seeker_fields = [
                'position', 'experience', 'skills', 'education',
                'employment_type', 'work_schedule', 'relocation_ready',
                'business_trips_ready', 'languages', 'achievements',
                'driving_license', 'driver_license_category',
                'portfolio_link', 'github_url'
            ]

            for field in job_seeker_fields:
                if field in self.cleaned_data:
                    setattr(profile, field, self.cleaned_data[field])

            # Сохраняем предыдущие должности
            if 'previous_positions_json' in self.cleaned_data:
                previous_positions = self.cleaned_data.get('previous_positions_json')
                if previous_positions is not None:
                    profile.previous_positions = previous_positions

        elif profile.account_type == 'employer':
            # Сохраняем поля работодателя
            employer_fields = [
                'company_name', 'industry', 'company_size',
                'company_description', 'company_website', 'company_address'
            ]

            for field in employer_fields:
                if field in self.cleaned_data:
                    setattr(profile, field, self.cleaned_data[field])

        if commit:
            profile.save()

        return profile