# Sprint 9: Progressive Web App (PWA) Features

**Duration**: 2 weeks (Weeks 17-18)
**Sprint Goal**: Transform the application into a full-featured PWA with offline support, installability, and cross-platform capabilities.

---

## 🎯 Sprint Objectives

1. **Configure PWA with Vite PWA plugin** for automatic service worker generation
2. **Create web app manifest** with icons and metadata
3. **Implement offline support** with intelligent caching strategies
4. **Enable app installation** on Windows, Mac, iOS, and Android
5. **Add update notifications** for new app versions
6. **Optimize for performance** (Lighthouse score 90+)

---

## 📋 User Stories

### Story 1: Install App on Device

**As a** user
**I want** to install the app on my device like a native app
**So that** I can access it easily without opening a browser

**Acceptance Criteria**:

- ✅ Install button appears in browser (Chrome, Edge, Safari)
- ✅ App icon appears on desktop/home screen
- ✅ App opens in standalone window (no browser UI)
- ✅ App has splash screen during launch
- ✅ Works on Windows, Mac, iOS 16.4+, Android

### Story 2: Work Offline After First Load

**As a** user
**I want** the app to work offline after I've loaded it once
**So that** I can use the UI even without internet connection

**Acceptance Criteria**:

- ✅ App shell loads offline (HTML, CSS, JS)
- ✅ Previously viewed transcripts accessible offline
- ✅ Graceful error messages when trying to transcribe offline
- ✅ Automatic sync when connection restored

### Story 3: Get Notified of Updates

**As a** user
**I want** to know when a new version is available
**So that** I can update to get new features and bug fixes

**Acceptance Criteria**:

- ✅ Banner shows when new version available
- ✅ "Update" button refreshes to new version
- ✅ Updates happen automatically in background
- ✅ No data loss during updates

---

## 🛠️ Technical Tasks

### Task 9.1: Install and Configure Vite PWA Plugin

**Estimated Effort**: 2 hours

#### 1. Install Dependencies

```bash
npm install vite-plugin-pwa workbox-window --save-dev
```

#### 2. Update vite.config.ts

**File: `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],

      manifest: {
        name: 'Transcript Parser - AI Video & Audio Transcription',
        short_name: 'Transcript Parser',
        description:
          'AI-powered video and audio transcription with speaker diarization using Google Gemini',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],

        categories: ['productivity', 'utilities', 'business'],

        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop view of transcript editor',
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile view of transcript viewer',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        runtimeCaching: [
          // Cache Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Cache CDN assets (FFmpeg.wasm, etc)
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Cache API responses (transcripts)
          {
            urlPattern: /^http:\/\/localhost:3000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],

        // Clean up old caches
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
        type: 'module',
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Acceptance Criteria**:

- ✅ Vite PWA plugin configured
- ✅ Service worker auto-generated
- ✅ Manifest configured with all metadata
- ✅ Dev mode PWA enabled for testing

---

### Task 9.2: Create App Icons

**Estimated Effort**: 1 hour

#### Generate Icons from Logo

**Use PWA Asset Generator:**

```bash
npx @vite-pwa/assets-generator --preset minimal public/logo.svg
```

**Or use online tools:**

- [Real Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)

**Required sizes:**

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Save to:** `public/icons/`

**Acceptance Criteria**:

- ✅ All icon sizes generated
- ✅ Icons placed in `public/icons/`
- ✅ Icons referenced in manifest
- ✅ Apple touch icon included

---

### Task 9.3: Update index.html with PWA Meta Tags

**Estimated Effort**: 30 minutes

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <meta
      name="description"
      content="AI-powered video and audio transcription with speaker diarization using Google Gemini. Works offline. Install on Windows, Mac, iOS, Android."
    />
    <meta
      name="keywords"
      content="transcription, AI, video, audio, Gemini, speaker diarization, offline, PWA"
    />
    <meta name="author" content="Transcript Parser" />

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="Transcript Parser" />

    <!-- iOS Splash Screens (optional) -->
    <link
      rel="apple-touch-startup-image"
      href="/splash/iphone5.png"
      media="(device-width: 320px) and (device-height: 568px)"
    />
    <link
      rel="apple-touch-startup-image"
      href="/splash/iphone6.png"
      media="(device-width: 375px) and (device-height: 667px)"
    />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />

    <!-- Favicons -->
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/icons/icon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/icons/icon-16x16.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/icons/icon-180x180.png"
    />

    <title>Transcript Parser - AI Video & Audio Transcription</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Acceptance Criteria**:

- ✅ All PWA meta tags added
- ✅ iOS-specific tags included
- ✅ Manifest linked
- ✅ Favicons referenced

---

### Task 9.4: Implement Update Notification

**Estimated Effort**: 2 hours

**File: `src/components/UpdateNotification.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'

