// Contacts functionality
const contacts = {
    // Валидация формы
    validateForm: function() {
        let isValid = true;
        
        // Валидация имени
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Пожалуйста, введите ваше имя';
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('error');
        }
        
        // Валидация email
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Пожалуйста, введите ваш email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Пожалуйста, введите корректный email';
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }
        
        // Валидация сообщения
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Пожалуйста, введите ваше сообщение';
            messageInput.classList.add('error');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Сообщение должно содержать минимум 10 символов';
            messageInput.classList.add('error');
            isValid = false;
        } else {
            messageError.textContent = '';
            messageInput.classList.remove('error');
        }
        
        return isValid;
    },
    
    // Отправка формы
    handleSubmit: function(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            const submitBtn = event.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Имитация отправки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            setTimeout(() => {
                this.showSuccessModal();
                document.getElementById('contactForm').reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        }
    },
    
    // Показать модальное окно успеха
    showSuccessModal: function() {
        this.openModal('successModal');
    },
    
    // Открыть модальное окно
    openModal: function(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    },
    
    // Закрыть модальное окно
    closeModal: function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    },
    
    // Инициализация
    init: function() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Закрытие модального окна при клике вне его
        document.addEventListener('click', (event) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Валидация в реальном времени
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateForm();
                }
            });
        });
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    contacts.init();
});