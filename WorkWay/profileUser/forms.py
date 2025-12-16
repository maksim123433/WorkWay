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
