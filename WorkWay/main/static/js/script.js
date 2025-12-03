document.addEventListener('DOMContentLoaded', function() {
    // Анимация для кнопок при наведении
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.btn-icon i');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';

            const arrow = this.querySelector('.btn-arrow i');
            arrow.style.transform = 'translateX(5px)';
            arrow.style.transition = 'transform 0.3s ease';
        });

        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.btn-icon i');
            icon.style.transform = 'scale(1) rotate(0deg)';

            const arrow = this.querySelector('.btn-arrow i');
            arrow.style.transform = 'translateX(0)';
        });
    });

    // Анимация для карточек особенностей
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });

        feature.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            icon.style.transform = 'scale(1)';
        });
    });

    // Добавление анимации при загрузке страницы
    setTimeout(() => {
        document.querySelector('.hero-image-container').style.opacity = '1';
        document.querySelector('.hero-image-container').style.transform = 'translateY(0)';

        // Анимация появления кнопок
        actionButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 300);
});