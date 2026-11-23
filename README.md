# Task 2 — Dynamic Task Manager & Productivity Tracker

An interactive task management application with browser localStorage persistence, built as part of the Datheon Full Stack Web Development Internship.

**Intern:** Ekene Martins Okoro
**Organisation:** Datheon (AI Systems & Automation Studio)
**Stack:** HTML5, CSS3, JavaScript (ES6+)

## What it does

- **Create** a task with a title, category and due date
- **Read** your tasks in a clean list, with today's date and progress stats at the top
- **Update** a task — tick it complete, or edit its title
- **Delete** a single task, or clear all completed tasks at once
- **Filter** by All / Active / Completed
- **Search** tasks by title, as you type
- **Save automatically** in the browser with localStorage — tasks survive a page reload, with no server and no account needed

## Categories

- Work
- Personal
- Study

## Progress stats

The header shows, live as you work:

- Total tasks
- Active tasks
- Completed tasks
- % complete, with a progress bar

Overdue tasks (past their due date and not yet complete) are shown in red.

## Project structure

```
Task-2-Dynamic-Task-Manager/
├── index.html
├── README.md
└── assets/
    ├── styles.css
    ├── script.js
    └── task-logo.webp
```

- `index.html` — the app: header and stats, add-task form, filters and search, task list
- `assets/styles.css` — all styling, in the same colours as the Task 1 portfolio
- `assets/script.js` — all logic: CRUD, filters, search, stats and localStorage
- `assets/task-logo.webp` — the EMO + checkmark logo, used as the favicon and the header logo

## How data is stored

Tasks are saved in the browser's localStorage under the key `ekene-tasks`. Each task is stored as:

```json
{
  "id": "1763832000000",
  "title": "Finish Task 2 README",
  "category": "Work",
  "dueDate": "2026-11-23",
  "completed": false
}
```

Clearing your browser data for this site will delete your tasks. There is no server copy.

## Run locally

1. Download or clone this repository.
2. Open the `Task-2-Dynamic-Task-Manager` folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.

No build step, package installation or server is required.

## Links

- GitHub: https://github.com/EKENEMARTINS
- LinkedIn: https://www.linkedin.com/in/ekene-martins-okoro-41a51b383
- Datheon: https://www.datheon.in/training/catalog/full-stack-web-development-internship
