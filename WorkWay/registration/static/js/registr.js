document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const roleOptions = document.querySelectorAll('input[name="user_type"]');
    const jobSeekerFields = document.querySelector('.job-seeker-fields');
    const employerFields = document.querySelector('.employer-fields');
    const passwordInput = document.getElementById('id_password1');  // ИЗМЕНЕНО
    const confirmPasswordInput = document.getElementById('id_password2');  // ИЗМЕНЕНО
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('confirm_email');

    console.log('DOM загружен');
    console.log('Элементы ролей найдены:', roleOptions.length);
    console.log('Поля соискателя:', jobSeekerFields);
    console.log('Поля работодателя:', employerFields);
    console.log('Поле пароля 1:', passwordInput);
    console.log('Поле пароля 2:', confirmPasswordInput);

    // Переключение видимости пароля
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            console.log('Toggle button clicked');
            console.log('Input element:', input);
            console.log('Icon element:', icon);

            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            } else {
                console.error('Input или icon не найдены');
            }
        });
    });

    // Валидация email
    function validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Валидация пароля
    function validatePassword(password) {
        if (!password) {
            return {
                length: false,
                number: false
            };
        }

        const requirements = {
            length: password.length >= 8,
            number: /\d/.test(password),
        };

        return requirements;
    }

    // Обновление индикатора сложности пароля
    function updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text span');

        if (!strengthFill || !strengthText) {
            console.warn('Элементы для отображения силы пароля не найдены');
            return;
        }

        const requirements = validatePassword(password);

        let strength = 0;
        Object.values(requirements).forEach(isMet => {
            if (isMet) strength++;
        });

        if (strengthFill) {
            strengthFill.setAttribute('data-strength', strength);
        }

        if (strengthText) {
            const messages = [
                'Введите пароль',
                'Слабый пароль',
                'Отличный пароль'
            ];
            strengthText.textContent = messages[strength] || messages[0];
        }
    }

    // Проверка совпадения email
    function checkEmailMatch() {
        if (!emailInput || !confirmEmailInput) {
            console.warn('Поля email не найдены');
            return;
        }

        const email = emailInput.value ? emailInput.value.trim() : '';
        const confirmEmail = confirmEmailInput.value ? confirmEmailInput.value.trim() : '';

        if (!confirmEmail) return;

        if (email === confirmEmail) {
            confirmEmailInput.parentElement.classList.add('valid');
            confirmEmailInput.parentElement.classList.remove('invalid');
        } else {
            confirmEmailInput.parentElement.classList.remove('valid');
            confirmEmailInput.parentElement.classList.add('invalid');
        }
    }

    // Проверка совпадения паролей
    function checkPasswordMatch() {
        if (!passwordInput || !confirmPasswordInput) {
            console.warn('Поля паролей не найдены');
            return;
        }

        const password = passwordInput.value || '';
        const confirmPassword = confirmPasswordInput.value || '';

        if (!confirmPassword) return;

        if (password === confirmPassword) {
            confirmPasswordInput.parentElement.classList.add('valid');
            confirmPasswordInput.parentElement.classList.remove('invalid');
        } else {
            confirmPasswordInput.parentElement.classList.remove('valid');
            confirmPasswordInput.parentElement.classList.add('invalid');
        }
    }

    // Показать/скрыть поля в зависимости от выбранной роли
    function toggleRoleFields(role) {
        console.log('Выбрана роль:', role);

        if (role === 'job_seeker') {
            if (jobSeekerFields) {
                jobSeekerFields.style.display = 'block';
                console.log('Поля соискателя показаны');
            }
            if (employerFields) {
                employerFields.style.display = 'none';
                console.log('Поля работодателя скрыты');
            }

            // Делаем поля резюме необязательными
            if (jobSeekerFields) {
                const jobSeekerInputs = jobSeekerFields.querySelectorAll('input, textarea');
                jobSeekerInputs.forEach(input => {
                    input.removeAttribute('required');
                });
            }
        } else if (role === 'employer') {
            if (jobSeekerFields) {
                jobSeekerFields.style.display = 'none';
                console.log('Поля соискателя скрыты');
            }
            if (employerFields) {
                employerFields.style.display = 'block';
                console.log('Поля работодателя показаны');
            }

            // Делаем поля компании необязательными
            if (employerFields) {
                const employerInputs = employerFields.querySelectorAll('input, textarea');
                employerInputs.forEach(input => {
                    input.removeAttribute('required');
                });
            }
        } else {
            // Если роль не выбрана, скрываем все поля
            if (jobSeekerFields) jobSeekerFields.style.display = 'none';
            if (employerFields) employerFields.style.display = 'none';
        }
    }

    // Обработчик выбора роли
    roleOptions.forEach(option => {
        option.addEventListener('change', function() {
            console.log('Событие change сработало для:', this.value);
            toggleRoleFields(this.value);
        });

        // Также обрабатываем клик на карточку
        const card = option.closest('.role-option');
        if (card) {
            card.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    toggleRoleFields(radio.value);
                }
            });
        }
    });

    // Валидация в реальном времени
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const isValid = validateEmail(this.value);
            if (isValid) {
                this.parentElement.classList.add('valid');
                this.parentElement.classList.remove('invalid');
            } else {
                this.parentElement.classList.remove('valid');
                this.parentElement.classList.add('invalid');
            }
        });
    }

    if (confirmEmailInput) {
        confirmEmailInput.addEventListener('input', checkEmailMatch);
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
            checkPasswordMatch();

            const requirements = validatePassword(this.value);
            const isValid = Object.values(requirements).every(req => req);

            if (isValid) {
                this.parentElement.classList.add('valid');
                this.parentElement.classList.remove('invalid');
            } else {
                this.parentElement.classList.remove('valid');
                this.parentElement.classList.add('invalid');
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    // Валидация имени и фамилии
    const nameInputs = document.querySelectorAll('input[type="text"][name*="name"]');
    nameInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isValid = this.value.trim().length >= 2 && /^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(this.value);
            if (isValid) {
                this.parentElement.classList.add('valid');
                this.parentElement.classList.remove('invalid');
            } else {
                this.parentElement.classList.remove('valid');
                this.parentElement.classList.add('invalid');
            }
        });
    });

    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Сбор данных
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            console.log('Данные формы:', data);

            // Валидация
            const errors = [];

            // Проверка имени и фамилии
            if (!data.first_name || !/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(data.first_name) || data.first_name.trim().length < 2) {
                errors.push('Имя должно содержать минимум 2 буквы и только буквы');
            }

            if (!data.last_name || !/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(data.last_name) || data.last_name.trim().length < 2) {
                errors.push('Фамилия должна содержать минимум 2 буквы и только буквы');
            }

            // Проверка email
            if (!validateEmail(data.email)) {
                errors.push('Введите корректный email');
            }

            if (data.email !== data.confirm_email) {
                errors.push('Email не совпадают');
            }

            // Проверка пароля
            const passwordRequirements = validatePassword(data.password1);  // ИЗМЕНЕНО
            const isPasswordStrong = Object.values(passwordRequirements).every(req => req);

            if (!isPasswordStrong) {
                errors.push('Пароль не соответствует требованиям безопасности');
            }

            if (data.password1 !== data.password2) {  // ИЗМЕНЕНО
                errors.push('Пароли не совпадают');
            }

            // Проверка выбора роли
            if (!data.user_type) {
                errors.push('Выберите тип аккаунта');
            }

            // Проверка соглашения
            if (!data.terms) {
                errors.push('Необходимо принять условия использования');
            }

            // Если есть ошибки
            if (errors.length > 0) {
                showErrors(errors);
                return;
            }

            // Показываем загрузку
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Регистрация...</span>';
                submitBtn.disabled = true;
            }

            // Отправка формы (в реальном проекте будет AJAX)
            setTimeout(() => {
                // В реальном проекте здесь будет:
                this.submit();
            }, 1500);
        });
    } else {
        console.error('Форма не найдена');
    }

    // Показать ошибки
    function showErrors(errors) {
        // Создаем контейнер для ошибок
        let errorContainer = document.querySelector('.error-container');
        if (!errorContainer && form) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'error-container';
            const firstSection = form.querySelector('.form-section');
            if (firstSection) {
                form.insertBefore(errorContainer, firstSection);
            } else {
                form.prepend(errorContainer);
            }
        }

        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <h4>Пожалуйста, исправьте следующие ошибки:</h4>
                        <ul>
                            ${errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Прокручиваем к ошибкам
            errorContainer.scrollIntoView({ behavior: 'smooth' });

            // Автоматическое скрытие через 5 секунд
            setTimeout(() => {
                if (errorContainer.parentElement) {
                    errorContainer.remove();
                }
            }, 5000);
        }
    }

    // Инициализация: скрываем оба блока при загрузке
    if (jobSeekerFields) jobSeekerFields.style.display = 'none';
    if (employerFields) employerFields.style.display = 'none';

    // Проверяем, есть ли уже выбранная роль (например, если вернулись назад)
    const selectedRole = document.querySelector('input[name="user_type"]:checked');
    if (selectedRole) {
        toggleRoleFields(selectedRole.value);
    }

    // Добавляем стили для сообщений об ошибках и успехе
    const style = document.createElement('style');
    style.textContent = `
        .error-container {
            margin-bottom: 30px;
            animation: slideIn 0.5s ease;
        }

        .error-message {
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            gap: 15px;
            align-items: flex-start;
        }

        .error-message i {
            color: #dc2626;
            font-size: 1.5rem;
            flex-shrink: 0;
            margin-top: 3px;
        }

        .error-message h4 {
            color: #dc2626;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }

        .error-message ul {
            margin: 0;
            padding-left: 20px;
            color: #b91c1c;
        }

        .error-message li {
            margin-bottom: 5px;
        }

        .success-message {
            text-align: center;
            padding: 40px 20px;
            animation: slideIn 0.5s ease;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 2.5rem;
            color: white;
        }

        .success-message h3 {
            font-size: 2rem;
            color: #0f172a;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #3b82f6, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .success-subtitle {
            color: #64748b;
            font-size: 1.1rem;
            margin-bottom: 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .success-details {
            background: #f8fafc;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: left;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .success-details p {
            margin-bottom: 10px;
            color: #475569;
        }

        .success-details strong {
            color: #1e293b;
        }

        .success-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            max-width: 500px;
            margin: 0 auto;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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

        .fa-spin {
            animation: fa-spin 1s linear infinite;
        }

        @keyframes fa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});