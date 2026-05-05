## ADR 001: Modern CI/CD Blueprint & Portfolio Architecture
Status: Accepted
Date: 2024-05-22
Context: Creating a professional portfolio that functions as a live demonstration of automated QA and deployment.
## 1. Requirements

* Performance: Must achieve a 90+ Lighthouse performance score.
* Reliability: 100% type safety and 80%+ test coverage.
* Automation: Zero-manual-intervention deployment (No "drag and drop" to hosting).
* Transparency: Publicly visible audit trails for every build and deployment.

## 2. Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Vue 3.5 (Composition API) | Lightweight, high performance, and excellent TypeScript support. |
| Build Tool | Vite 6.0 | Faster HMR and superior plugin ecosystem compared to Webpack. |
| Language | TypeScript | Eliminates entire classes of runtime errors; essential for "Senior" level code. |
| State | Pinia | Modular, type-safe state management with less boilerplate than Vuex. |
| Styling | Tailwind CSS 4 | Utility-first approach ensures minimal CSS bundle size via JIT compilation. |

## 3. Key Architecture Decisions

## 3.1. Shift-Left Quality Gates (Husky)
Decision: We implement two-tier local git hooks using Husky.

* Pre-commit: Linting and Type-checking to prevent "dirty" code.
* Pre-push: Full Production Build and Lighthouse CI audit.
* Consequence: Local development time is slightly increased, but the remote CI/CD pipeline almost never fails, saving expensive runner minutes.

## 3.2. Automated Asset Pipeline (ViteImageOptimizer)
Decision: All images are processed through the Sharp engine during the build phase.

* Implementation: Convert to WebP/AVIF and minify SVGs.
* Consequence: This guarantees the 90+ Performance KPI by preventing the deployment of unoptimized, high-resolution project screenshots.

## 3.3. Deterministic CI/CD (GitHub Actions)
Decision: Use npm ci and isolated jobs for "Validate-and-Build" vs "Deploy."

* Rationale: npm ci ensures the environment exactly matches the lockfile. Separating jobs allows us to block deployment if Lighthouse or Vitest scores drop below the defined thresholds in .lighthouserc.json.

## 3.4. Code Splitting & Vendor Chunking
Decision: Manually group stable dependencies (vue, pinia, marked) into separate chunks.

* Rationale: Optimises browser caching. When the portfolio content changes, users don't need to re-download the core framework code.

## 4. Quality Thresholds (KPIs)

* Lines/Statements Coverage: ≥ 80% (Enforced by Vitest).
* Lighthouse Performance: ≥ 90% (Enforced by LHCI).
* Accessibility: ≥ 75% (Base threshold for inclusive design).

## 5. Deployment Strategy
The site is hosted on GitHub Pages under the /portfolio/ subdirectory. The Vite base configuration and GitHub Action permissions are specifically tuned to handle the OpenID Connect (OIDC) handshake for secure, passwordless deployments.