// Глобальные функции (должны быть доступны вне DOMContentLoaded)

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Проверяем, начинается ли cookie с нужного имени
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Закрытие модального окна
function closeVacancyModal() {
    document.getElementById('vacancyModal').style.display = 'none';

    // Очищаем содержимое
    document.getElementById('modalTitle').textContent = '';
    document.getElementById('modalBody').innerHTML = '';

    // Останавливаем все анимации
    const modal = document.getElementById('vacancyModal');
    modal.classList.remove('fade-in');
    modal.classList.add('fade-out');

    setTimeout(() => {
        modal.classList.remove('fade-out');
    }, 300);
}

// Анимация открытия модального окна
//function animateModalOpen() {
//    const modal = document.getElementById('vacancyModal');
//    modal.classList.remove('fade-out');
//    modal.classList.add('fade-in');
//}

// Обновление счетчика сохраненных вакансий
function updateSavedCounter() {
    const savedCount = document.querySelectorAll('.save-btn i.fas').length;
    const counterElement = document.getElementById('savedCounter');
    if (counterElement) {
        counterElement.textContent = savedCount;
        if (savedCount > 0) {
            counterElement.style.display = 'inline-block';
        } else {
            counterElement.style.display = 'none';
        }
    }
}

// Добавление/удаление из избранного
function toggleSaveVacancy(vacancyId) {
    const saveButton = document.querySelector(`.js-vacancy[data-id="${vacancyId}"] .save-btn`);
    if (!saveButton) return;

    const icon = saveButton.querySelector('i');
    const isSaved = icon.classList.contains('fas');

    if (isSaved) {
        // Удаляем из избранного
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showNotification('Вакансия удалена из избранного');
    } else {
        // Добавляем в избранное
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#3b82f6';
        showNotification('Вакансия добавлена в избранное');
    }

    updateSavedCounter();
}

