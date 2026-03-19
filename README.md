# Todo++

A practical, mobile-first todo app with subtasks, starring, and zero clutter.

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser (Vite will pick another port if 5173 is in use).

## Features

- **Add / edit / complete / delete tasks** — the basics, done well
- **Subtasks** — expand any task to break it into steps. Progress shows as "3/8" on the parent. One level deep, no sprawl.
- **Today star** — flag what matters right now. Starred tasks float to the top.
- **Clear completed** — one click to sweep done tasks away
- **Inline editing** — expand a task and tap Edit, or click a subtask's text directly
- **Dark mode** — toggle in the header, persisted across sessions
- **Persistent storage** — everything saves to localStorage automatically
- **Responsive** — works on phone and desktop

## How it works

Tap a task's text to expand it. Inside, you'll find:
- A list of subtasks (if any)
- An input to add new steps
- Edit and Delete buttons for the parent task

Starred tasks sort to the top. Completed tasks drop to the bottom.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |

## Project structure

```
todo-plus-plus/
├── index.html      # The app (HTML + CSS + JS, all-in-one)
├── package.json    # Vite dev server
├── .gitignore
└── README.md
```
