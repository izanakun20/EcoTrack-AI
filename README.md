# EcoTrack AI - AI-Powered Carbon Footprint Awareness Platform

EcoTrack AI is a modern, responsive, and gamified web application designed to help users track, understand, and reduce their carbon footprint through personalized AI insights, weekly eco-challenges, achievements, and goal setting.

## Problem Statement

Individuals often struggle to understand the environmental impact of their daily activities. EcoTrack AI helps users calculate, visualize, and reduce their carbon footprint through personalized AI recommendations, gamified challenges, and sustainability insights.

## Key Features

1. **Carbon Footprint Calculator:** Tabbed, interactive slider-based calculator covering Transportation (car, bike, transit, flights), Energy (electricity, AC), and Diet & Lifestyle habits.
2. **Interactive Dashboard:** Beautiful stats and charts (using Recharts) representing monthly emissions, annual footprint comparison benchmarks, and carbon progression trends.
3. **AI Eco Coach:** Dynamic sustainability advisor suggesting 8-10 customized goals tailored specifically to the user's footprint results. Features an interactive local chat assistant.
4. **Weekly Eco Challenges:** Gamified quest checklist with various points allocated per difficulty to maintain habits.
5. **Achievements & Badges:** Unlockable vector medals corresponding to goals reached and points acquired.
6. **Carbon Reduction Goals:** Sliders to set targets, tracking estimated tons CO₂ saved and tropical trees equivalent offset.
7. **Insights & Tips:** Carousel featuring environmental statistics and actionable facts.

## Tech Stack

- **Core:** React (Vite template)
- **Styling:** Tailwind CSS (utility-first styling & custom glassmorphism)
- **Graphics & Icons:** Lucide React
- **Data Visualization:** Recharts (responsive pie, bar, area charts)
- **State Management:** Custom React hooks synced with browser `localStorage`

---

## Folder Structure

```
ecotrack-ai/
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── index.html
├── README.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── components/
    │   ├── Layout.jsx
    │   ├── LandingPage.jsx
    │   ├── Dashboard.jsx
    │   ├── Calculator.jsx
    │   ├── AICoach.jsx
    │   ├── Challenges.jsx
    │   ├── Achievements.jsx
    │   ├── Goals.jsx
    │   ├── Insights.jsx
    │   └── Profile.jsx
    ├── hooks/
    │   └── useLocalStorage.js
    ├── utils/
    │   └── calculations.js
    └── data/
        ├── environmentalData.js
        └── defaultState.js
```

---

## Getting Started

Follow these steps to run the application on your local machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16.0 or higher recommended).

### 1. Open Project Folder
In your terminal, navigate to the project directory:
```bash
# Recommended active workspace path
git clone https://github.com/izanakun20/EcoTrack-AI.git
cd EcoTrack-AI
```

### 2. Install Dependencies
Download npm packages:
```bash
npm install
```

### 3. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```
Once started, open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
Create the production bundle:
```bash
npm run build
```
This scaffolds the optimized production asset bundle under the `/dist` directory, ready to deploy directly on static hosting providers like Netlify or Vercel.
