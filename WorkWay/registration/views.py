from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib import messages
from django.contrib.auth.models import User
import re

from .forms import CustomUserCreationForm, ProfileForm
from profileUser.models import Profile


class RegistView(TemplateView):
    template_name = "registration/registration.html"

    def post(self, request, *args, **kwargs):
        return register_view(request)  # просто делегируем в вашу функцию


def register_view(request):
    if request.method == 'POST':
        print("\n" + "=" * 50)
        print("DEBUG: Начало обработки POST запроса")
        print("=" * 50)

        # Выводим данные POST запроса
        print("POST данные:")
        for key, value in request.POST.items():
            print(f"  {key}: {value}")

        # Обрабатываем чекбокс terms
        post_data = request.POST.copy()
        if 'terms' in post_data and post_data['terms'] == 'on':
            post_data['terms_accepted'] = True
        else:
            post_data['terms_accepted'] = False

        # Создаем формы с обработанными данными
        user_form = CustomUserCreationForm(post_data)
        profile_form = ProfileForm(post_data)
        post_data['username'] = post_data['email']
        # Проверяем валидность форм
        user_form_valid = user_form.is_valid()
        profile_form_valid = profile_form.is_valid()

        print(f"\nВалидность форм:")
        print(f"  user_form.is_valid() = {user_form_valid}")
        print(f"  profile_form.is_valid() = {profile_form_valid}")

        if not user_form_valid:
            print("\nОшибки user_form:")
            for field, errors in user_form.errors.items():
                print(f"  Поле '{field}':")
                for error in errors:
                    print(f"    - {error}")

        if not profile_form_valid:
            print("\nОшибки profile_form:")
            for field, errors in profile_form.errors.items():
                print(f"  Поле '{field}':")
                for error in errors:
                    print(f"    - {error}")

        if user_form.is_valid() and profile_form.is_valid():
            try:
                # Генерируем username из email
                email = user_form.cleaned_data['email']
                username = email
                print(f"\nСоздаем пользователя:")
                print(f"  Username: {username}")
                print(f"  Email: {email}")
                print(f"  First name: {user_form.cleaned_data['first_name']}")
                print(f"  Last name: {user_form.cleaned_data['last_name']}")

                # Создаем пользователя
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=user_form.cleaned_data['password1'],
                    first_name=user_form.cleaned_data['first_name'],
                    last_name=user_form.cleaned_data['last_name']
                )
                print(f"Пользователь создан: {user.username}")

                # Создаем профиль
                profile_data = {
                    'user': user,
                    'first_name': user_form.cleaned_data['first_name'],
                    'last_name': user_form.cleaned_data['last_name'],
                    'email': email,
                    'account_type': profile_form.cleaned_data['user_type'],
                    'position': profile_form.cleaned_data.get('position'),
                    'experience': profile_form.cleaned_data.get('experience'),
                    'skills': profile_form.cleaned_data.get('skills'),
                    'education': profile_form.cleaned_data.get('education'),
                    'previous_work': profile_form.cleaned_data.get('previous_work'),
                    'about': profile_form.cleaned_data.get('about'),
                    'company_name': profile_form.cleaned_data.get('company_name'),
                    'industry': profile_form.cleaned_data.get('industry'),
                    'company_size': profile_form.cleaned_data.get('company_size'),
                    'company_description': profile_form.cleaned_data.get('company_description'),
                    'terms_accepted': profile_form.cleaned_data.get('terms_accepted', False),
                    'newsletter': profile_form.cleaned_data.get('newsletter', False)
                }

                print(f"\nДанные профиля:")
                for key, value in profile_data.items():
                    if key != 'user':
                        print(f"  {key}: {value}")

                profile = Profile.objects.create(**profile_data)
                print(f"Профиль создан для: {profile.first_name} {profile.last_name}")

                # Авторизуем пользователя
                user = authenticate(username=username, password=user_form.cleaned_data['password1'])
                if user is not None:
                    login(request, user)
                    messages.success(request, 'Регистрация прошла успешно! Добро пожаловать!')
                    print("Регистрация успешна, перенаправление на profile")
                    return redirect('profile')
                else:
                    messages.error(request, 'Ошибка аутентификации. Попробуйте войти вручную.')
                    print("Ошибка аутентификации")
                    return redirect('login')

            except Exception as e:
                print(f"Исключение при сохранении: {str(e)}")
                import traceback
                traceback.print_exc()
                messages.error(request, f'Ошибка при сохранении данных: {str(e)}')

        else:
            # Если формы не валидны, показываем ошибки пользователю
            if not user_form.is_valid():
                for field, errors in user_form.errors.items():
                    for error in errors:
                        messages.error(request, f'{field}: {error}')
            if not profile_form.is_valid():
                for field, errors in profile_form.errors.items():
                    for error in errors:
                        messages.error(request, f'{field}: {error}')

    else:
        print("\n" + "=" * 50)
        print("DEBUG: GET запрос - отображение пустых форм")
        print("=" * 50 + "\n")
        user_form = CustomUserCreationForm()
        profile_form = ProfileForm()

    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    return render(request, 'registration/registration.html', context)




