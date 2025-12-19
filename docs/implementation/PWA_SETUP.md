# PWA Setup & Deployment Guide

## Overview

Transcript Parser is now configured as a Progressive Web App (PWA), enabling:

- Offline functionality
- Installable on desktop and mobile devices
- Fast loading with service worker caching
- App-like experience

## Setup Complete

✅ **vite-plugin-pwa** installed
✅ **Service Worker** configured with Workbox
✅ **Web App Manifest** configured
✅ **PWA Meta Tags** added to index.html
✅ **Caching Strategy** implemented

## Icon Generation

### Quick Setup (5 minutes)

1. Open [http://localhost:5174/generate-icons.html](http://localhost:5174/generate-icons.html) in your browser
2. Click the download buttons to get all three icons:
   - `pwa-192x192.png` (for Android/Chrome)
   - `pwa-512x512.png` (for larger displays)
   - `apple-touch-icon.png` (for iOS devices)
3. Save these files to the `public/` directory

### Alternative: Use PWA Builder

Visit [https://www.pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator) to generate professional icons from a logo.

## Testing PWA Locally

### 1. Build for Production

```bash
npm run build
```

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Test PWA Features

1. Open [http://localhost:4173](http://localhost:4173) in Chrome
2. Open DevTools (F12)
3. Go to **Application** tab
4. Check:
   - ✅ **Service Workers** - Should show active service worker
   - ✅ **Manifest** - Should show app details and icons
   - ✅ **Cache Storage** - Should show cached assets

### 4. Test Installation

1. Click the install button in the address bar (⊕ icon)
2. Or use Chrome menu → "Install Transcript Parser..."
3. The app should open in a standalone window

### 5. Test Offline Mode

1. In DevTools, go to **Network** tab
2. Check "Offline" checkbox
3. Reload the page
4. App should still work with cached data

## PWA Configuration

### Manifest Settings ([vite.config.ts](../vite.config.ts))

```typescript
manifest: {
  name: 'Transcript Parser',
  short_name: 'TranscriptParser',
  description: 'AI-powered video transcription with speaker diarization',
  theme_color: '#10b981',  // Green from your brand
  background_color: '#ffffff',
  display: 'standalone',   // App-like experience
  orientation: 'portrait',
  start_url: '/',
}
```

### Caching Strategy

**Static Assets** (Cache-First):

- JavaScript, CSS, HTML
- Images, fonts
- Cached permanently for fast loading

**Google Fonts** (Cache-First):

- 1 year expiration
- Reduces external requests

**API Calls** (Network-First):

- Gemini API requests
- 5-minute cache as fallback
- 10-second network timeout

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Follow prompts to deploy

**Why Vercel?**

- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available
- Perfect for React/Vite apps

### Option 2: Netlify (Alternative - Free)

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Why Netlify?**

- Simple deployment
- Great for static sites
- Free SSL
- Form handling
- Functions support

### Option 3: Cloudflare Pages (Advanced)

1. Push code to GitHub

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Connect repository

4. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Why Cloudflare?**

- Global edge network
- Fastest performance
- DDoS protection
- Free tier available

## Environment Variables

Create `.env.production`:

```env
VITE_GEMINI_API_KEY=your_production_key_here
```

**Important**: Add `.env.production` to `.gitignore`!

## Production Checklist

### Before Deploying

- [ ] Generate and add PWA icons to `/public`
- [ ] Set production Gemini API key
- [ ] Test production build locally (`npm run preview`)
- [ ] Run Lighthouse audit (target 90+ score)
- [ ] Test on mobile device
- [ ] Test offline functionality
- [ ] Check all features work without dev server

### After Deploying

- [ ] Verify HTTPS is enabled
- [ ] Test PWA installation on deployed URL
- [ ] Check service worker is registered
- [ ] Test on multiple browsers (Chrome, Safari, Firefox, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Monitor error tracking (add Sentry if needed)

## Lighthouse PWA Checklist

Run Lighthouse audit and ensure:

### Progressive Web App (Target: 90+)

- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Has a web app manifest
- ✅ Contains icons for add to home screen
- ✅ Configured for a custom splash screen
- ✅ Sets a theme color
- ✅ Content sized correctly for viewport
- ✅ Has a <meta name="viewport"> tag
- ✅ Provides a valid apple-touch-icon

### Performance (Target: 90+)

- ✅ First Contentful Paint < 1.8s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Total Blocking Time < 200ms
- ✅ Cumulative Layout Shift < 0.1
- ✅ Speed Index < 3.4s

## Monitoring & Analytics

### Add Sentry for Error Tracking

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
})
```

### Add Analytics (Optional)

For privacy-friendly analytics:

- **Plausible Analytics** (recommended)
- **Simple Analytics**
- **Fathom Analytics**

Avoid Google Analytics for privacy concerns.

## Troubleshooting

### Service Worker Not Updating

Clear cache and hard reload:

- Chrome: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: DevTools → Application → Service Workers → "Update on reload"

### Icons Not Showing

1. Ensure icons are in `/public` directory
2. Check `vite.config.ts` paths match filenames
3. Clear browser cache
4. Re-build: `npm run build`

### Offline Mode Not Working

1. Check Network tab in DevTools
2. Verify service worker is active
3. Check Cache Storage has assets
4. Ensure HTTPS is enabled (required for service workers)

### App Not Installable

1. Must be served over HTTPS (localhost is OK)
2. Must have valid manifest
3. Must have service worker
4. Must meet size requirements (icons 192x192 and 512x512)

## Next Steps

1. **Generate Icons**: Visit `/generate-icons.html` and download icons
2. **Test Locally**: `npm run build && npm run preview`
3. **Deploy**: Choose Vercel, Netlify, or Cloudflare Pages
4. **Monitor**: Add Sentry for production error tracking

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Chrome DevTools PWA Testing](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
