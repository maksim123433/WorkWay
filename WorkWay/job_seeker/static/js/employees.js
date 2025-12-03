document.addEventListener('DOMContentLoaded', function() {
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

    // Кнопки сохранения вакансий
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#3b82f6';

                // Анимация
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);

                // Уведомление
                showNotification('Вакансия добавлена в избранное');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';

                // Уведомление
                showNotification('Вакансия удалена из избранного');
            }
        });
    });

    // Кнопки отклика
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Анимация
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Изменение состояния кнопки
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Отправлено';
            this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            this.disabled = true;

            // Уведомление
            showNotification('Отклик успешно отправлен!');

            // Через 3 секунды возвращаем исходное состояние
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
                this.disabled = false;
            }, 3000);
        });
    });

    // Пагинация
    const pageButtons = document.querySelectorAll('.page-btn:not(.next-btn)');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) return;

            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Анимация перехода (имитация)
            const vacanciesGrid = document.querySelector('.vacancies-grid');
            vacanciesGrid.style.opacity = '0.5';
            setTimeout(() => {
                vacanciesGrid.style.opacity = '1';
                vacanciesGrid.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    });

    // Поиск вакансий
    const searchInput = document.getElementById('jobSearch');
    const searchButton = document.querySelector('.search-btn');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Имитация поиска
            showNotification(`Ищем вакансии по запросу: "${query}"`);

            // Анимация поиска
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
        // Анимация
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);

        // Уведомление
        showNotification('Фильтры применены');

        // Имитация загрузки
        const vacanciesGrid = document.querySelector('.vacancies-grid');
        vacanciesGrid.style.opacity = '0.5';

        setTimeout(() => {
            vacanciesGrid.style.opacity = '1';
            vacanciesGrid.style.transition = 'opacity 0.3s ease';
        }, 500);
    });

    resetFiltersBtn.addEventListener('click', function() {
        // Сброс чекбоксов
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = checkbox.hasAttribute('checked');
        });

        // Сброс радио кнопок
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = radio.hasAttribute('checked');
        });

        // Сброс быстрых фильтров
        filterTags.forEach((tag, index) => {
            tag.classList.toggle('active', index === 0);
        });

        // Сброс городов
        cityTags.forEach((tag, index) => {
            tag.classList.toggle('active', index === 1);
        });

        showNotification('Фильтры сброшены');
    });

    // Сортировка
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', function() {
        showNotification(`Сортировка: ${this.options[this.selectedIndex].text}`);

        // Анимация
        const vacanciesGrid = document.querySelector('.vacancies-grid');
        vacanciesGrid.style.opacity = '0.5';

        setTimeout(() => {
            vacanciesGrid.style.opacity = '1';
            vacanciesGrid.style.transition = 'opacity 0.3s ease';
        }, 300);
    });

    // Функция показа уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // Стили для уведомления
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

        // Добавляем в DOM
        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
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

    // Анимация при загрузке страницы
    setTimeout(() => {
        document.querySelector('.search-container').style.opacity = '1';
        document.querySelector('.search-container').style.transform = 'translateY(0)';

        // Анимация появления карточек
        const vacancyCards = document.querySelectorAll('.vacancy-card');
        vacancyCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});