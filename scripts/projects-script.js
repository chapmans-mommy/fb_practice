function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        // Даем время на загрузку страницы
        setTimeout(() => {
            const projectElement = document.querySelector(`[data-project="${projectId}"]`);
            if (projectElement) {
                // Прокручиваем к проекту
                projectElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Добавляем подсветку
                projectElement.style.boxShadow = '0 0 0 3px #4a6fa5';
                setTimeout(() => {
                    projectElement.style.boxShadow = '';
                }, 3000);
            }
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// scripts/theme.js
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.themeText = document.querySelector('.theme-text');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Применяем сохраненную тему
        this.applyTheme(this.currentTheme);
        
        // Вешаем обработчик на переключатель
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Следим за системными настройками
        this.watchSystemTheme();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleButton(theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    updateToggleButton(theme) {
        if (this.themeIcon && this.themeText) {
            if (theme === 'dark') {
                this.themeIcon.textContent = '☀️';
                this.themeText.textContent = 'Светлая тема';
            } else {
                this.themeIcon.textContent = '🌙';
                this.themeText.textContent = 'Темная тема';
            }
        }
    }
    
    watchSystemTheme() {
        // Следим за изменениями системной темы
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Меняем тему только если пользователь не выбирал вручную
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Применяем системную тему при первой загрузке, если нет сохраненной
        if (!localStorage.getItem('theme') && mediaQuery.matches) {
            this.applyTheme('dark');
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});