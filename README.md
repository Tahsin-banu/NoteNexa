<div align="center">

<img src="https://img.shields.io/badge/NoteNexa-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI4IiBmaWxsPSIjN0MzQUVEIi8+PHBhdGggZD0iTTggOWgxMk04IDE0aDhNOCAxOWgxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=&logoColor=white" alt="NoteNexa" />

# NoteNexa

### 🧠 Your Premium Second Brain — Think Clearly. Write Freely. Stay Organized.

<br/>

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)]()
[![No Backend](https://img.shields.io/badge/Backend-None-blueviolet?style=flat-square)]()

<br/>

> A **fully frontend, production-ready** notes + productivity web application built with pure HTML, CSS, and Vanilla JavaScript. No frameworks. No backend. No database. Just the web — at its finest.

<br/>

[🚀 Live Demo](https://note-nexa-three.vercel.app/) &nbsp;·&nbsp; [📖 Documentation](#) &nbsp;·&nbsp; [🐛 Report Bug](#) &nbsp;·&nbsp; [✨ Request Feature](#)

<br/>

</div>

---

## ✨ Features

- 📝 **Rich Note Editor** — Create, edit, and delete notes with titles, content, and categories
- 📌 **Pin Notes** — Pin your most important notes to always keep them at the top
- 🔍 **Instant Search** — Full-text search across titles, content, and tags in real time
- 🏷️ **Tags & Categories** — Organize notes with custom tags and categories (Work, Personal, Ideas, Other)
- 🤖 **AI Assistant (Nexa)** — Built-in smart assistant for writing suggestions and productivity tips
- 🌙 **Dark & Light Mode** — Elegant theme toggle with preference saved automatically
- 💾 **Offline First** — All data stored in browser localStorage, works 100% offline
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- ⚡ **Blazing Fast** — No frameworks, no build step, loads instantly
- 🎨 **Premium UI** — SaaS-level design with smooth animations and micro-interactions
- ⌨️ **Keyboard Shortcuts** — Power-user shortcuts for speed

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + N` | Create a new note |
| `Ctrl + K` | Focus the search bar |
| `Esc` | Close any open modal or panel |

---

## 🗂️ Project Structure

```
notenexa/
│
├── index.html        # App structure — landing page + dashboard + modals
├── style.css         # All styling — themes, animations, responsive layout
└── script.js         # All logic — CRUD, search, localStorage, AI assistant
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | App structure and semantic markup |
| **CSS3** | Styling, CSS variables, animations, responsive design |
| **Vanilla JavaScript** | All interactivity, data management, DOM manipulation |
| **localStorage API** | Persistent data storage in the browser |
| **CSS Flexbox & Grid** | Layout system for dashboard and note cards |
| **CSS Custom Properties** | Dynamic theming (dark/light mode) |
| **Google Fonts (Inter)** | Premium typography |

---

## 🚀 Getting Started

### Run Locally

No installation required. Just clone and open.

```bash
# Clone the repository
git clone https://github.com/Tahsin-banu/notenexa.git

# Navigate into the project folder
cd notenexa

# Open in your browser
open index.html
```

Or simply **double-click** `index.html` — it opens directly in your browser.

---

## ☁️ Deployment

NoteNexa is a static site — deploy anywhere in seconds.

### Deploy on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or go to [vercel.com](https://vercel.com) → New Project → Import repo → Deploy.

### Deploy on Netlify

Drag and drop your project folder at [app.netlify.com/drop](https://app.netlify.com/drop).

### Deploy on GitHub Pages

1. Push code to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch → root folder
4. Your site is live at `https://yourusername.github.io/notenexa`

---

## 💡 How It Works

### Data Flow

```
User Action
    │
    ▼
JavaScript Function (create / update / delete / search)
    │
    ▼
Updates `notes[]` array in memory
    │
    ▼
Saves to localStorage (JSON.stringify)
    │
    ▼
renderNotes() re-draws the UI
```

### Theme System

The entire theme is controlled by a single HTML attribute:

```html
<html data-theme="dark">   <!-- or "light" -->
```

CSS variables automatically switch all colors:

```css
[data-theme="dark"]  { --bg-primary: #0E0E10; --text-primary: #F4F4F5; }
[data-theme="light"] { --bg-primary: #FAFAFA; --text-primary: #111114; }
```

### Note Object Structure

```javascript
{
  id:        "uuid-generated-automatically",
  title:     "Note Title",
  content:   "Note body content...",
  category:  "work" | "personal" | "ideas" | "other",
  tags:      ["tag1", "tag2"],
  pinned:    false,
  createdAt: 1700000000000,   // Unix timestamp
  updatedAt: 1700000000000
}
```

---

## 🤖 AI Assistant (Nexa)

The built-in AI assistant uses **keyword-based response matching** — fully frontend, no API key needed.

| You Ask | Nexa Responds With |
|---|---|
| "Summarize my notes" | Summary using your real note data |
| "Give me productivity tips" | 3 actionable productivity tips |
| "Help me brainstorm ideas" | Guided brainstorming framework |
| Anything else | Smart contextual response from response pool |

---

## 🗺️ Roadmap

- [x] Create, edit, delete notes
- [x] Pin notes
- [x] Search functionality
- [x] Category & tag system
- [x] Dark / light mode
- [x] AI assistant UI
- [x] Responsive design
- [ ] Export notes as PDF / Markdown
- [ ] Rich text editor (bold, italic, lists)
- [ ] Note sharing via URL
- [ ] Real AI integration (OpenAI / Claude API)
- [ ] PWA support (installable app)
- [ ] Note history / version control

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

```
MIT License — Copyright (c) 2025 Your Name
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software.
```

---

## 🙋‍♂️ Author

**Tahsin Banu**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Tahsin-banu)
[![Portfolio](https://img.shields.io/badge/Portfolio-7C3AED?style=flat-square&logo=vercel&logoColor=white)](https://yourportfolio.com)

---

<div align="center">

**If you found this project useful, please consider giving it a ⭐ on GitHub!**

<br/>

Made with ❤️ using HTML, CSS & JavaScript — No frameworks. Just the web.

</div>
