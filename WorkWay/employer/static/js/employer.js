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
                case 'view'
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
// Просмотр деталей вакансии
function showVacancyDetails(vacancyId) {
    console.log('Opening vacancy details for ID:', vacancyId);

    // Устанавливаем заголовок сразу
    document.getElementById('modalTitle').textContent = 'Загрузка...';
    document.getElementById('modalBody').innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка информации о вакансии...</p>
        </div>
    `;

    // Показываем модальное окно
    document.getElementById('vacancyModal').style.display = 'block';

    // Формируем URL
    const url = `/employer/vacancy/${vacancyId}/details/`;
    console.log('Fetching URL:', url);

    // Получаем CSRF токен
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    // Отправляем запрос
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken && {'X-CSRFToken': csrfToken})
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        // Проверяем наличие данных
        if (!data || !data.title) {
            throw new Error('Данные вакансии не получены');
        }

        // Обновляем заголовок
        document.getElementById('modalTitle').textContent = data.title;

        // Форматируем данные
        const formatText = (text) => {
            if (!text || text === 'None') return 'Не указано';
            return text.toString().replace(/\n/g, '<br>');
        };

        // Рендерим содержимое
        document.getElementById('modalBody').innerHTML = `
            <div class="vacancy-details">
                <!-- Основная информация -->
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Основная информация</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Местоположение:</strong>
                            <span>${formatText(data.location)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Тип занятости:</strong>
                            <span>${formatText(data.employment_type)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Зарплата:</strong>
                            <span>${formatText(data.salary)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Требуемый опыт:</strong>
                            <span>${formatText(data.experience)}</span>
                        </div>
                    </div>
                </div>

                <!-- Описание -->
                <div class="detail-section">
                    <h4><i class="fas fa-file-alt"></i> Описание вакансии</h4>
                    <div class="detail-content">${formatText(data.description)}</div>
                </div>

                <!-- Требования -->
                ${data.requirements && data.requirements !== 'None' ? `
                <div class="detail-section">
                    <h4><i class="fas fa-list-check"></i> Требования</h4>
                    <div class="detail-content">${formatText(data.requirements)}</div>
                </div>
                ` : ''}

                <!-- Условия -->
                ${data.benefits && data.benefits !== 'None' ? `
                <div class="detail-section">
                    <h4><i class="fas fa-gift"></i> Мы предлагаем</h4>
                    <div class="detail-content">${formatText(data.benefits)}</div>
                </div>
                ` : ''}

                <!-- Навыки -->
                ${data.skills && data.skills !== 'None' ? `
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> Ключевые навыки</h4>
                    <div class="detail-content">${formatText(data.skills)}</div>
                </div>
                ` : ''}

                <!-- Контакты -->
                <div class="detail-section">
                    <h4><i class="fas fa-address-book"></i> Контакты</h4>
                    <div class="detail-grid">
                        ${data.contact_person && data.contact_person !== 'None' ? `
                        <div class="detail-item">
                            <strong>Контактное лицо:</strong>
                            <span>${data.contact_person}</span>
                        </div>
                        ` : ''}

                        ${data.contact_email && data.contact_email !== 'None' ? `
                        <div class="detail-item">
                            <strong>Email:</strong>
                            <span><a href="mailto:${data.contact_email}">${data.contact_email}</a></span>
                        </div>
                        ` : ''}

                        ${data.contact_phone && data.contact_phone !== 'None' ? `
                        <div class="detail-item">
                            <strong>Телефон:</strong>
                            <span><a href="tel:${data.contact_phone}">${data.contact_phone}</a></span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Статистика -->
                <div class="detail-section">
                    <h4><i class="fas fa-chart-bar"></i> Статистика</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Просмотры:</strong>
                            <span>${data.views_count || 0}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Отклики:</strong>
                            <span>${data.applications_count || 0}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Создана:</strong>
                            <span>${data.created_at || 'Не указано'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Обновлена:</strong>
                            <span>${data.updated_at || 'Не указано'}</span>
                        </div>
                    </div>
                </div>

                <!-- Статусы -->
                <div class="detail-section">
                    <h4><i class="fas fa-tags"></i> Статусы</h4>
                    <div class="tags-container">
                        ${data.is_active ?
                            '<span class="status-tag active"><i class="fas fa-check-circle"></i> Активная</span>' :
                            '<span class="status-tag inactive"><i class="fas fa-pause-circle"></i> Неактивная</span>'
                        }
                        ${data.is_featured ?
                            '<span class="status-tag featured"><i class="fas fa-star"></i> Рекомендуемая</span>' :
                            ''
                        }
                        ${data.is_urgent ?
                            '<span class="status-tag urgent"><i class="fas fa-fire"></i> Срочная</span>' :
                            ''
                        }
                    </div>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error fetching vacancy details:', error);
        document.getElementById('modalTitle').textContent = 'Ошибка';
        document.getElementById('modalBody').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Не удалось загрузить данные</h5>
                <p>${error.message}</p>
                <p>ID вакансии: ${vacancyId}</p>
                <button onclick="showVacancyDetails(${vacancyId})" class="btn-retry">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    });
}