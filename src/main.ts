import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Global Styles (Tailwind + Custom scrollbars)
import './assets/main.css';

/**
 * Senior Portfolio Bootstrapper
 * Designed for high Performance (Lighthouse) and Type Safety.
 */
const startApp = async () => {
  const app = createApp(App);

  // 1. State & Routing
  app.use(createPinia());
  app.use(router);

  // 2. Resilience: Global Error Boundary
  // Crucial for data-driven apps to prevent a single malformed JSON from crashing the UI
  app.config.errorHandler = (err, _instance, info) => {
    console.error('Portfolio Runtime Exception:', { err, info });
    // In a production app, you'd send this to an observability tool like Sentry
  };

  // 3. Performance: Wait for router to be ready before mounting
  // This prevents 'hydration mismatch' and ensures SEO/Lighthouse scores are optimal
  await router.isReady();
  
  app.mount('#app');
};

startApp();