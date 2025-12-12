from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from profileUser.models import Profile


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        label='Email',
        widget=forms.EmailInput(attrs={
            'placeholder': 'Введите ваш email'
        })
    )
    first_name = forms.CharField(
        max_length=50,
        label='Имя',
        widget=forms.TextInput(attrs={
            'placeholder': 'Введите ваше имя'
        })
    )
    last_name = forms.CharField(
        max_length=50,
        label='Фамилия',
        widget=forms.TextInput(attrs={
            'placeholder': 'Введите вашу фамилию'
        })
    )
    confirm_email = forms.EmailField(
        required=True,
        label='Подтверждение email',
        widget=forms.EmailInput(attrs={
            'placeholder': 'Повторите email'
        })
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'placeholder': 'Придумайте логин'
        })
        self.fields['password1'].widget.attrs.update({
            'placeholder': 'Создайте пароль'
        })
        self.fields['password2'].widget.attrs.update({
            'placeholder': 'Повторите пароль'
        })

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        confirm_email = cleaned_data.get('confirm_email')

        if email and confirm_email and email != confirm_email:
            self.add_error('confirm_email', 'Email адреса не совпадают')

        # Проверка уникальности email
        if email and User.objects.filter(email=email).exists():
            self.add_error('email', 'Пользователь с таким email уже существует')

        return cleaned_data


class ProfileForm(forms.ModelForm):
    user_type = forms.ChoiceField(
        choices=Profile.ACCOUNT_TYPE_CHOICES,
        label='Тип аккаунта',
        widget=forms.RadioSelect(),
        required=True
    )

    terms = forms.BooleanField(
        required=True,
        label='Согласие с условиями',
        error_messages={'required': 'Вы должны принять условия использования'}
    )

    newsletter = forms.BooleanField(
        required=False,
        label='Подписка на рассылку'
    )

    class Meta:
        model = Profile
        fields = [
            'user_type', 'position', 'experience', 'skills', 'education',
            'previous_work', 'about', 'company_name', 'industry',
            'company_size', 'company_description', 'terms_accepted', 'newsletter'
        ]
        widgets = {
            'user_type': forms.RadioSelect(),
            'position': forms.TextInput(attrs={
                'placeholder': 'Желаемая должность'
            }),
            'experience': forms.TextInput(attrs={
                'placeholder': 'Опыт работы (лет)'
            }),
            'skills': forms.TextInput(attrs={
                'placeholder': 'Ключевые навыки'
            }),
            'education': forms.TextInput(attrs={
                'placeholder': 'Образование'
            }),
            'previous_work': forms.TextInput(attrs={
                'placeholder': 'Ранее занимаемые должности'
            }),
            'about': forms.Textarea(attrs={
                'placeholder': 'Расскажите о себе, своих целях и опыте...',
                'rows': 4
            }),
            'company_name': forms.TextInput(attrs={
                'placeholder': 'Название компании'
            }),
            'industry': forms.TextInput(attrs={
                'placeholder': 'Сфера деятельности'
            }),
            'company_size': forms.TextInput(attrs={
                'placeholder': 'Количество сотрудников'
            }),
            'company_description': forms.Textarea(attrs={
                'placeholder': 'Расскажите о вашей компании, миссии и ценностях...',
                'rows': 4
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Переименовываем поле terms_accepted в terms для формы
        self.fields['terms_accepted'].label = 'Согласие с условиями'
        self.fields['terms_accepted'].required = True
        self.fields['terms_accepted'].error_messages = {
            'required': 'Вы должны принять условия использования'
        }

        # Переименовываем поле в форме для удобства
        self.fields['terms_accepted'].widget.attrs.update({
            'id': 'terms'
        })

        # Делаем все остальные поля необязательными при инициализации
        optional_fields = ['position', 'experience', 'skills', 'education',
                           'previous_work', 'about', 'company_name', 'industry',
                           'company_size', 'company_description', 'newsletter']
        for field in optional_fields:
            self.fields[field].required = False

    def clean(self):
        cleaned_data = super().clean()
        user_type = cleaned_data.get('user_type')

        # Валидация для соискателя
        if user_type == 'job_seeker':
            required_fields = ['position', 'experience']
            for field in required_fields:
                if not cleaned_data.get(field):
                    self.add_error(field, 'Это поле обязательно для соискателя')

        # Валидация для работодателя
        elif user_type == 'employer':
            required_fields = ['company_name', 'industry']
            for field in required_fields:
                if not cleaned_data.get(field):
                    self.add_error(field, 'Это поле обязательно для работодателя')

        return cleaned_data