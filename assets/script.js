// Part 1: data, saving, adding, rendering, stats

// 1. Find the pieces of the page we need
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskCategory = document.getElementById('taskCategory');
const taskDueDate = document.getElementById('taskDueDate');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const todayDate = document.getElementById('todayDate');

const STORAGE_KEY = 'ekene-tasks';

const themeToggle = document.getElementById('themeToggle');

    if (localStorage.getItem('task-theme') === 'light') {
        document.documentElement.classList.add('light');
    }

themeToggle.addEventListener('click', function () {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('task-theme', isLight ? 'light' : 'dark');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
});


// 2. Load tasks from localStorage, or start with an empty list
let tasks = [];
    try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
    tasks = [];
    }

// 3. Save the current list to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 4. Show today's date in the header
function setTodayDate() {
    const today = new Date();
    todayDate.textContent = today.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

// 5. Update the 4 stat cards at the top
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
    progressPercent.textContent = percent + '%';
    progressFill.style.width = percent + '%';
}

// 6. Build one task item and put it on the page
function createTaskElement(task) {
    const item = document.createElement('li');
    item.className = 'task-item' + (task.completed ? ' completed' : '');
    item.dataset.id = task.id;

    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());
    const dueText = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No due date';

    item.innerHTML = `
        <input class="task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark ${task.title} as complete">
        <div class="task-content">
        <p class="task-title">${task.title}</p>
        <div class="task-meta">
            <span class="badge badge-${task.category.toLowerCase()}">${task.category}</span>
            <span class="due-date${isOverdue ? ' overdue' : ''}">Due: ${dueText}</span>
        </div>
        </div>
        <div class="task-actions">
        <button class="icon-button" type="button" data-action="edit" aria-label="Edit ${task.title}">✎</button>
        <button class="icon-button delete" type="button" data-action="delete" aria-label="Delete ${task.title}">🗑</button>
        </div>`;

    return item;
}

// 7. Clear the list and rebuild it, showing only what matches the filter + search

let currentFilter = 'all';
let searchText = '';
function getVisibleTasks() {
    return tasks.filter(task => {
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
        const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
  });
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();
    taskList.innerHTML = '';
    visibleTasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    emptyState.style.display = visibleTasks.length === 0 ? 'block' : 'none';
    emptyState.textContent = tasks.length === 0
        ? 'No tasks yet. Add your first task above to get started.'
        : 'No tasks match this filter.';
    updateStats();
}


// 8. Add a new task when the form is submitted
taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const newTask = {
        id: Date.now().toString(),
        title: taskTitle.value.trim(),
        category: taskCategory.value,
        dueDate: taskDueDate.value,
        completed: false
    };

    if (!newTask.title) return;

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskTitle.focus();
});

// 9. Tick a task complete / uncomplete when its checkbox changes
taskList.addEventListener('change', function (event) {
    if (!event.target.classList.contains('task-checkbox')) return;
    const item = event.target.closest('.task-item');
    const task = tasks.find(t => t.id === item.dataset.id);
    if (!task) return;
    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
});

// 10. Start the app
setTodayDate();
renderTasks();

// Part 2: edit, delete, filters, search, clear completed
const filterButtons = document.getElementById('filterButtons');
const searchInput = document.getElementById('searchInput');
const clearCompleted = document.getElementById('clearCompleted');

// Edit and delete — one listener on the whole list, it works out which button was clicked
taskList.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
        if (!button) return;

    const item = button.closest('.task-item');
    const task = tasks.find(t => t.id === item.dataset.id);
        if (!task) return;

        if (button.dataset.action === 'delete') {
            if (!confirm('Delete "' + task.title + '"?')) return;
            tasks = tasks.filter(t => t.id !== task.id);
        }

        if (button.dataset.action === 'edit') {
            const newTitle = prompt('Edit task:', task.title);
            if (newTitle === null) return;
            if (newTitle.trim() === '') return;
            task.title = newTitle.trim();
        }

    saveTasks();
    renderTasks();
});

// Filters — All / Active / Completed
filterButtons.addEventListener('click', function (event) {
    const button = event.target.closest('.filter-button');
        if (!button) return;

        currentFilter = button.dataset.filter;

    document.querySelectorAll('.filter-button').forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });

    renderTasks();
});

// Search — filter as you type
searchInput.addEventListener('input', function () {
    searchText = searchInput.value;
    renderTasks();
});

// Clear completed — delete every ticked-off task at once
clearCompleted.addEventListener('click', function () {
    const completed = tasks.filter(task => task.completed).length;
    if (completed === 0) return;
    if (!confirm('Delete ' + completed + ' completed task(s)?')) return;
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});


const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('year').textContent = new Date().getFullYear();



