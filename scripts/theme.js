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