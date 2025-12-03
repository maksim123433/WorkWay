// Дополнительные функции для панели работодателя
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация селектов с улучшенным UI
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.cursor = 'pointer';
        select.style.appearance = 'none';
        select.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"%2394a3b8\" viewBox=\"0 0 16 16"%3E%3Cpath d=\"M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\"/%3E%3C/svg%3E")';
        select.style.backgroundRepeat = 'no-repeat';
        select.style.backgroundPosition = 'right 15px center';
        select.style.paddingRight = '45px';
    });

    // Валидация зарплаты
    const salaryMin = document.getElementById('salary_min');
    const salaryMax = document.getElementById('salary_max');

    if (salaryMin && salaryMax) {
        salaryMin.addEventListener('input', validateSalary);
        salaryMax.addEventListener('input', validateSalary);

        function validateSalary() {
            const min = parseFloat(salaryMin.value) || 0;
            const max = parseFloat(salaryMax.value) || 0;

            if (max > 0 && min > max) {
                salaryMin.style.borderColor = '#ef4444';
                salaryMax.style.borderColor = '#ef4444';
            } else {
                salaryMin.style.borderColor = '#e2e8f0';
                salaryMax.style.borderColor = '#e2e8f0';
            }
        }
    }

    // Подсказки для полей
    const tooltips = {
        'title': 'Укажите точное название должности. Например: "Python разработчик" или "Менеджер по продажам"',
        'description': 'Подробно опишите обязанности, условия работы, требования к кандидату',
        'salary_min': 'Минимальная зарплата, которую вы готовы предложить',
        'salary_max': 'Максимальный уровень зарплаты для данной позиции'
    };

    Object.keys(tooltips).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.title = tooltips[fieldId];
        }
    });

    // Сохранение черновика при потере фокуса
    const formFields = document.querySelectorAll('#vacancyForm input, #vacancyForm textarea, #vacancyForm select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            saveDraft();
        });
    });

    function saveDraft() {
        const formData = new FormData(document.getElementById('vacancyForm'));
        const draft = {};

        formData.forEach((value, key) => {
            draft[key] = value;
        });

        localStorage.setItem('vacancyDraft', JSON.stringify(draft));
        console.log('Черновик сохранён');
    }

    // Загрузка черновика при загрузке страницы
    function loadDraft() {
        const draft = JSON.parse(localStorage.getItem('vacancyDraft'));
        if (draft) {
            Object.keys(draft).forEach(key => {
                const field = document.getElementById(key);
                if (field && draft[key]) {
                    field.value = draft[key];

                    if (key === 'description') {
                        document.getElementById('charCount').textContent = draft[key].length;
                    }
                }
            });
            console.log('Черновик загружен');
        }
    }

    // Очистка черновика после успешной публикации
    window.addEventListener('beforeunload', function() {
        if (document.getElementById('vacancyForm').checkValidity()) {
            localStorage.removeItem('vacancyDraft');
        }
    });

    // Инициализация
    loadDraft();

    // Анимация появления карточек
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.vacancy-card, .action-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});