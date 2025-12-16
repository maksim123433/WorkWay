from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib import messages

import json

from .forms import CustomUserCreationForm  # Используем одну форму
from profileUser.models import Profile


class RegistView(TemplateView):
    template_name = "registration/registration.html"

    def post(self, request, *args, **kwargs):
        return register_view(request)


def register_view(request):
    """Обработка регистрации нового пользователя"""
    if request.method == 'POST':
        print("\n" + "=" * 50)
        print("DEBUG: Обработка POST запроса (РЕГИСТРАЦИЯ)")
        print("=" * 50)

        # Выводим данные POST запроса
        print("POST данные:")
        for key, value in request.POST.items():
            print(f"  {key}: {value}")

        # Подготавливаем данные для формы
        post_data = request.POST.copy()

        # Обработка чекбоксов
        checkbox_fields = [
            'terms_accepted', 'newsletter', 'relocation_ready',
            'business_trips_ready', 'driving_license'
        ]

        for checkbox in checkbox_fields:
            if checkbox in post_data and post_data[checkbox] == 'on':
                post_data[checkbox] = True
            elif checkbox in post_data:
                post_data[checkbox] = False

        # Обработка JSON поля previous_positions
        if 'previous_positions' in post_data and post_data['previous_positions']:
            try:
                previous_positions = json.loads(post_data['previous_positions'])
                print(f"Получены previous_positions: {len(previous_positions)} позиций")
                for i, pos in enumerate(previous_positions):
                    print(f"  Позиция {i + 1}: {pos.get('position')} в {pos.get('company')}")
            except json.JSONDecodeError as e:
                print(f"Ошибка парсинга JSON previous_positions: {e}")
                post_data['previous_positions'] = '[]'

        # Создаем форму с обработанными данными
        form = CustomUserCreationForm(post_data, request.FILES)
        print(f"\nВалидность формы: {form.is_valid()}")

        if not form.is_valid():
            print("\nОшибки формы:")
            for field, errors in form.errors.items():
                print(f"  Поле '{field}':")
                for error in errors:
                    print(f"    - {error}")

            # Показываем ошибки пользователю
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
        else:
            try:
                print("\nСохранение данных в БД...")

                # Сохраняем форму - она создаст Profile со ВСЕМИ полями
                profile = form.save()

                print(f"Профиль создан для: {profile.first_name} {profile.last_name}")
                print(f"Тип аккаунта: {profile.get_account_type_display()}")
                print(f"Email: {profile.email}")
                print(f"Сохранились поля: account_type={profile.account_type}, position={profile.position}")

                # Отладочная информация
                print("Все поля профиля после сохранения:")
                for field in Profile._meta.fields:
                    field_name = field.name
                    try:
                        field_value = getattr(profile, field_name)
                        if field_value not in [None, '', False, []]:
                            print(f"  {field_name}: {field_value}")
                    except:
                        pass

                # Авторизуем пользователя
                user = authenticate(
                    request=request,
                    email=profile.email,
                    password=form.cleaned_data['password1']
                )

                if user is not None:
                    login(request, user)
                    messages.success(request, 'Регистрация прошла успешно! Добро пожаловать!')

                    # Редирект на главную
                    print("Перенаправление на главную страницу...")
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

        # Если есть ошибки, показываем форму снова
        context = {'form': form}
        return render(request, 'registration/registration.html', context)

    else:
        # GET запрос - показываем пустую форму
        print("\n" + "=" * 50)
        print("DEBUG: GET запрос - отображение формы регистрации")
        print("=" * 50 + "\n")
        form = CustomUserCreationForm()

    context = {'form': form}
    return render(request, 'registration/registration.html', context)