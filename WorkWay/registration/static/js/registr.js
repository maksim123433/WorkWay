// registr.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('registr.js loaded');

    // Элементы
    const jobSeekerRadio = document.querySelector('input[name="account_type"][value="job_seeker"]');
    const employerRadio = document.querySelector('input[name="account_type"][value="employer"]');
    const jobSeekerSection = document.getElementById('job-seeker-section');
    const employerSection = document.getElementById('employer-section');
    const jobSeekerCard = document.querySelector('.job-seeker-option .role-card');
    const employerCard = document.querySelector('.employer-option .role-card');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Функция для показа/скрытия секций
    function toggleSections() {
        if (jobSeekerRadio && jobSeekerRadio.checked) {
            if (jobSeekerSection) jobSeekerSection.style.display = 'block';
            if (employerSection) employerSection.style.display = 'none';

            // Делаем поля соискателя необязательными если они скрыты
            document.querySelectorAll('#employer-section input, #employer-section select, #employer-section textarea').forEach(el => {
                el.removeAttribute('required');
            });

            // Делаем обязательные поля для соискателя
            document.querySelectorAll('#job-seeker-section input[required], #job-seeker-section select[required], #job-seeker-section textarea[required]').forEach(el => {
                el.setAttribute('required', 'required');
            });

        } else if (employerRadio && employerRadio.checked) {
            if (jobSeekerSection) jobSeekerSection.style.display = 'none';
            if (employerSection) employerSection.style.display = 'block';

            // Делаем поля соискателя необязательными
            document.querySelectorAll('#job-seeker-section input, #job-seeker-section select, #job-seeker-section textarea').forEach(el => {
                el.removeAttribute('required');
            });

            // Делаем обязательные поля для работодателя
            document.querySelectorAll('#employer-section input[required], #employer-section select[required], #employer-section textarea[required]').forEach(el => {
                el.setAttribute('required', 'required');
            });
        }

        // Обновляем визуальное состояние карточек
        updateCardSelection();
    }

    // Функция обновления визуального выделения карточек
    function updateCardSelection() {
        if (jobSeekerRadio && jobSeekerRadio.checked && jobSeekerCard) {
            jobSeekerCard.classList.add('selected');
            if (employerCard) employerCard.classList.remove('selected');
        }
        if (employerRadio && employerRadio.checked && employerCard) {
            employerCard.classList.add('selected');
            if (jobSeekerCard) jobSeekerCard.classList.remove('selected');
        }
    }

    // Обработчик клика на карточку соискателя
    if (jobSeekerCard) {
        jobSeekerCard.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Job seeker card clicked');

            if (jobSeekerRadio) {
                jobSeekerRadio.checked = true;
                toggleSections();

                setTimeout(() => {
                    if (jobSeekerSection) {
                        jobSeekerSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    }

    // Обработчик клика на карточку работодателя
    if (employerCard) {
        employerCard.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Employer card clicked');

            if (employerRadio) {
                employerRadio.checked = true;
                toggleSections();

                setTimeout(() => {
                    if (employerSection) {
                        employerSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    }

    // Обработчики событий для радиокнопок
    if (jobSeekerRadio) {
        jobSeekerRadio.addEventListener('change', toggleSections);
    }

    if (employerRadio) {
        employerRadio.addEventListener('change', toggleSections);
    }

    // Переключение видимости пароля - ОБНОВЛЕННАЯ ВЕРСИЯ
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            console.log('Toggle password button clicked');

            // Ищем input относительно кнопки
            const passwordWrapper = this.closest('.password-wrapper');
            const input = passwordWrapper ? passwordWrapper.querySelector('input') : null;
            const icon = this.querySelector('i');

            console.log('Password wrapper:', passwordWrapper);
            console.log('Input element:', input);
            console.log('Icon element:', icon);

            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    console.log('Password shown');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    console.log('Password hidden');
                }
            } else {
                console.error('Input или icon не найдены');
            }
        });
    });

    // Добавляем обработчик на password-wrapper, чтобы предотвратить случайные клики
    document.querySelectorAll('.password-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', function(e) {
            if (e.target !== wrapper.querySelector('.toggle-password') &&
                e.target !== wrapper.querySelector('.toggle-password i')) {
                e.stopPropagation();
            }
        });
    });

    // Инициализация при загрузке страницы
    toggleSections();
    console.log('Initialization complete');
});