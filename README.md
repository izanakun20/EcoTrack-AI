# EcoTrack AI – AI-Powered Carbon Footprint Awareness Platform

EcoTrack AI is a next-generation, responsive, and gamified sustainability platform designed to help users track, understand, and reduce their carbon footprint through personalized AI insights, real-time calculation simulators, weekly eco-challenges, achievements, and goal setting.

## Problem Statement

Individuals often struggle to understand the environmental impact of their daily activities. EcoTrack AI helps users calculate, visualize, and reduce their carbon footprint through personalized AI recommendations, gamified challenges, and sustainability insights.

## Live Demo

https://ecotrack-ai-green.netlify.app/

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

## 🤖 Advanced Local AI Engine & Architecture

EcoTrack AI runs on a fully client-side, private, and zero-latency **Local AI Engine** ([aiService.js](file:///C:/Users/siddh/eco-track-ai/src/utils/aiService.js)):
1. **Dynamic Sustainability Insights:** Evaluates category footprint breakdowns to generate custom sustainability advices based on the user's primary emission category.
2. **Generative Reduction Plans:** Generates structured recommendations based on live calculator coefficients, detailing specific titles, descriptions, categories, priority tags, difficulty rankings, and annual carbon savings.
3. **Conversational AI Coach Chatbot:** A ChatGPT-style chat assistant that parses message contexts and carbon calculations to yield tailored, encouraging sustainability plans with natural typing animations.
4. **No API Dependencies:** Since everything is computed locally in the browser, the application requires **no internet connection**, **no API keys** (Gemini/OpenAI/HuggingFace), has **zero latency**, and guarantees **100% data privacy**.

---

## 🎨 Premium Visual Features

- **Ambient Glowing Mesh Lights:** Built using CSS-based keyframe animations shifting radial blurs in the background.
- **Vibrant Interactive Charts:** Recharts customized with gradient area charts, thin transparent grids, and custom tooltip overlays.
- **Multi-Step Calculator Simulator:** Multi-step card wizard with decrement/increment controls alongside a **Live Estimator Sidebar** that reflects inputs instantly.
- **AI Scanning Loader:** A full-screen translucent overlay simulating data calibration and index parsing when compute is triggered.
- **Upgraded Badges Milestones:** Six gamified achievement medals with lock states and progress percentages computed via state dependencies.
- **Difficulty-Rated Challenges:** Active quest cards classified into categories (`transport`, `energy`, `waste`, `food`, `community`) with difficulty settings (`Easy`, `Medium`, `Hard`) and checklist tasks.

---

## 📦 Folder Structure

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
    │   ├── calculations.js
    │   └── aiService.js
    └── data/
        └── environmentalData.js
```

---

## ⚙️ Local Setup Instructions

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
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
Create the optimized production asset bundle:
```bash
npm run build
```
The build artifact will be generated under `/dist`, ready for deployment on platforms like Netlify.

### 5. Running the Test Suite
We have configured a robust, complete testing suite using **Vitest** and **React Testing Library** to validate standard and boundary inputs, localStorage hooks, NLP coaches, and rendering:
```bash
# Run tests once (CI mode)
npm run test
```

---

## 🔒 Security & Data Integrity Safeguards

1. **Input Clamping & Validation:**
   - Values entered into the carbon calculator are programmatically validated and clamped to realistic physical boundaries in `calculations.js` (e.g., flight logs capped at 100/yr, travel distance capped at 300km/day, AC hours capped at 24/day).
   - Negative numbers and invalid string categories default back to medium mixed averages, preventing system crashes or division-by-zero errors.
2. **Defensive Storage Parsing:**
   - The custom storage hook `useLocalStorage.js` is fortified to handle parsing crashes. If corrupted data or structural modifications exist in the browser cache, it automatically clears that key and falls back to a clean initial state.
3. **No External Attack Vectors:**
   - Since all AI recommendation and NLP engines execute locally, no user footprint data or conversation logs are sent over the network, completely avoiding API interception attacks or data leaks.

---

## ♿ Accessibility (a11y) Compliance

The application has been audited and optimized to meet accessibility standards:
- **Keyboard Navigation:** All interactive navigation elements (sidebar, mobile top headers, logo routes) support full keyboard accessibility (`Tab`, `Enter`, `Space`) with noticeable `focus-visible` emerald rings.
- **Form Controls:** Every slider input is explicitly linked to its visual control via `htmlFor` and `id` properties.
- **Semantic Groupings:** Radio-like button selectors (e.g., Diet Habits, Plastic Waste) are structured inside `<fieldset>` elements with descriptive `<legend>` tags, using `aria-pressed` to define the selected state.
- **Chart Screen Reader Wrappers:** Recharts graphical dashboards are wrapped with `role="region"` and clear `aria-label` summaries explaining chart contexts to screen readers.
- **Escaped Text Rendering:** The local chatbot assistant handles text formatting via a secure markdown parser that prevents unescaped HTML render paths.

