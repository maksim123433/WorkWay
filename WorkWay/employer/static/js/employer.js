
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

//            if (e.target.closest('.btn-applications')) {
//                console.log(e.target);
//                console.log(vacancyId)
//            }
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



            // В реальном приложении соответствующие действия
            switch(action) {
                case 'edit':
                    // Редактирование
                    break;

                case 'view':
                    console.log(action);
                    console.log('xyi11111111111ы');
                    console.log(e.currentTarget);
                    console.log(e.currentTarget.dataset.vacancyId);
                    const vacancyId = e.currentTarget.dataset.vacancyId;
                    openVacancyModal(vacancyId);
                    break;

                case 'applications':
                    console.log('Открываем отклики');

                    const applicationsVacancyId = e.currentTarget.dataset.vacancyId;
                    console.log('Vacancy ID:', applicationsVacancyId);

                    if (applicationsVacancyId) {
                        // Делаем запрос к серверу
                        fetch(`/otkliki/${applicationsVacancyId}/`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log('Данные получены успешно')
                                return response.json();
                            }
                            throw new Error('Ошибка сети: ' + response.status);
                        })
                        .then(data => {
                            console.log('Ответ от сервера:', data);

                            // ОДНА ФУНКЦИЯ, которая всё делает
                            showApplicationsModalSimple(applicationsVacancyId, data);
                        })
                        .catch(error => {
                            console.error('Ошибка при запросе:', error);
                            alert('Не удалось загрузить отклики: ' + error.message);
                        });
                    }
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
function showVacancyDetails(vacancyId) {
    openVacancyModal(vacancyId);
}




//
//==========================================================
//==========================================================

// Глобальные функции (должны быть доступны вне DOMContentLoaded)


const btnView = document.querySelectorAll('.btn-view');
console.log(btnView)
console.log('z=z==z=z==z=z=z==z')

