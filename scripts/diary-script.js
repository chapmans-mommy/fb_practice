// Diary functionality
const diary = {
    // Функция переключения статуса задания
    toggleTask: function(checkbox) {
        const progressItem = checkbox.closest('.progress-item');
        const progressStatus = progressItem.querySelector('.progress-status');
        const progressText = progressItem.querySelector('.progress-text');
        
        if (checkbox.checked) {
            progressItem.classList.add('completed');
            progressStatus.textContent = '✓ выполнено';
            progressStatus.className = 'progress-status status-completed';
            progressText.style.textDecoration = 'line-through';
        } else {
            progressItem.classList.remove('completed');
            progressStatus.textContent = 'в процессе';
            progressStatus.className = 'progress-status status-in-progress';
            progressText.style.textDecoration = 'none';
        }
        
        this.updateStats();
    },
    
    // Функция обновления статистики
    updateStats: function() {
        const totalTasks = document.querySelectorAll('.progress-item').length;
        const completedTasks = document.querySelectorAll('.progress-item.completed').length;
        const inProgressTasks = totalTasks - completedTasks;
        
        document.getElementById('completed-count').textContent = completedTasks;
        document.getElementById('in-progress-count').textContent = inProgressTasks;
        document.getElementById('total-count').textContent = totalTasks;
        
        // Обновляем прогресс курсов на основе выполненных заданий
        this.updateCourseProgress(completedTasks, totalTasks);
    },
    
    // Функция обновления прогресса курсов
    updateCourseProgress: function(completed, total) {
        const progressPercentage = Math.round((completed / total) * 100);
        
        // Обновляем прогресс веб-разработки
        const webProgress = document.querySelector('.course-item:nth-child(1) .course-progress');
        const webPercentage = document.querySelector('.course-item:nth-child(1) .course-percentage');
        
        if (webProgress && webPercentage) {
            webProgress.style.width = progressPercentage + '%';
            webPercentage.textContent = progressPercentage + '%';
        }
    },
    
    // Функция добавления нового задания
    addNewTask: function() {
        const taskText = prompt('Введите новое задание:');
        if (taskText && taskText.trim() !== '') {
            const progressList = document.querySelector('.progress-list');
            const taskId = Date.now(); // уникальный ID
            
            const newTask = document.createElement('div');
            newTask.className = 'progress-item';
            newTask.setAttribute('data-task-id', taskId);
            newTask.innerHTML = `
                <div class="progress-checkbox">
                    <input type="checkbox" onchange="diary.toggleTask(this)">
                </div>
                <span class="progress-date">${this.getCurrentDate()}</span>
                <span class="progress-text">${taskText}</span>
                <span class="progress-status status-in-progress">в процессе</span>
            `;
            progressList.appendChild(newTask);
            this.updateStats();
        } else if (taskText !== null) {
            alert('Пожалуйста, введите текст задания!');
        }
    },
    
    // Функция получения текущей даты
    getCurrentDate: function() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('ru', { month: 'short' });
        return `${day} ${month}`;
    },
    
    // Инициализация
    init: function() {
        // Анимация прогресс-баров при загрузке страницы
        const progressBars = document.querySelectorAll('.course-progress');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        
        // Инициализация статистики
        this.updateStats();
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    diary.init();
});

