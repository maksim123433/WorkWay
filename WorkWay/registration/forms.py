from django import forms
from django.contrib.auth.hashers import make_password
from profileUser.models import Profile
import json


class CustomUserCreationForm(forms.ModelForm):
    """Единая форма для регистрации со ВСЕМИ полями"""
    confirm_email = forms.EmailField(
        required=True,
        label='Подтверждение email',
        widget=forms.EmailInput(attrs={
            'placeholder': 'Повторите email',
            'class': 'form-control'
        })
    )

    # Поля пароля
    password1 = forms.CharField(
        label='Пароль',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Создайте пароль',
            'name': 'password1'
        }),
        required=True
    )

    password2 = forms.CharField(
        label='Подтверждение пароля',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Повторите пароль',
            'name': 'password2'
        }),
        required=True
    )

    # Поле для previous_positions (JSON)
    previous_positions_json = forms.CharField(
        required=False,
        widget=forms.HiddenInput(attrs={'id': 'previous_positions'}),
        label='',
        initial='[]'
    )

    class Meta:
        model = Profile
        fields = [
            # Основные поля
            'email', 'first_name', 'last_name',

            # Общие контактные данные
            'phone', 'city', 'country', 'citizenship',

            # Тип аккаунта
            'account_type',

            # Поля соискателя
            'position', 'experience', 'skills', 'education',
            'employment_type', 'work_schedule',
            'relocation_ready', 'business_trips_ready',
            'birth_date', 'gender', 'marital_status',
            'languages', 'driving_license', 'driver_license_category',
            'achievements', 'portfolio_link', 'github_url',
            'about',

            # Поля работодателя
            'company_name', 'industry', 'company_size', 'company_description',
            'company_website', 'company_address',

            # Соглашения
            'terms_accepted', 'newsletter'
        ]

        widgets = {
            # Основные поля
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Введите email'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Введите имя'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Введите фамилию'}),

            # Контактные данные
            'phone': forms.TextInput(attrs={'class': 'form-control', 'type': 'tel', 'placeholder': 'Телефон'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Город'}),
            'country': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Страна'}),
            'citizenship': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Гражданство'}),

            # Тип аккаунта
            'account_type': forms.Select(attrs={'class': 'form-control'}),

            # Поля соискателя
            'position': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Желаемая должность'}),
            'experience': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Опыт работы'}),
            'skills': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Ключевые навыки'}),
            'education': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Образование'}),
            'employment_type': forms.Select(attrs={'class': 'form-control'}),
            'work_schedule': forms.Select(attrs={'class': 'form-control'}),
            'birth_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'gender': forms.Select(attrs={'class': 'form-control'}),
            'marital_status': forms.Select(attrs={'class': 'form-control'}),
            'languages': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Иностранные языки'}),
            'driver_license_category': forms.TextInput(
                attrs={'class': 'form-control', 'placeholder': 'Категория прав'}),
            'achievements': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Достижения'}),
            'portfolio_link': forms.URLInput(
                attrs={'class': 'form-control', 'type': 'url', 'placeholder': 'Ссылка на портфолио'}),
            'github_url': forms.URLInput(
                attrs={'class': 'form-control', 'type': 'url', 'placeholder': 'Ссылка на GitHub'}),
            'about': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'О себе'}),

            # Поля работодателя
            'company_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Название компании'}),
            'industry': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Сфера деятельности'}),
            'company_size': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Количество сотрудников'}),
            'company_description': forms.Textarea(
                attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'О компании'}),
            'company_website': forms.URLInput(
                attrs={'class': 'form-control', 'type': 'url', 'placeholder': 'Сайт компании'}),
            'company_address': forms.Textarea(
                attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Адрес компании'}),

            # Чекбоксы
            'relocation_ready': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'business_trips_ready': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'driving_license': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'terms_accepted': forms.CheckboxInput(attrs={'class': 'form-check-input', 'required': True}),
            'newsletter': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

        labels = {
            'terms_accepted': 'Я согласен с пользовательским соглашением',
            'newsletter': 'Я хочу получать рассылку',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Делаем account_type обязательным
        self.fields['account_type'].required = True

        # Делаем terms_accepted обязательным
        self.fields['terms_accepted'].required = True

    def clean(self):
        cleaned_data = super().clean()

        # Проверка email
        email = cleaned_data.get('email')
        confirm_email = cleaned_data.get('confirm_email')

        if email and confirm_email and email != confirm_email:
            self.add_error('confirm_email', 'Email адреса не совпадают')

        if email and Profile.objects.filter(email=email).exists():
            self.add_error('email', 'Пользователь с таким email уже существует')

        # Проверка пароля
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            self.add_error('password2', 'Пароли не совпадают')

        if password1 and len(password1) < 8:
            self.add_error('password1', 'Пароль должен содержать минимум 8 символов')

        # Проверка согласия
        if not cleaned_data.get('terms_accepted'):
            self.add_error('terms_accepted', 'Вы должны согласиться с пользовательским соглашением')

        return cleaned_data

    def save(self, commit=True):
        """Создаем пользователя со всеми полями"""
        # Создаем объект Profile
        profile = super().save(commit=False)

        # Устанавливаем пароль (хэшируем)
        password = self.cleaned_data.get('password1')
        if password:
            profile.set_password(password)

        # Устанавливаем username как email (для совместимости)
        profile.username = self.cleaned_data.get('email')

        # Устанавливаем is_active по умолчанию
        profile.is_active = True

        # Обрабатываем previous_positions из JSON
        previous_positions_json = self.cleaned_data.get('previous_positions_json', '[]')
        try:
            if previous_positions_json:
                positions_data = json.loads(previous_positions_json)
                # Преобразуем в правильный формат
                formatted_positions = []
                for i, pos in enumerate(positions_data):
                    if isinstance(pos, dict) and 'position' in pos:
                        formatted_positions.append({
                            'period': pos.get('period', ''),
                            'position': pos.get('position', ''),
                            'company': pos.get('company', ''),
                            'description': pos.get('description', ''),
                            'order': i
                        })
                profile.previous_positions = formatted_positions
                print(f"Сохраняем {len(formatted_positions)} предыдущих должностей")
        except (json.JSONDecodeError, TypeError) as e:
            print(f"Ошибка обработки JSON previous_positions: {e}")
            profile.previous_positions = []

        if commit:
            profile.save()

        return profile