function openVacancyModal(vacancyId) {




    // event передается как параметр при вызове из обработчика
    if (event) event.stopPropagation();

    console.log('Opening vacancy details for ID:', vacancyId);

    // Устанавливаем заголовок сразу
    console.log(document.getElementById('modalTitle'))

    document.getElementById('modalTitle').textContent = 'Загрузка...';
    document.getElementById('modalBody').innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка информации о вакансии...</p>
        </div>
    `;

    // Показываем модальное окно
    document.getElementById('vacancyModal').style.display = 'block';

    setTimeout(() => {
        loadVacancyDetails(vacancyId);
    }, 500);
}

function loadVacancyDetails(vacancyId) {
    console.log('zzzzz')
    const vacID = Number(vacancyId); // число

    try {
        // Находим карточку вакансии через data-id
        const vacancyCard = document.querySelector(`.vacancy-card[data-id="vacancy-${vacID}"]`);

        if (!vacancyCard) {
            throw new Error('Вакансия не найдена');
        }

        // Получаем данные из data-атрибутов карточки
        const title = vacancyCard.dataset.title;
        const company = vacancyCard.dataset.company;
        const location = vacancyCard.dataset.location;
        const employment = getEmploymentDisplay(vacancyCard.dataset.employment);
        const experience = getExperienceDisplay(vacancyCard.dataset.experience);
        const salaryMin = vacancyCard.dataset.salaryMin;
        const salaryMax = vacancyCard.dataset.salaryMax;
        const isUrgent = vacancyCard.dataset.urgent === 'true';
        const isFeatured = vacancyCard.dataset.featured === 'true';
        const skills = (vacancyCard.dataset.skills || "")
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        const date = new Date(vacancyCard.dataset.date).toLocaleDateString('ru-RU');
        const requirements = vacancyCard.dataset.requirements || "";
        const benefits = vacancyCard.dataset.benefits || "";

        // Форматируем зарплату
        const salaryDisplay = formatSalary(salaryMin, salaryMax);

        // Обновляем заголовок
        document.getElementById('modalTitle').textContent =
            title.charAt(0).toUpperCase() + title.slice(1);

        // Формируем HTML содержимое
        document.getElementById('modalBody').innerHTML = `
            <div class="vacancy-details">
                <!-- Основная информация -->
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Основная информация</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><strong>Компания:</strong> <span>${company}</span></div>
                        <div class="detail-item"><strong>Местоположение:</strong> <span>${location}</span></div>
                        <div class="detail-item"><strong>Тип занятости:</strong> <span>${employment}</span></div>
                        <div class="detail-item"><strong>Зарплата:</strong> <span>${salaryDisplay}</span></div>
                        <div class="detail-item"><strong>Требуемый опыт:</strong> <span>${experience}</span></div>
                    </div>
                </div>

                <!-- Навыки -->
                ${skills.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> Ключевые навыки</h4>
                    <div class="skills-tags-modal">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>` : ''}

                <!-- Требования -->
                ${requirements ? `
                <div class="detail-section">
                    <h4><i class="fas fa-list"></i> Требования</h4>
                    <p>${requirements}</p>
                </div>` : ''}

                <!-- Преимущества -->
                ${benefits ? `
                <div class="detail-section">
                    <h4><i class="fas fa-gift"></i> Преимущества</h4>
                    <p>${benefits}</p>
                </div>` : ''}

                <!-- Статистика -->
                <div class="detail-section">
                    <h4><i class="fas fa-chart-bar"></i> Информация</h4>
                    <div class="detail-grid">
                        <div class="detail-item"><strong>Дата публикации:</strong> <span>${date}</span></div>
                        <div class="detail-item"><strong>Статус:</strong> <span>Активная</span></div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading vacancy details:', error);
        document.getElementById('modalTitle').textContent = 'Ошибка';
        document.getElementById('modalBody').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Не удалось загрузить данные</h5>
                <p>${error.message}</p>
                <button onclick="loadVacancyDetails(${vacancyId})" class="btn-retry">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}




function getEmploymentDisplay(type) {
    const employmentMap = {
        'full_time': 'Полная занятость',
        'part_time': 'Частичная занятость',
        'project': 'Проектная работа',
        'internship': 'Стажировка',
        'remote': 'Удалённая работа',
        'freelance': 'Фриланс'
    };
    return employmentMap[type] || 'Не указано';
}

function getExperienceDisplay(type) {
    const experienceMap = {
        'no_experience': 'Без опыта',
        '1-3': '1-3 года',
        '3-5': '3-5 лет',
        '5+': 'Более 5 лет'
    };
    return experienceMap[type] || 'Не указано';
}

function formatSalary(min, max) {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (minNum && maxNum) {
        return `${minNum.toLocaleString()} - ${maxNum.toLocaleString()} ₽`;
    } else if (minNum) {
        return `от ${minNum.toLocaleString()} ₽`;
    } else if (maxNum) {
        return `до ${maxNum.toLocaleString()} ₽`;
    }
    return 'По договорённости';
}

function applyToVacancy(vacancyId) {
    if (event) event.stopPropagation();
    alert(`Вы откликнулись на вакансию ${vacancyId}`);
    closeVacancyModal();
}

function saveVacancy(vacancyId) {
    if (event) event.stopPropagation();
    alert(`Вакансия ${vacancyId} сохранена`);
    closeVacancyModal();
}

// Основной обработчик DOMContentLoaded (ОДИН!)
document.addEventListener('DOMContentLoaded', function() {

    // 1. Делегирование событий для карточек вакансий
    document.addEventListener('click', function(e) {
        // Клик по карточке вакансии (но не по кнопкам внутри)
        const vacancyCard = e.target.closest('.js-vacancy');
        if (vacancyCard && !e.target.closest('.save-btn') && !e.target.closest('.apply-btn')) {
            e.preventDefault();
            const vacancyId = vacancyCard.dataset.id;
            if (vacancyId) {
                openVacancyModal(vacancyId);
            }
        }

        // Клик по кнопке "Откликнуться"
        const applyBtn = e.target.closest('.apply-btn');
        if (applyBtn) {
            e.preventDefault();
            e.stopPropagation();
            const vacancyCard = applyBtn.closest('.js-vacancy');
            const vacancyId = vacancyCard ? vacancyCard.dataset.id : null;
            if (vacancyId) {
                openVacancyModal(vacancyId);
            }
        }

        // Клик по кнопке "Сохранить"
        const saveBtn = e.target.closest('.save-btn');
        if (saveBtn) {
            e.preventDefault();
            e.stopPropagation();

            const icon = saveBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#3b82f6';
                showNotification('Вакансия добавлена в избранное');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Вакансия удалена из избранного');
            }
        }
    });

    // 2. Обработчики для фильтров и поиска
    // Переключение быстрых фильтров
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Переключение популярных городов
    const cityTags = document.querySelectorAll('.city-tag');
    cityTags.forEach(tag => {
        tag.addEventListener('click', function() {
            cityTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 3. Остальные обработчики (поиск, сортировка и т.д.)
    // Поиск вакансий
    const searchInput = document.getElementById('jobSearch');
    const searchButton = document.querySelector('.search-btn');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Ищем вакансии по запросу: "${query}"`);
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Поиск...';
            searchButton.disabled = true;

            setTimeout(() => {
                searchButton.innerHTML = '<i class="fas fa-search"></i> Найти';
                searchButton.disabled = false;
                showNotification(`Найдено 12 вакансий по запросу: "${query}"`);
            }, 1500);
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Применение фильтров
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const resetFiltersBtn = document.querySelector('.reset-filters');

    applyFiltersBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        showNotification('Фильтры применены');
    });

    resetFiltersBtn.addEventListener('click', function() {
        showNotification('Фильтры сброшены');
    });

    // Сортировка
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', function() {
        showNotification(`Сортировка: ${this.options[this.selectedIndex].text}`);
    });

    // 4. Глобальные обработчики для модального окна
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('vacancyModal');
        if (event.target === modal) {
            closeVacancyModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeVacancyModal();
        }
    });

    // 5. Уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #10b981);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Добавляем стили для анимаций уведомлений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 6. Анимация при загрузке страницы
    setTimeout(() => {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.opacity = '1';
            searchContainer.style.transform = 'translateY(0)';
        }

        const vacancyCards = document.querySelectorAll('.vacancy-card');
        vacancyCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});


