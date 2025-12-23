/**
 * Application Version Information
 *
 * This file is the single source of truth for version information.
 * Update APP_VERSION when releasing new versions.
 *
 * Version format: MAJOR.MINOR.PATCH[-label]
 * - MAJOR: Breaking changes
 * - MINOR: New features (backward compatible)
 * - PATCH: Bug fixes
 * - label: Optional (alpha, beta, rc, vps, etc.)
 */

// Version from package.json should be the source of truth
// This is set during build or can be manually updated
export const APP_VERSION = '1.1.0'

// Build metadata - updated during CI/CD or manually before deploy
export const BUILD_INFO = {
  date: '2024-12-23',
  time: new Date().toISOString().split('T')[1].split('.')[0],
  environment: import.meta.env.MODE || 'development',
  branch: 'master',
  commit: 'local', // Set by CI/CD: git rev-parse --short HEAD
}

// Feature flags for this version
export const FEATURES = {
  ffmpegMode: 'server-side',
  audioServer: true,
  multiLLM: true,
  transcriptExport: true,
}

// Full version string for display
export const getFullVersion = (): string => {
  const env =
    BUILD_INFO.environment !== 'production' ? `-${BUILD_INFO.environment}` : ''
  return `v${APP_VERSION}${env}`
}

// Detailed version info for debugging
export const getVersionInfo = () => ({
  version: APP_VERSION,
  fullVersion: getFullVersion(),
  build: BUILD_INFO,
  features: FEATURES,
})

// Console banner on app start
export const logVersionBanner = () => {
  console.log(
    `%c SmartHaven Transcript Parser %c ${getFullVersion()} %c`,
    'background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #22c55e; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    ''
  )
  console.log(`Build: ${BUILD_INFO.date} | Env: ${BUILD_INFO.environment}`)
}
