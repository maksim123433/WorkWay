// previous-positions.js
document.addEventListener('DOMContentLoaded', function() {
    const positionsContainer = document.getElementById('previous-positions-container');
    const positionsInput = document.getElementById('previous_positions');
    const addPositionBtn = document.getElementById('add-position-btn');
    const positionModal = document.getElementById('position-modal');
    const positionTemplate = document.getElementById('position-template');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const savePositionBtn = document.getElementById('save-position-btn');

    let positions = [];
    let editingIndex = -1;

    // Загружаем существующие позиции при загрузке страницы
    function loadPositions() {
        try {
            const savedPositions = positionsInput.value ? JSON.parse(positionsInput.value) : [];
            positions = savedPositions;
            renderPositions();
        } catch (error) {
            console.error('Ошибка при загрузке позиций:', error);
            positions = [];
        }
    }

    // Отображение всех позиций
    function renderPositions() {
        positionsContainer.innerHTML = '';

        if (positions.length === 0) {
            positionsContainer.innerHTML = `
                <div class="no-positions">
                    <i class="fas fa-briefcase"></i>
                    <p>Добавьте информацию о предыдущих местах работы</p>
                </div>
            `;
            return;
        }

        positions.forEach((position, index) => {
            const positionElement = createPositionElement(position, index);
            positionsContainer.appendChild(positionElement);
        });

        updateHiddenInput();
    }

    // Создание элемента позиции
    function createPositionElement(position, index) {
        const template = positionTemplate.content.cloneNode(true);
        const positionElement = template.querySelector('.position-item');

        // Заполняем данными
        positionElement.querySelector('.position-title').textContent = position.position;
        positionElement.querySelector('.position-company').textContent = position.company;
        positionElement.querySelector('.position-period').textContent = position.period;

        if (position.description) {
            positionElement.querySelector('.position-description').textContent = position.description;
        } else {
            positionElement.querySelector('.position-description').style.display = 'none';
        }

        // Сохраняем данные в скрытом поле
        positionElement.querySelector('.position-data').value = JSON.stringify(position);

        // Назначаем индексы для кнопок редактирования/удаления
        const editBtn = positionElement.querySelector('.btn-edit-position');
        const deleteBtn = positionElement.querySelector('.btn-delete-position');

        editBtn.dataset.index = index;
        deleteBtn.dataset.index = index;

        editBtn.addEventListener('click', () => editPosition(index));
        deleteBtn.addEventListener('click', () => deletePosition(index));

        return positionElement;
    }

    // Открытие модального окна для добавления/редактирования
    function openModal(position = null) {
        if (position) {
            // Редактирование существующей позиции
            document.getElementById('position-period').value = position.period || '';
            document.getElementById('position-title').value = position.position || '';
            document.getElementById('position-company').value = position.company || '';
            document.getElementById('position-description').value = position.description || '';
        } else {
            // Добавление новой позиции
            document.getElementById('position-period').value = '';
            document.getElementById('position-title').value = '';
            document.getElementById('position-company').value = '';
            document.getElementById('position-description').value = '';
        }

        positionModal.style.display = 'block';
    }

    // Закрытие модального окна
    function closeModal() {
        positionModal.style.display = 'none';
        editingIndex = -1;
    }

    // Сохранение позиции
    function savePosition() {
        const period = document.getElementById('position-period').value.trim();
        const position = document.getElementById('position-title').value.trim();
        const company = document.getElementById('position-company').value.trim();
        const description = document.getElementById('position-description').value.trim();

        // Валидация
        if (!period) {
            alert('Пожалуйста, укажите период работы');
            return;
        }

        if (!position) {
            alert('Пожалуйста, укажите должность');
            return;
        }

        if (!company) {
            alert('Пожалуйста, укажите компанию');
            return;
        }

        const positionData = {
            period: period,
            position: position,
            company: company,
            description: description,
            order: editingIndex !== -1 ? positions[editingIndex].order : positions.length
        };

        if (editingIndex !== -1) {
            // Редактирование существующей позиции
            positions[editingIndex] = positionData;
        } else {
            // Добавление новой позиции
            positions.push(positionData);
        }

        renderPositions();
        closeModal();
    }

    // Редактирование позиции
    function editPosition(index) {
        editingIndex = index;
        openModal(positions[index]);
    }

    // Удаление позиции
    function deletePosition(index) {
        if (confirm('Вы уверены, что хотите удалить эту должность?')) {
            positions.splice(index, 1);
            renderPositions();
        }
    }

    // Обновление скрытого поля с JSON
    function updateHiddenInput() {
        positionsInput.value = JSON.stringify(positions);
    }

    // Инициализация
    function init() {
        loadPositions();

        // Обработчики событий
        addPositionBtn.addEventListener('click', () => openModal());

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        savePositionBtn.addEventListener('click', savePosition);

        // Закрытие модального окна при клике вне его
        window.addEventListener('click', (event) => {
            if (event.target === positionModal) {
                closeModal();
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && positionModal.style.display === 'block') {
                closeModal();
            }
        });
    }

    // Запуск инициализации
    init();
});