// Отправка отклика на сервер
async function sendApplication(vacancyId) {
    try {
        showNotification('Отправка отклика...');

        const response = await fetch(`/apply/${vacancyId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'vacancy_id': vacancyId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showNotification('Отклик успешно отправлен!');

            // Обновляем счетчик откликов на кнопке
            const vacancyCard = document.querySelector(`.js-vacancy[data-id="${vacancyId}"]`);
            if (vacancyCard) {
                const applyButton = vacancyCard.querySelector('.apply-btn');
                if (applyButton) {
                    applyButton.innerHTML = '<i class="fas fa-check"></i> Отклик отправлен';
                    applyButton.disabled = true;
                    applyButton.classList.remove('btn-primary');
                    applyButton.classList.add('btn-success');
                }
            }

            return true;
        } else {
            showNotification(data.message || 'Ошибка при отправке отклика');
            return false;
        }
    } catch (error) {
        console.error('Error sending application:', error);
        showNotification('Ошибка сети при отправке отклика');
        return false;
    }
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Создаем контейнер для уведомлений, если его нет
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(notificationContainer);
    }

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Иконка в зависимости от типа
    let icon = 'fa-check-circle';
    let bgColor = 'linear-gradient(135deg, #3b82f6, #10b981)';

    if (type === 'error') {
        icon = 'fa-exclamation-circle';
        bgColor = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
        bgColor = 'linear-gradient(135deg, #f59e0b, #d97706)';
    }

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    notificationContainer.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Получить данные из всех data-атрибутов карточки
function getVacancyData(vacancyId) {
    const vacancyCard = document.querySelector(`.js-vacancy[data-id="${vacancyId}"]`);





    if (!vacancyCard) return null;

    return {
        id: vacancyCard.dataset.id,
        title: vacancyCard.dataset.title,
        company: vacancyCard.dataset.company || vacancyCard.dataset.companyName,
        location: vacancyCard.dataset.location,
        category: vacancyCard.dataset.category,
        employment: vacancyCard.dataset.employment,
        employmentDisplay: vacancyCard.dataset.employmentDisplay || getEmploymentDisplay(vacancyCard.dataset.employment),
        experience: vacancyCard.dataset.experience,
        experienceDisplay: vacancyCard.dataset.experienceDisplay || getExperienceDisplay(vacancyCard.dataset.experience),
        salaryMin: vacancyCard.dataset.salaryMin,
        salaryMax: vacancyCard.dataset.salaryMax,
        currency: vacancyCard.dataset.currency,
        currencyDisplay: vacancyCard.dataset.currencyDisplay || '₽',
        urgent: vacancyCard.dataset.urgent === 'true',
        featured: vacancyCard.dataset.featured === 'true',
        active: vacancyCard.dataset.active === 'true',
        date: vacancyCard.dataset.date,
        dateDisplay: vacancyCard.dataset.dateDisplay || formatDate(vacancyCard.dataset.date),
        skills: vacancyCard.dataset.skills ? vacancyCard.dataset.skills.split(',').filter(s => s.trim()) : [],
        skillsList: vacancyCard.dataset.skillsList ? vacancyCard.dataset.skillsList.split(',').filter(s => s.trim()) : [],
        description: vacancyCard.dataset.description,
        requirements: vacancyCard.dataset.requirements,
        benefits: vacancyCard.dataset.benefits,
        education: vacancyCard.dataset.education,
        educationDisplay: vacancyCard.dataset.educationDisplay,
        contactPerson: vacancyCard.dataset.contactPerson,
        contactEmail: vacancyCard.dataset.contactEmail,
        contactPhone: vacancyCard.dataset.contactPhone,
        views: parseInt(vacancyCard.dataset.views) || 0,
        applications: parseInt(vacancyCard.dataset.applications) || 0
    };
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Получить отображаемое значение типа занятости
function getEmploymentDisplay(type) {
    const employmentMap = {
        'full': 'Полная занятость',
        'part': 'Частичная занятость',
        'project': 'Проектная работа',
        'internship': 'Стажировка',
        'remote': 'Удалённая работа',
        'freelance': 'Фриланс',
        'full_time': 'Полная занятость',
        'part_time': 'Частичная занятость'
    };
    return employmentMap[type] || type;
}

// Получить отображаемое значение опыта
function getExperienceDisplay(type) {
    const experienceMap = {
        'no': 'Без опыта',
        'junior': 'Junior (до 1 года)',
        'middle': 'Middle (1-3 года)',
        'senior': 'Senior (3-5 лет)',
        'lead': 'Lead (более 5 лет)',
        'no_experience': 'Без опыта',
        '1-3': '1-3 года',
        '3-5': '3-5 лет',
        '5+': 'Более 5 лет'
    };
    return experienceMap[type] || type;
}

// Форматирование зарплаты
function formatSalary(min, max, currency = '₽') {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (minNum && maxNum) {
        return `${minNum.toLocaleString()} - ${maxNum.toLocaleString()} ${currency}`;
    } else if (minNum) {
        return `от ${minNum.toLocaleString()} ${currency}`;
    } else if (maxNum) {
        return `до ${maxNum.toLocaleString()} ${currency}`;
    }
    return 'По договорённости';
}

// Проверка авторизации пользователя
function checkAuth() {
    const csrfToken = getCookie('csrftoken');
    return !!csrfToken; // Простая проверка - если есть CSRF токен, считаем что пользователь авторизован
}

// Обновление UI в зависимости от авторизации
function updateUIForAuth() {
    const isAuthenticated = checkAuth();
    const authButtons = document.querySelectorAll('.auth-required');

    authButtons.forEach(button => {
        if (!isAuthenticated) {
            button.disabled = true;
            button.title = 'Требуется авторизация';
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.disabled = false;
            button.title = '';
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

// Открытие модального окна с данными вакансии
function openVacancyModal(vacancyId) {
    if (event) event.stopPropagation();

    console.log('Opening vacancy details for ID:', vacancyId);

    // Проверяем авторизацию
    if (!checkAuth()) {
        showNotification('Для просмотра деталей вакансии необходимо авторизоваться', 'warning');
        return;
    }

    // Получаем данные вакансии
    const vacancyData = getVacancyData(vacancyId);
    if (!vacancyData) {
        showNotification('Вакансия не найдена', 'error');
        return;
    }

    // Показываем модальное окно
    const modal = document.getElementById('vacancyModal');
    modal.style.display = 'block';

    // Устанавливаем заголовок
    document.getElementById('modalTitle').textContent = vacancyData.title.charAt(0).toUpperCase() + vacancyData.title.slice(1);

    // Загружаем детали
    loadVacancyDetails(vacancyData);
}

// Загрузка деталей вакансии
function loadVacancyDetails(vacancyData) {
    console.log(vacancyData.benefits);
    console.log('hihihi');

    try {
        // Форматируем данные
        const salaryDisplay = formatSalary(vacancyData.salaryMin, vacancyData.salaryMax, vacancyData.currencyDisplay);

        // Формируем HTML
        document.getElementById('modalBody').innerHTML = `
            <div class="vacancy-details">
                <!-- Основная информация -->
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Основная информация</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Компания:</strong>
                            <span>${vacancyData.company.charAt(0).toUpperCase() + vacancyData.company.slice(1)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Местоположение:</strong>
                            <span>${vacancyData.location.charAt(0).toUpperCase() + vacancyData.location.slice(1)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Тип занятости:</strong>
                            <span>${vacancyData.employmentDisplay}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Зарплата:</strong>
                            <span>${salaryDisplay}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Требуемый опыт:</strong>
                            <span>${vacancyData.experienceDisplay}</span>
                        </div>
                        ${vacancyData.educationDisplay ? `
                        <div class="detail-item">
                            <strong>Образование:</strong>
                            <span>${vacancyData.educationDisplay}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Контактная информация -->
                ${vacancyData.contactEmail || vacancyData.contactPhone || vacancyData.contactPerson ? `
                <div class="detail-section">
                    <h4><i class="fas fa-address-book"></i> Контактная информация</h4>
                    <div class="detail-grid">
                        ${vacancyData.contactPerson ? `
                        <div class="detail-item">
                            <strong>Контактное лицо:</strong>
                            <span>${vacancyData.contactPerson}</span>
                        </div>
                        ` : ''}
                        ${vacancyData.contactEmail ? `
                        <div class="detail-item">
                            <strong>Email:</strong>
                            <span>${vacancyData.contactEmail}</span>
                        </div>
                        ` : ''}
                        ${vacancyData.contactPhone ? `
                        <div class="detail-item">
                            <strong>Телефон:</strong>
                            <span>${vacancyData.contactPhone}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <!-- Requirements -->
                ${vacancyData.requirements ? `
                <div class="detail-section">
                    <h4><i class="fas fa-clipboard-check"></i> Требования</h4>
                    <div class="description-content">
                        ${formatText(vacancyData.requirements)}
                    </div>
                </div>
                ` : ''}

                <!-- Навыки -->
                ${vacancyData.skillsList && vacancyData.skillsList.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> Ключевые навыки</h4>
                    <div class="skills-tags-modal">
                        ${vacancyData.skillsList.map(skill => `
                            <span class="skill-tag">${skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1)}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Benefits -->
                ${vacancyData.benefits ? `

                <div class="detail-section detail-section-benef">
                    <h4><i class="fas fa-gift"></i> Условия и преимущества</h4>
                    <div class="description-content">
                        ${formatText(vacancyData.benefits)}

                    </div>
                </div>
                ` : ''}

                <!-- Действия -->
                <div class="detail-section">
                    <h4><i class="fas fa-bolt"></i> Действия</h4>
                    <div class="action-buttons">
                        <button class="btn btn-primary" style="width: 100%;" onclick="applyToVacancy(${vacancyData.id})">
                            <i class="fas fa-paper-plane"></i> Откликнуться на вакансию
                        </button>
                        <button class="btn btn-secondary" style="width: 100%; margin-top: 10px;" onclick="saveVacancy(${vacancyData.id})">
                            <i class="far fa-bookmark"></i> Сохранить вакансию
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Обновляем UI для авторизации
        updateUIForAuth();

    } catch (error) {
        console.error('Error loading vacancy details:', error);
        document.getElementById('modalBody').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Не удалось загрузить данные</h5>
                <p>${error.message}</p>
                <button onclick="loadVacancyDetails(getVacancyData(${vacancyData.id}))" class="btn-retry">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}

// Вспомогательная функция для форматирования текста (сохраняет переносы строк)
function formatText(text) {
    if (!text) return '';
    // Заменяем переносы строк на <br>, экранируем HTML
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
}
// Поделиться вакансией
function shareVacancy(vacancyId) {
    const vacancyData = getVacancyData(vacancyId);
    if (!vacancyData) return;

    const shareText = `Вакансия: ${vacancyData.title} в ${vacancyData.company}. Зарплата: ${formatSalary(vacancyData.salaryMin, vacancyData.salaryMax)}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: vacancyData.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
            showNotification('Ссылка скопирована в буфер обмена');
        });
    }
}

// Инициализация при загрузке страницы
window.addEventListener('load', function() {
    updateUIForAuth();
    updateSavedCounter();
});

//===================

document.addEventListener('DOMContentLoaded', function() {

    // 1. Делегирование сытий для карточек вакансий
    document.addEventListener('click', function(e) {

        console.log(e.target);
        console.log('===============================')
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
                fetch(`/apply/${vacancyId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'), // если Django
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Отклик сохранён!');
                    } else {
                        showNotification(data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    showNotification('Ошибка при отклике');
                });
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

//    =============================

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