checkBtn.forEach(el => {
    el.addEventListener('click', showVacancyDetails);

})

function closeVacancyModal() {
    document.getElementById('vacancyModal').style.display = 'none';
}


// ========== МОДАЛЬНОЕ ОКНО ОТКЛИКОВ ==========

// ========== ПРОСТОЕ МОДАЛЬНОЕ ОКНО ОТКЛИКОВ ==========

function showApplicationsModalSimple(vacancyId, data) {
    console.log('Создаем модальное окно для откликов вакансии:', vacancyId);
    console.log(data, 'data------------------>');

    const modalOtklick = document.querySelector('.modal-otklick');

    // Очищаем и наполняем содержимое
    modalOtklick.innerHTML = `
        <div class="modal-otklick-content">
            <button class="modal-otklick-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-otklick-header">
                <h2>
                    <i class="fas fa-users"></i>
                    Отклики на вакансию #${vacancyId}
                    <span class="modal-otklick-count">${data.count || 0}</span>
                </h2>
            </div>
            <div class="modal-otklick-body">
                ${getOtklickContent(data)}
            </div>
        </div>
    `;

    // Показываем окно
    modalOtklick.style.display = 'block';

    // Вешаем обработчики
    setupOtklickModalEvents();
}

// Функция для создания контента
function getOtklickContent(data) {
    const persons = data.persons || [];

    if (persons.length === 0) {
        return `
            <div class="otklick-empty">
                <div class="otklick-empty-icon">
                    <i class="fas fa-user-slash"></i>
                </div>
                <h3>На эту вакансию пока нет откликов</h3>
                <p>Здесь будут появляться отклики соискателей</p>
            </div>
        `;
    }

    let html = '<div class="otklick-list">';

    persons.forEach(person => {
        const date = new Date(person.created_at);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const relativeTime = getRelativeTime(date);
        const personName = person.name || 'Анонимный соискатель';

        html += `
            <div class="otklick-card">
                <div class="otklick-card-header">
                    <div class="otklick-card-info">
                        <div class="otklick-card-name">
                            <i class="fas fa-user-circle"></i>
                            ${escapeHtml(personName)}
                        </div>
                        <div class="otklick-card-email">
                            <i class="fas fa-envelope"></i>
                            ${person.email ?
                                `<a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a>` :
                                '<span style="color: #64748b;">Email не указан</span>'
                            }
                        </div>
                    </div>
                    <div class="otklick-card-date" title="${formattedDate}">
                        <i class="far fa-clock"></i>
                        ${relativeTime}
                    </div>
                </div>
                <div class="otklick-card-actions">
                    ${person.email ? `
                    <button class="otklick-btn otklick-btn-contact"
                            onclick="contactApplicant('${escapeHtml(person.email)}')">
                        <i class="fas fa-comment"></i>
                        Написать
                    </button>
                    ` : `
                    <button class="otklick-btn otklick-btn-contact" disabled style="opacity: 0.5;">
                        <i class="fas fa-comment"></i>
                        Email не указан
                    </button>
                    `}
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Кнопка закрытия
    html += `<button class="otklick-btn-close">Закрыть</button>`;

    return html;
}

// Функция для обработчиков событий
function setupOtklickModalEvents() {
    const modal = document.querySelector('.modal-otklick');
    const closeBtn = modal.querySelector('.modal-otklick-close');
    const closeBottomBtn = modal.querySelector('.otklick-btn-close');

    // Функция закрытия
    function closeModal() {
        modal.style.display = 'none';
    }

    // Закрытие по крестику
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Закрытие по кнопке внизу
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);

    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Вспомогательные функции
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function contactApplicant(email) {
    if (!email || email === 'Email не указан') {
        alert('У соискателя не указан email');
        return;
    }
    window.location.href = `mailto:${email}?subject=Ваш отклик на вакансию`;
}