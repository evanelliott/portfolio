import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

/**
 * Senior Portfolio Vitest Configuration
 * Optimized for fast unit/schema testing while excluding E2E suites.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Simulates browser environment for Vue component testing
      environment: 'jsdom',
      
      // Enables 'describe', 'it', 'expect' globally without imports
      globals: true,
      
      // Defines the root for test discovery
      root: fileURLToPath(new URL('./', import.meta.url)),
    
      // Automatically calls vi.restoreAllMocks() before each test
      restoreMocks: true,

      // Exclude E2E tests and standard non-test directories
      exclude: [
        ...configDefaults.exclude,
        '**/tests/e2e/**',
        '**/node_modules/**',
        '**/dist/**'
      ],

      // Code Coverage thresholds for Senior-level accountability
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          ...configDefaults.exclude,
          '**/tests/**',
          'src/main.ts',
          '**/*.d.ts'
        ],
        // Fail build if coverage drops (Data Integrity mindset)
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 70,
          statements: 80
        }
      }
    }
  })
)
