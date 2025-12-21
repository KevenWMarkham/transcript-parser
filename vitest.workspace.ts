import { defineWorkspace } from 'vitest/config'

/**
 * Vitest workspace configuration for monorepo
 *
 * This configuration enables running tests across all packages
 * with a single command: pnpm test
 *
 * Each package can have its own vitest.config.ts with package-specific settings
 */
export default defineWorkspace([
  // Main application
  './vitest.config.ts',

  // Packages
  './packages/*/vitest.config.ts',

  // Modules
  './modules/*/vitest.config.ts',
])