export function UpdateNotification() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <Card className="fixed bottom-4 right-4 p-4 shadow-xl z-50 max-w-sm">
      {offlineReady && (
        <div className="space-y-2">
          <p className="font-semibold">App ready to work offline</p>
          <p className="text-sm text-muted-foreground">
            The app has been cached and will work offline
          </p>
          <Button variant="outline" size="sm" onClick={close}>
            Got it
          </Button>
        </div>
      )}

      {needRefresh && (
        <div className="space-y-2">
          <p className="font-semibold">New version available</p>
          <p className="text-sm text-muted-foreground">
            Click update to get the latest features and bug fixes
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => updateServiceWorker(true)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Update
            </Button>
            <Button variant="outline" size="sm" onClick={close}>
              Later
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
```

**Add to App.tsx:**

```typescript
import { UpdateNotification } from '@/components/UpdateNotification'

function App() {
  return (
    <>
      {/* Existing app content */}
      <UpdateNotification />
    </>
  )
}
```

**Acceptance Criteria**:

- ✅ Notification shows when new version available
- ✅ "Update" button reloads with new version
- ✅ "Later" button dismisses notification
- ✅ Offline ready notification shows on first load

---

### Task 9.5: Add Install Prompt Component

**Estimated Effort**: 2 hours

**File: `src/components/InstallPrompt.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    console.log(`User ${outcome} the install prompt`)

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember dismissal
    localStorage.setItem('installPromptDismissed', 'true')
  }

  // Don't show if previously dismissed
  if (localStorage.getItem('installPromptDismissed') === 'true') {
    return null
  }

  if (!showPrompt) return null

  return (
    <Card className="fixed top-4 right-4 p-4 shadow-xl z-50 max-w-sm">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">Install Transcript Parser</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Install this app for quick access and offline use
      </p>

      <Button onClick={handleInstall} className="w-full flex items-center gap-2">
        <Download className="w-4 h-4" />
        Install App
      </Button>
    </Card>
  )
}
```

**Acceptance Criteria**:

- ✅ Install prompt shows when app is installable
- ✅ "Install" button triggers native install dialog
- ✅ Prompt can be dismissed
- ✅ Dismissal remembered in localStorage

---

### Task 9.6: Offline Fallback Page

**Estimated Effort**: 1 hour

**File: `public/offline.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offline - Transcript Parser</title>
    <style>
      body {
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .container {
        text-align: center;
        padding: 2rem;
      }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      p {
        font-size: 1.25rem;
        opacity: 0.9;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>You're Offline</h1>
      <p>Please check your internet connection to use Transcript Parser.</p>
    </div>
  </body>
</html>
```

**Acceptance Criteria**:

- ✅ Offline fallback page created
- ✅ Shows when user is offline
- ✅ Matches app branding
- ✅ Clear messaging

---

### Task 9.7: Testing PWA Features

**Estimated Effort**: 4 hours

#### Test on All Platforms

**Windows 10/11 (Edge/Chrome)**

- ✅ Install from address bar
- ✅ App icon on desktop
- ✅ Opens in standalone window
- ✅ Works offline

**macOS (Safari/Chrome)**

- ✅ Install from browser menu
- ✅ App icon in Dock
- ✅ Standalone window
- ✅ Offline functionality

**iOS 16.4+ (Safari)**

- ✅ Add to Home Screen
- ✅ App icon on home screen
- ✅ Full-screen mode
- ✅ Push notifications (optional)

**Android (Chrome)**

- ✅ Install banner shows
- ✅ WebAPK installed
- ✅ App drawer icon
- ✅ Offline support

#### Lighthouse PWA Audit

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:5173
```

**Target Scores:**

- ✅ PWA: 100
- ✅ Performance: 90+
- ✅ Accessibility: 95+
- ✅ Best Practices: 95+
- ✅ SEO: 90+

**Acceptance Criteria**:

- ✅ All platforms tested
- ✅ Lighthouse PWA score = 100
- ✅ Install works on all platforms
- ✅ Offline mode functional

---

## 📚 Documentation

### Create PWA Documentation

**File: `Specs/pwa/PWA_USER_GUIDE.md`**

Content:

- How to install on Windows
- How to install on Mac
- How to install on iOS
- How to install on Android
- Offline functionality explained
- Update process
- Uninstall instructions

**Acceptance Criteria**:

- ✅ User guide complete
- ✅ Screenshots included
- ✅ All platforms documented

---

## ✅ Definition of Done

- ✅ Vite PWA plugin configured and working
- ✅ Web app manifest created with all metadata
- ✅ All app icons generated (16x16 to 512x512)
- ✅ Service worker caching strategies implemented
- ✅ Update notification component working
- ✅ Install prompt component working
- ✅ Offline fallback page created
- ✅ Tested on Windows, Mac, iOS, Android
- ✅ Lighthouse PWA score = 100
- ✅ Documentation complete
- ✅ Code reviewed and merged

---

## 🎬 Sprint Demo (15 minutes)

**Demo Script:**

1. **Desktop Installation (Windows/Mac)**
   - Show install button in browser
   - Click install → App opens in standalone window
   - Show app icon on desktop/dock

2. **Mobile Installation (iOS/Android)**
   - Open on phone browser
   - Add to Home Screen
   - Show app icon with other apps
   - Open full-screen

3. **Offline Functionality**
   - Turn off WiFi
   - Refresh app → App loads from cache
   - Try to transcribe → Graceful error message
   - Turn WiFi back on → Auto-sync

4. **Update Notification**
   - Trigger new deployment
   - Show update banner
   - Click "Update" → New version loads

5. **Lighthouse Audit**
   - Run Lighthouse
   - Show PWA score = 100
   - Show performance metrics

---

## 🚀 Deployment

### Production Build with PWA

```bash
# Build with PWA features
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel deploy --prod
```

**Acceptance Criteria**:

- ✅ Service worker generated in build
- ✅ Manifest included in build
- ✅ All icons copied to dist
- ✅ PWA works in production

---

## 📊 Success Metrics

- ✅ **Install rate:** >20% of visitors install the app
- ✅ **Offline usage:** >10% of sessions happen offline
- ✅ **Update adoption:** >90% users on latest version within 24 hours
- ✅ **Lighthouse PWA:** 100/100
- ✅ **User satisfaction:** Positive feedback on app-like experience

---

**Sprint 9 PWA Plan Version**: 1.0
**Created**: 2025-12-17
**Focus**: Progressive Web App transformation for cross-platform support
