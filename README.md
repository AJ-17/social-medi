# SocialPulse — Social Media Dashboard

A responsive Social Media Dashboard built with **HTML, CSS, and Vanilla JavaScript** — no frameworks, no dependencies (except Font Awesome via CDN).

## 🚀 Features

- **Overview Page** — Live stat cards (Instagram, X/Twitter, YouTube, LinkedIn) with animated counters, engagement line charts, growth trend charts, and quick engagement stats
- **Followers Page** — Audience demographics donut chart, age distribution bar chart, top locations with visual bars, and active hours horizontal chart
- **Scheduled Posts** — View, add, and delete scheduled posts with a modal form
- **Top Content** — Filter top-performing content by platform
- **Theme Switcher** — Dark / Light mode toggle
- **Period Selector** — Switch charts between Last 7 / 30 / 90 Days
- **Responsive Design** — Mobile-friendly with collapsible sidebar
- **Export** — Download dashboard data as JSON

## 🗂️ Folder Structure

```
social-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js      ← mock data
│   ├── charts.js    ← canvas-based chart rendering
│   └── app.js       ← interactivity & DOM logic
└── README.md
```

## 🛠️ How to Run

1. Clone or download the repository
2. Open `index.html` directly in any modern browser — **no server required**
3. Or deploy via GitHub Pages (see below)

## 🌐 Deployment (GitHub Pages)

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set Source: `Branch: main`, Folder: `/ (root)`
4. Click **Save** — your live link will appear shortly

## 🔗 Live Demo

> _Add your GitHub Pages link here after deployment_

## 🧰 Technologies Used

- HTML5 (semantic markup)
- CSS3 (CSS variables, Grid, Flexbox, animations)
- Vanilla JavaScript (Canvas API for charts, DOM manipulation)
- Font Awesome 6 (icons via CDN)
- Google Fonts — Syne + DM Mono
