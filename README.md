# Data Systems Portfolio & Showcase

A high-performance, **Type-Safe Single Page Application (SPA)** built to showcase my professional portfolio of data science and engineering projects. This project serves as a dual-purpose artifact: a gallery of my work and a demonstration of my ability to build production-grade CI/CD pipelines, testable architectures, and optimised web experiences.

## 🏗️ System Architecture
The application follows a **State-Driven Content** pattern. Project metadata is treated as a structured data source (Schema-on-Read), ensuring the UI remains a thin, reactive layer over the technical documentation.

*   **Frontend:** Vue 3 (Composition API) + TypeScript (Strict Mode).
*   **Styling:** Tailwind CSS with Typography plugin for automated Markdown styling.
*   **Data Layer:** Asynchronous fetching of .md files and .webp animations to maintain a minimal initial bundle size.
*   **Diagramming:** Integrated **Mermaid.js** for "Architecture-as-Code" rendering within project descriptions.

## 🛠️ Engineering Rigour & CI/CD
This repository implements a professional software development lifecycle (SDLC) via **GitHub Actions**:

1.  **Validation:** Every commit is subjected to **ESLint** (Linting), **Prettier** (Formatting), and **vue-tsc** (Static Type Analysis).
2.  **Automated Testing:** Unit and component tests are executed via **Vitest**.
3.  **Optimization:** A production build is generated using **Vite**.
4.  **Performance Gate:** A **Lighthouse CI** audit is performed against the build artifact. The pipeline **fails** if Performance, Accessibility, Best Practices, or SEO scores drop below 90.
5.  **Automated Deployment:** Successful builds on the main branch are automatically deployed to **GitHub Pages**.

## 📂 Project Structure
```text
├── .github/workflows/  # CI/CD Pipeline (Validation -> Audit -> Deploy)
├── public/
│   ├── animations/     # High-res WebM/WebP visual demonstrations
│   ├── data/           # Project Markdown and Schema definitions
│   └── 404.html        # SPA Router Hack for GitHub Pages
├── src/
│   ├── types/          # TypeScript Interfaces (The Data Contract)
│   ├── components/     # Reusable logic (MarkdownView, BaseVideo)
│   └── views/          # Reactive SPA Layouts
├── .lighthouserc.json  # Performance budgets and audit thresholds
└── vite.config.ts      # Build-time image optimization & bundling logic
```

## 🚀 Local Development
Prerequisites

* Node.js 20+
* npm 10+

Setup
Install dependencies
```code
npm install
```
Start development server with HMR
```code
npm run dev
```
Run unit tests
```code
npm run test:unit
```
Run full production build & Type-check
```code
npm run build
```

## 📈 Key Performance Indicators (KPIs)

*   **Lighthouse Performance:** >90 (Optimised via code splitting).
*   **Type Coverage:** 100% of core business logic and project metadata.
*   **Responsiveness:** Fully fluid layout from mobile to 4K displays.
