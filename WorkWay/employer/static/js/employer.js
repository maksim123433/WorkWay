document.addEventListener('DOMContentLoaded', function() {
    const createBtn = document.getElementById('createVacancyBtn');
    const createFirstBtn = document.getElementById('createFirstVacancyBtn');
    const quickCreateBtn = document.querySelector('#quickCreateVacancy .btn-quick');
    const vacancyForm = document.getElementById('createVacancyForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const descriptionField = document.getElementById('description');
    const charCount = document.getElementById('charCount');

    // Функция для показа формы вакансии
    function showVacancyForm() {
        vacancyForm.style.display = 'block';
        vacancyForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Функция для скрытия формы вакансии
    function hideVacancyForm() {
        vacancyForm.style.display = 'none';
        document.getElementById('vacancyForm').reset();
        if (charCount) charCount.textContent = '0';
    }

    // Счетчик символов для описания
    if (descriptionField) {
        descriptionField.addEventListener('input', function() {
            if (charCount) charCount.textContent = this.value.length;
        });
    }

    // Обработчики для кнопок создания вакансии
    if (createBtn) createBtn.addEventListener('click', showVacancyForm);
    if (createFirstBtn) createFirstBtn.addEventListener('click', showVacancyForm);
    if (quickCreateBtn) quickCreateBtn.addEventListener('click', showVacancyForm);

    // Отмена создания вакансии
    if (cancelBtn) cancelBtn.addEventListener('click', hideVacancyForm);

    // Обработчики быстрых действий в боковой панели
    document.querySelectorAll('.sidebar-action-card .btn-quick').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const actionCard = this.closest('.sidebar-action-card');
            const actionId = actionCard.id;

            switch(actionId) {
                case 'quickCreateVacancy':
                    showVacancyForm();
                    break;
                case 'quickSearch':
                    alert('Поиск кандидатов - функция в разработке');
                    break;
                case 'quickViewResponses':
                    alert('Просмотр откликов - функция в разработке');
                    break;
                case 'quickSchedule':
                    alert('Назначение собеседования - функция в разработке');
                    break;
            }
        });
    });

    // Клик по карточкам быстрых действий
    document.querySelectorAll('.sidebar-action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-quick')) {
                const actionId = this.id;
                const btn = this.querySelector('.btn-quick');
                if (btn) btn.click();
            }
        });
    });

    // Отправка формы вакансии
    const vacancyFormElement = document.getElementById('vacancyForm');
    if (vacancyFormElement) {
        vacancyFormElement.addEventListener('submit', function(e) {
            e.preventDefault();

            // Валидация
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            if (!title.trim() || !description.trim()) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }

            if (description.length > 5000) {
                alert('Описание слишком длинное (максимум 5000 символов)');
                return;
            }

            // Здесь будет AJAX запрос для сохранения
            console.log('Форма вакансии отправлена');
            alert('Вакансия успешно создана!');

            // Сброс формы
            this.reset();
            if (charCount) charCount.textContent = '0';
            hideVacancyForm();

            // В реальном приложении здесь будет обновление списка вакансий
        });
    }

    // Действия с карточками вакансий
    document.querySelectorAll('.vacancy-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-action')) {
                const vacancyId = this.getAttribute('data-id');
                console.log('Просмотр вакансии:', vacancyId);
                // В реальном приложении переход на страницу вакансии
            }
        });
    });

    // Кнопки действий на карточках вакансий
    document.querySelectorAll('.vacancy-card .btn-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const vacancyCard = this.closest('.vacancy-card');
            const vacancyId = vacancyCard ? vacancyCard.getAttribute('data-id') : null;
            const action = this.classList.contains('btn-edit') ? 'edit' :
                          this.classList.contains('btn-view') ? 'view' :
                          this.classList.contains('btn-applications') ? 'applications' :
                          this.classList.contains('btn-pause') ? 'pause' :
                          this.classList.contains('btn-activate') ? 'activate' : '';

            console.log('Действие:', action, 'для вакансии:', vacancyId);

            // В реальном приложении соответствующие действия
            switch(action) {
                case 'edit':
                    alert('Редактирование вакансии ' + vacancyId);
                    break;
                case 'view':
                    alert('Просмотр вакансии ' + vacancyId);
                    break;
                case 'applications':
                    alert('Просмотр откликов на вакансию ' + vacancyId);
                    break;
                case 'pause':
                    if (confirm('Приостановить вакансию?')) {
                        this.innerHTML = '<i class="fas fa-play"></i><span>Активировать</span>';
                        this.classList.remove('btn-pause');
                        this.classList.add('btn-activate');
                        const statusSpan = vacancyCard.querySelector('.vacancy-status');
                        if (statusSpan) {
                            statusSpan.textContent = 'Неактивна';
                            statusSpan.classList.remove('status-active');
                            statusSpan.classList.add('status-inactive');
                        }
                    }
                    break;
                case 'activate':
                    if (confirm('Активировать вакансию?')) {
                        this.innerHTML = '<i class="fas fa-pause"></i><span>Приостановить</span>';
                        this.classList.remove('btn-activate');
                        this.classList.add('btn-pause');
                        const statusSpan = vacancyCard.querySelector('.vacancy-status');
                        if (statusSpan) {
                            statusSpan.textContent = 'Активна';
                            statusSpan.classList.remove('status-inactive');
                            statusSpan.classList.add('status-active');
                        }
                    }
                    break;
            }
        });
    });

    // Инициализация селектов с улучшенным UI
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.cursor = 'pointer';
        select.style.appearance = 'none';
        select.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"%238b5cf6\" viewBox=\"0 0 16 16"%3E%3Cpath d=\"M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\"/%3E%3C/svg%3E")';
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
                salaryMin.style.borderColor = '';
                salaryMax.style.borderColor = '';
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

    // Анимация появления элементов
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

    // Анимируем карточки
    document.querySelectorAll('.vacancy-card, .sidebar-action-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
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

                    if (key === 'description' && charCount) {
                        charCount.textContent = draft[key].length;
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
});