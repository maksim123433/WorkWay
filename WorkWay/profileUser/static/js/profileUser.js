document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница профиля загружена');

    // Анимация появления элементов
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.info-section, .stat-card, .vacancy-card');

        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    // Установка начальных стилей для анимации
    const sections = document.querySelectorAll('.info-section, .stat-card, .vacancy-card');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Запуск анимации при загрузке
    setTimeout(animateOnScroll, 300);

    // Анимация при скролле
    window.addEventListener('scroll', animateOnScroll);

    // Обработчики кнопок
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Редактирование профиля', 'Функция редактирования будет доступна в следующем обновлении!');
        });
    }

    const addVacancyBtn = document.querySelector('.add-vacancy-btn');
    if (addVacancyBtn) {
        addVacancyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Добавление вакансии', 'Вы сможете добавить новую вакансию в следующем обновлении!');
        });
    }

    // Обработчики быстрых действий
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const actionText = this.querySelector('span').textContent;
            showNotification(actionText, 'Функция будет доступна в ближайшее время!');
        });
    });

    // Обработчики полезных ссылок
    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.querySelector('span').textContent;
            showNotification(linkText, 'Страница находится в разработке');
        });
    });

    // Функция показа уведомления
    function showNotification(title, message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <h4>${title}</h4>
                    <button class="close-notification">&times;</button>
                </div>
                <p>${message}</p>
            </div>
        `;

        // Добавляем стили для уведомления
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    max-width: 400px;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                .notification-content {
                    padding: 20px;
                }

                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .notification-header h4 {
                    color: #1e293b;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .close-notification {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }

                .notification p {
                    color: #64748b;
                    margin: 0;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);
        }

        // Добавляем уведомление на страницу
        document.body.appendChild(notification);

        // Добавляем обработчик закрытия
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        });

        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Анимация для карточек при наведении
    const cards = document.querySelectorAll('.stat-card, .vacancy-card, .quick-action-btn');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Индикатор загрузки (симуляция)
    function simulateLoading() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Загрузка...</p>
            </div>
        `;

        // Стили для индикатора загрузки
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }

            .loading-spinner {
                text-align: center;
            }

            .loading-spinner i {
                font-size: 3rem;
                color: #3b82f6;
                margin-bottom: 20px;
            }

            .loading-spinner p {
                color: #64748b;
                font-size: 1.1rem;
            }

            .fa-spin {
                animation: fa-spin 1s linear infinite;
            }

            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(loadingOverlay);

        // Удаляем через 1.5 секунды (симуляция загрузки)
        setTimeout(() => {
            if (loadingOverlay.parentElement) {
                loadingOverlay.parentElement.removeChild(loadingOverlay);
            }
        }, 1500);
    }

    // Показываем индикатор загрузки при клике на основные действия
    const mainActions = document.querySelectorAll('.edit-profile-btn, .add-vacancy-btn');
    mainActions.forEach(action => {
        action.addEventListener('click', function() {
            setTimeout(simulateLoading, 300);
        });
    });
});
