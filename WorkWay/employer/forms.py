from django import forms
from django.core.exceptions import ValidationError
from .models import Vacancy, Category, EmploymentType, ExperienceLevel, EducationLevel, Currency


class VacancyForm(forms.ModelForm):
    """Форма для создания и редактирования вакансий"""

    class Meta:
        model = Vacancy
        fields = [
            'title', 'category', 'location', 'employment_type',
            'salary_min', 'salary_max', 'currency', 'description',
            'requirements', 'benefits', 'experience', 'education',
            'skills', 'contact_person', 'contact_email', 'contact_phone',
            'is_active', 'is_featured', 'is_urgent'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Например: Python разработчик'
            }),
            'location': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Например: Москва, удалённо'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 8,
                'placeholder': 'Опишите должностные обязанности...'
            }),
            'requirements': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 4,
                'placeholder': 'Опыт работы, навыки, образование...'
            }),
            'benefits': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 4,
                'placeholder': 'Условия работы, бонусы, льготы...'
            }),
            'skills': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 3,
                'placeholder': 'Укажите ключевые навыки через запятую'
            }),
            'salary_min': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': 'Минимальная зарплата'
            }),
            'salary_max': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': 'Максимальная зарплата'
            }),
            'contact_person': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'ФИО контактного лица'
            }),
            'contact_email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'email@example.com'
            }),
            'contact_phone': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': '+7 (XXX) XXX-XX-XX'
            }),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'employment_type': forms.Select(attrs={'class': 'form-select'}),
            'currency': forms.Select(attrs={'class': 'form-select'}),
            'experience': forms.Select(attrs={'class': 'form-select'}),
            'education': forms.Select(attrs={'class': 'form-select'}),
        }
        labels = {
            'title': 'Название должности *',
            'category': 'Категория *',
            'location': 'Местоположение *',
            'employment_type': 'Тип занятости *',
            'salary_min': 'Зарплата (от)',
            'salary_max': 'Зарплата (до)',
            'description': 'Описание вакансии *',
            'requirements': 'Требования к кандидату',
            'benefits': 'Мы предлагаем',
            'experience': 'Требуемый опыт',
            'education': 'Образование',
            'skills': 'Ключевые навыки',
            'contact_person': 'Контактное лицо',
            'contact_email': 'Контактный email',
            'contact_phone': 'Контактный телефон',
            'is_active': 'Активна',
            'is_featured': 'Рекомендуемая',
            'is_urgent': 'Срочная',
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        # Настройка выпадающих списков
        self.fields['category'].queryset = Category.objects.all()
        self.fields['category'].empty_label = "Выберите категорию"

        # Добавляем HTML классы к полям
        for field_name, field in self.fields.items():
            if 'class' not in field.widget.attrs:
                field.widget.attrs['class'] = 'form-input' if not isinstance(field.widget,
                                                                             forms.Select) else 'form-select'

    def clean(self):
        cleaned_data = super().clean()
        salary_min = cleaned_data.get('salary_min')
        salary_max = cleaned_data.get('salary_max')

        if salary_min and salary_max and salary_min > salary_max:
            raise ValidationError({
                'salary_max': 'Максимальная зарплата не может быть меньше минимальной'
            })

        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.user:
            instance.employer = self.user
        if commit:
            instance.save()
        return instance


class VacancySearchForm(forms.Form):
    """Форма поиска вакансий для работодателя"""

    search = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Поиск по названию...'
        })
    )

    status = forms.ChoiceField(
        required=False,
        choices=[
            ('', 'Все статусы'),
            ('active', 'Активные'),
            ('inactive', 'Неактивные'),
        ],
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    sort_by = forms.ChoiceField(
        required=False,
        choices=[
            ('-created_at', 'Сначала новые'),
            ('created_at', 'Сначала старые'),
            ('views_count', 'По просмотрам'),
            ('applications_count', 'По откликам'),
        ],
        widget=forms.Select(attrs={'class': 'form-select'})
    )