// Contacts functionality with enhanced accessibility
const contacts = {
    previousActiveElement: null,
    currentModal: null,

    // Валидация формы
    validateForm: function() {
        let isValid = true;
        
        // Валидация имени
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Пожалуйста, введите ваше имя';
            nameInput.setAttribute('aria-invalid', 'true');
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.setAttribute('aria-invalid', 'false');
            nameInput.classList.remove('error');
        }
        
        // Валидация email
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Пожалуйста, введите ваш email';
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Пожалуйста, введите корректный email';
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.textContent = '';
            emailInput.setAttribute('aria-invalid', 'false');
            emailInput.classList.remove('error');
        }
        
        // Валидация сообщения
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Пожалуйста, введите ваше сообщение';
            messageInput.setAttribute('aria-invalid', 'true');
            messageInput.classList.add('error');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Сообщение должно содержать минимум 10 символов';
            messageInput.setAttribute('aria-invalid', 'true');
            messageInput.classList.add('error');
            isValid = false;
        } else {
            messageError.textContent = '';
            messageInput.setAttribute('aria-invalid', 'false');
            messageInput.classList.remove('error');
        }
        
        return isValid;
    },
    
    // Обновление счетчика символов
    updateCharCounter: function() {
        const messageInput = document.getElementById('message');
        const charCounter = document.getElementById('message-length');
        if (messageInput && charCounter) {
            const length = messageInput.value.length;
            charCounter.textContent = `${length}/500 символов`;
            
            // Предупреждение при приближении к лимиту
            if (length > 450) {
                charCounter.style.color = '#ff6b35';
            } else {
                charCounter.style.color = 'var(--text-muted)';
            }
        }
    },
    
    // Отправка формы
    handleSubmit: function(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            const submitBtn = event.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Имитация отправки
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            
            setTimeout(() => {
                this.showSuccessModal();
                document.getElementById('contactForm').reset();
                this.updateCharCounter(); // Сброс счетчика
                submitBtn.disabled = false;
                submitBtn.setAttribute('aria-busy', 'false');
            }, 1500);
        } else {
            // Фокус на первое поле с ошибкой
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    },
    
    // Показать модальное окно успеха
    showSuccessModal: function() {
        this.openModal('successModal');
    },
    
    // Открыть модальное окно
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Запоминаем активный элемент
        this.previousActiveElement = document.activeElement;
        this.currentModal = modal;
        
        // Показываем модальное окно
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        
        // Добавляем класс к body
        document.body.classList.add('modal-open');
        
        // Скрываем остальной контент от скринридера
        this.hideBackgroundContent();
        
        // Фокусируемся на модальном окне
        modal.focus();
        
        // Добавляем обработчики
        this.addModalEventListeners(modal);
    },
    
    // Закрыть модальное окно
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Скрываем модальное окно
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        
        // Убираем класс с body
        document.body.classList.remove('modal-open');
        
        // Восстанавливаем видимость контента
        this.showBackgroundContent();
        
        // Возвращаем фокус на предыдущий элемент
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
        
        // Убираем обработчики
        this.removeModalEventListeners(modal);
        
        this.currentModal = null;
    },
    
    // Скрыть фоновый контент от скринридера
    hideBackgroundContent: function() {
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        const footer = document.querySelector('footer');
        
        [mainContent, header, nav, footer].forEach(element => {
            if (element) {
                element.setAttribute('aria-hidden', 'true');
            }
        });
    },
    
    // Показать фоновый контент
    showBackgroundContent: function() {
        const elements = document.querySelectorAll('[aria-hidden="true"]');
        elements.forEach(element => {
            if (!element.classList.contains('modal')) {
                element.removeAttribute('aria-hidden');
            }
        });
    },
    
    // Добавить обработчики событий для модального окна
    addModalEventListeners: function(modal) {
        // Escape key
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal.id);
            }
        };
        
        // Trap focus inside modal
        this.focusHandler = (e) => {
            this.trapFocus(e, modal);
        };
        
        document.addEventListener('keydown', this.escapeHandler);
        modal.addEventListener('keydown', this.focusHandler);
    },
    
    // Убрать обработчики событий
    removeModalEventListeners: function(modal) {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }
        if (this.focusHandler) {
            modal.removeEventListener('keydown', this.focusHandler);
        }
    },
    
    // Захват фокуса внутри модального окна
    trapFocus: function(event, modal) {
        if (event.key !== 'Tab') return;
        
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    },
    
    // Инициализация
    init: function() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Валидация в реальном времени
            const inputs = document.querySelectorAll('.form-input, .form-textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateForm();
                    }
                    
                    // Обновление счетчика символов для textarea
                    if (input.id === 'message') {
                        this.updateCharCounter();
                    }
                });
                
                input.addEventListener('blur', () => {
                    this.validateForm();
                });
            });
            
            // Инициализация счетчика символов
            this.updateCharCounter();
        }
        
        // Закрытие модального окна при клике вне его
        document.addEventListener('click', (event) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal && modal.id !== 'successModal') {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Улучшенная навигация с клавиатуры
        this.enhanceKeyboardNavigation();
    },
    
    // Улучшенная навигация с клавиатурой
    enhanceKeyboardNavigation: function() {
        // Обработка Enter/Space для всех интерактивных элементов
        document.addEventListener('keydown', (e) => {
            const interactiveSelectors = [
                '.nav-link',
                '.btn',
                '.filter-btn',
                '.social-btn',
                '.submit-btn',
                '.add-entry-btn',
                '.close-btn',
                '.modal-btn'
            ].join(',');
            
            const interactiveElements = document.querySelectorAll(interactiveSelectors);
            
            interactiveElements.forEach(element => {
                if (document.activeElement === element) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    contacts.init();
});

// Поддержка старых браузеров
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}