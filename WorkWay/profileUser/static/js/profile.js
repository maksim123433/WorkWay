// DOM элементы
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const togglePasswordBtn = document.querySelector('.toggle-password');
const socialButtons = document.querySelectorAll('.social-btn');

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Валидация пароля
function validatePassword(password) {
    return password.length >= 6;
}

// Переключение видимости пароля
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Валидация формы в реальном времени
emailInput.addEventListener('input', function() {
    const isValid = validateEmail(this.value);
    const parent = this.parentElement;
    const validationMessage = parent.querySelector('.validation-message');
    
    if (isValid) {
        parent.classList.add('valid');
        parent.classList.remove('invalid');
        validationMessage.textContent = '';
    } else {
        parent.classList.remove('valid');
        parent.classList.add('invalid');
        validationMessage.textContent = 'Введите корректный email';
    }
});

passwordInput.addEventListener('input', function() {
    const isValid = validatePassword(this.value);
    const parent = this.parentElement;
    const validationMessage = parent.querySelector('.validation-message');
    
    if (isValid) {
        parent.classList.add('valid');
        parent.classList.remove('invalid');
        validationMessage.textContent = '';
    } else {
        parent.classList.remove('valid');
        parent.classList.add('invalid');
        validationMessage.textContent = 'Пароль должен содержать минимум 6 символов';
    }
});

// Обработка отправки формы
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // Валидация
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
        // Показываем сообщение об ошибке
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Пожалуйста, проверьте введенные данные</span>
        `;
        
        // Удаляем предыдущие сообщения
        const existingMessages = document.querySelector('.messages');
        if (existingMessages) {
            existingMessages.innerHTML = '';
            existingMessages.appendChild(messageDiv);
        } else {
            const messagesDiv = document.createElement('div');
            messagesDiv.className = 'messages';
            messagesDiv.appendChild(messageDiv);
            
            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            form.insertBefore(messagesDiv, submitBtn);
        }
        
        return;
    }
    
    // Показываем состояние загрузки
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Вход...</span>
    `;
    submitBtn.disabled = true;
    
    // Симуляция отправки данных (в реальном проекте будет AJAX запрос)
    setTimeout(() => {
        // В реальном проекте здесь будет код отправки формы
        this.submit();
    }, 1500);
});

// Социальные кнопки
socialButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.classList.contains('google-btn') ? 'Google' :
                    this.classList.contains('github-btn') ? 'GitHub' : 'LinkedIn';
        
        // Показываем уведомление
        const notification = document.createElement('div');
        notification.className = 'message info';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Перенаправление на авторизацию через ${type}...</span>
        `;
        
        // Добавляем уведомление
        const existingMessages = document.querySelector('.messages');
        if (existingMessages) {
            existingMessages.innerHTML = '';
            existingMessages.appendChild(notification);
        } else {
            const messagesDiv = document.createElement('div');
            messagesDiv.className = 'messages';
            messagesDiv.appendChild(notification);
            
            const form = document.getElementById('loginForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            form.insertBefore(messagesDiv, submitBtn);
        }
        
        // В реальном проекте здесь будет перенаправление на OAuth
        console.log(`Авторизация через ${type}`);
    });
});

// Восстановление сохраненных данных
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли сохраненные данные
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRemember = localStorage.getItem('rememberMe');
    
    if (savedEmail && savedRemember === 'true') {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
        emailInput.dispatchEvent(new Event('input'));
    }
    
    // Сохранение данных при выходе
    window.addEventListener('beforeunload', function() {
        if (rememberCheckbox.checked && emailInput.value.trim()) {
            localStorage.setItem('rememberedEmail', emailInput.value.trim());
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
        }
    });
    
    // Добавляем стили для спиннера загрузки
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Стили для состояний валидации */
        .floating-input.valid input {
            border-color: #10b981;
        }
        
        .floating-input.invalid input {
            border-color: #ef4444;
        }
        
        .floating-input.valid .input-underline {
            background: #10b981;
            transform: scaleX(1);
        }
        
        .floating-input.invalid .input-underline {
            background: #ef4444;
            transform: scaleX(1);
        }
    `;
    document.head.appendChild(style);
});