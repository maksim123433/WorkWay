from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        label='Email или логин',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Введите email или логин',
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
        'invalid_login': 'Неверный email/логин или пароль. Попробуйте снова.',
        'inactive': 'Аккаунт неактивен.',
    }

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        # Проверяем, является ли введенное значение email
        if '@' in username:
            try:
                user = User.objects.get(email=username)
                username = user.username
                self.cleaned_data['username'] = username
            except User.DoesNotExist:
                pass

        return super().clean()

