# PWA Deployment Guide - Transcript Parser

**Date:** 2025-12-17
**Purpose:** Complete guide for deploying transcript parser as a Progressive Web App (PWA)
**Target Platforms:** Web server, cloud hosting, CDN

---

## Table of Contents

1. [What is a PWA?](#what-is-a-pwa)
2. [PWA Requirements](#pwa-requirements)
3. [Setting Up PWA Features](#setting-up-pwa-features)
4. [Building for Production](#building-for-production)
5. [Deployment Options](#deployment-options)
6. [Server Configuration](#server-configuration)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment Testing](#post-deployment-testing)

---

## What is a PWA?

A **Progressive Web App** is a web application that:

- ✅ Works offline (Service Worker)
- ✅ Can be installed on devices (Web App Manifest)
- ✅ Looks and feels like a native app
- ✅ Sends push notifications (optional)
- ✅ Works on all devices (responsive)

**Benefits for Transcript Parser:**

- Users can install the app on desktop/mobile
- Works offline after first load (except AI transcription, which needs internet)
- Fast loading with caching
- App-like experience

---

## PWA Requirements

### 1. HTTPS (Required)

**PWAs MUST be served over HTTPS** (except localhost for development)

- ✅ Let's Encrypt (free SSL)
- ✅ Cloudflare (free SSL + CDN)
- ✅ Cloud hosting (AWS, Vercel, Netlify) includes SSL

### 2. Web App Manifest (manifest.json)

**Defines app metadata** (name, icons, colors, display mode)

### 3. Service Worker

**Enables offline functionality** and caching

### 4. Responsive Design

**Works on all screen sizes** (mobile, tablet, desktop)

---

## Setting Up PWA Features

### Step 1: Install Vite PWA Plugin

```bash
npm install vite-plugin-pwa workbox-window --save-dev
```

### Step 2: Create Web App Manifest

**File: `public/manifest.json`**

```json
{
  "name": "Transcript Parser - AI Video & Audio Transcription",
  "short_name": "Transcript Parser",
  "description": "AI-powered video and audio transcription with speaker diarization using Google Gemini",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8b5cf6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "utilities", "business"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Upload Audio",
      "short_name": "Upload",
      "description": "Upload an audio file for transcription",
      "url": "/?action=upload",
      "icons": [
        {
          "src": "/icons/upload-96x96.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

### Step 3: Configure Vite PWA Plugin

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
          'AI-powered video and audio transcription with speaker diarization',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
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
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unpkg-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
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

### Step 4: Update index.html

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- PWA Meta Tags -->
    <meta
      name="description"
      content="AI-powered video and audio transcription with speaker diarization using Google Gemini"
    />
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="Transcript Parser" />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />

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

### Step 5: Register Service Worker

**File: `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 6: Create App Icons

**Generate icons using a tool like:**

- [PWA Asset Generator](https://www.pwabuilder.com/)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- Or create manually with design tool

**Required icon sizes:**

- 16x16 (favicon)
- 32x32 (favicon)
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 180x180 (Apple touch icon)
- 192x192
- 384x384
- 512x512

**Save all icons to: `public/icons/`**

---

## Building for Production

### Step 1: Set Environment Variables

**File: `.env.production`**

```env
VITE_GEMINI_API_KEY=your_production_gemini_api_key_here
VITE_APP_NAME=Transcript Parser
VITE_APP_URL=https://yourdomain.com
```

**⚠️ Security Note:**

- API keys in `.env.production` are embedded in the client bundle
- They are visible to users in browser DevTools
- Use Gemini API key restrictions:
  - Restrict to your domain (e.g., `yourdomain.com`)
  - Set usage quotas
  - Monitor usage in Google Cloud Console

### Step 2: Build the Application

```bash
# Install dependencies
npm install

# Run production build
npm run build
```

**Output:**

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── icons/
│   └── icon-*.png
├── index.html
├── manifest.json
└── sw.js (service worker)
```

### Step 3: Test Production Build Locally

```bash
# Preview production build
npm run preview
```

Visit `http://localhost:4173` to test.

**Check PWA features:**

1. Open DevTools → Application → Manifest
2. Verify manifest loads correctly
3. Check Service Worker is registered
4. Test offline mode (DevTools → Network → Offline)

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**

- ✅ Free tier (generous)
- ✅ Automatic HTTPS
- ✅ Git integration (auto-deploy on push)
- ✅ Global CDN
- ✅ Environment variables support
- ✅ Zero configuration for Vite apps

#### Deployment Steps:

**1. Install Vercel CLI**

```bash
npm install -g vercel
```

**2. Login to Vercel**

```bash
vercel login
```

**3. Deploy**

```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? transcript-parser
# - Directory? ./
# - Override settings? No
```

**4. Set Environment Variables**

```bash
# Add Gemini API key
vercel env add VITE_GEMINI_API_KEY production
# Paste your API key when prompted
```

**5. Redeploy with Environment Variables**

```bash
vercel --prod
```

**Your app is now live at:** `https://transcript-parser.vercel.app`

#### Auto-Deploy from Git

**1. Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/transcript-parser.git
git push -u origin main
```

**2. Connect to Vercel:**

- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click "Import Project"
- Select your GitHub repository
- Add environment variables in dashboard
- Deploy

**Auto-deployment:** Every push to `main` triggers automatic deployment.

---

### Option 2: Netlify (Great Alternative)

**Why Netlify?**

- ✅ Free tier
- ✅ Automatic HTTPS
- ✅ Git integration
- ✅ Global CDN
- ✅ Forms and serverless functions (if needed later)

#### Deployment Steps:

**1. Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**2. Login to Netlify**

```bash
netlify login
```

**3. Initialize and Deploy**

```bash
# Initialize Netlify
netlify init

# Build and deploy
netlify deploy --prod
```

**4. Create `netlify.toml` Config**

**File: `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

**5. Set Environment Variables**

- Go to Netlify dashboard
- Site settings → Environment variables
- Add `VITE_GEMINI_API_KEY`

---

### Option 3: GitHub Pages (Free Static Hosting)

**Why GitHub Pages?**

- ✅ Completely free
- ✅ Simple deployment
- ❌ No environment variables (API key exposed)
- ❌ HTTPS only on `github.io` subdomain

#### Deployment Steps:

**1. Install gh-pages**

```bash
npm install --save-dev gh-pages
```

**2. Update `package.json`**

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/transcript-parser"
}
```

**3. Update `vite.config.ts`**

```typescript
export default defineConfig({
  base: '/transcript-parser/', // Match your repo name
  // ... rest of config
})
```

**4. Deploy**

```bash
npm run deploy
```

**Your app is now live at:** `https://yourusername.github.io/transcript-parser/`

**⚠️ Limitation:** API key must be hardcoded (security risk). Use domain restrictions.

---

### Option 4: Traditional Web Server (VPS/Shared Hosting)

**For:** Apache, Nginx, or traditional hosting

#### Step 1: Build Application

```bash
npm run build
```

#### Step 2: Upload `dist/` Contents

**Via FTP/SFTP:**

```
Upload all files from dist/ to:
/var/www/html/transcript-parser/
```

**Or via SSH:**

```bash
scp -r dist/* user@yourserver.com:/var/www/html/transcript-parser/
```

#### Step 3: Configure Web Server

**Apache (.htaccess):**

**File: `dist/.htaccess`**

```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA routing - redirect all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "no-referrer-when-downgrade"

# Cache static assets
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Cache service worker (but allow updates)
<FilesMatch "sw.js$">
  Header set Cache-Control "max-age=0, must-revalidate"
</FilesMatch>
```

**Nginx:**

**File: `/etc/nginx/sites-available/transcript-parser`**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /var/www/html/transcript-parser;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker - no cache
    location = /sw.js {
        add_header Cache-Control "max-age=0, must-revalidate";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
}
```

#### Step 4: Enable HTTPS (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs automatically)
sudo certbot renew --dry-run
```

---

### Option 5: Docker Container

**For:** Containerized deployment

**File: `Dockerfile`**

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**File: `nginx.conf`**

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run:**

```bash
# Build Docker image
docker build -t transcript-parser .

# Run container
docker run -d -p 80:80 --name transcript-parser transcript-parser

# Or with environment variables
docker run -d -p 80:80 \
  -e VITE_GEMINI_API_KEY=your_key \
  --name transcript-parser \
  transcript-parser
```

---

## Environment Variables

### Development (.env.local)

```env
VITE_GEMINI_API_KEY=your_dev_api_key
```

### Production

**Vercel/Netlify:**

- Set via dashboard UI
- Or CLI: `vercel env add`

**GitHub Pages:**

- No environment variable support
- API key must be in code (use domain restrictions!)

**Traditional Server:**

- Create `.env.production` file
- Ensure it's NOT uploaded to server
- API key gets embedded in build

### Security Best Practices

1. **API Key Restrictions (Google Cloud Console):**

   ```
   Application restrictions:
   - HTTP referrers
   - Add: yourdomain.com/*
   ```

2. **Rate Limiting:**

   ```
   Set daily quota limit in Google Cloud Console
   ```

3. **Monitor Usage:**
   ```
   Set up billing alerts
   Track API usage daily
   ```

---

## Post-Deployment Testing

### 1. PWA Installation Test

**Desktop (Chrome):**

1. Visit your deployed URL
2. Look for install icon in address bar
3. Click install
4. Verify app opens in standalone window

**Mobile (Android):**

1. Visit URL in Chrome
2. Tap "Add to Home Screen"
3. Verify app installs and opens

### 2. Lighthouse PWA Audit

1. Open DevTools → Lighthouse
2. Select "Progressive Web App"
3. Click "Analyze page load"
4. Aim for 100% PWA score

**Key metrics:**

- ✅ Installable
- ✅ Works offline
- ✅ Fast load time
- ✅ HTTPS
- ✅ Responsive

### 3. Offline Functionality Test

1. Open app
2. DevTools → Network → Offline
3. Refresh page
4. Verify app loads (UI works offline)
5. Try uploading file (should show "No internet" error gracefully)

### 4. Cross-Browser Testing

Test on:

- ✅ Chrome/Edge (desktop + mobile)
- ✅ Firefox (desktop + mobile)
- ✅ Safari (desktop + mobile)

### 5. Performance Testing

```bash
# Using Lighthouse CI
npm install -g @lhci/cli

lhci autorun --collect.url=https://yourdomain.com
```

**Target scores:**

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: 100

---

## Domain Setup (Optional)

### Use Custom Domain

**1. Purchase domain** (Namecheap, Google Domains, etc.)

**2. Configure DNS:**

**For Vercel:**

```
Add CNAME record:
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**

```
Add CNAME record:
Name: www
Value: [your-site].netlify.app
```

**3. Add domain in hosting dashboard**

**4. Wait for SSL certificate** (automatic, ~5-60 minutes)

---

## Deployment Checklist

**Before Deployment:**

- [ ] PWA manifest configured
- [ ] Service worker registered
- [ ] All icons generated (16x16 to 512x512)
- [ ] Environment variables set
- [ ] API key restrictions configured
- [ ] Production build tested locally
- [ ] HTTPS configured

**After Deployment:**

- [ ] PWA installable on desktop
- [ ] PWA installable on mobile
- [ ] Lighthouse score: PWA 100%
- [ ] Offline mode works
- [ ] Cross-browser tested
- [ ] Custom domain configured (if applicable)
- [ ] Analytics setup (optional)

---

## Recommended Deployment Path

**For MVP/Testing:** Vercel

- Fastest setup (5 minutes)
- Free tier sufficient
- Automatic HTTPS + CDN

**For Production:** Vercel or Netlify

- Both excellent for static PWAs
- Free tier handles thousands of users
- Upgrade if needed

**For Enterprise:** VPS + Docker + Nginx

- Full control
- Custom scaling
- Integration with existing infrastructure

---

## Next Steps After Deployment

1. **Analytics** - Add Google Analytics or Plausible
2. **Error tracking** - Add Sentry for error monitoring
3. **User feedback** - Add feedback form
4. **Updates** - Notify users of new versions
5. **Backup** - Regular database backups (when DB added)

---

## Support Resources

- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
