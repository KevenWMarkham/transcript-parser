# Hostinger Deployment - Quick Checklist

## 📋 Pre-Deployment Setup (One-Time)

### 1. Add GitHub Secrets

Go to **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 3 secrets:

- [ ] `FTP_SERVER` - Your Hostinger FTP hostname (e.g., `ftp.smarthavenai.com`)
- [ ] `FTP_USERNAME` - Your Hostinger FTP username (e.g., `u123456789`)
- [ ] `FTP_PASSWORD` - Your Hostinger FTP password

**Where to get FTP credentials:**

1. Log in to Hostinger control panel
2. Go to **Files** → **FTP Accounts**
3. Find/create FTP account for your domain

---

## 🧪 Testing Deployment Locally (Before Pushing)

### Step 1: Build

```bash
npm run build:web
```

**Expected output:**

- ✓ Build completes without errors
- ✓ Creates `dist/` folder
- ✓ `dist/index.html` exists

### Step 2: Preview

```bash
npm run preview:web
```

**Expected output:**

- Serves at: `http://localhost:4173/transcript-parser/`
- [ ] App loads without errors
- [ ] Console has no critical errors
- [ ] All assets load (CSS, JS, images)
- [ ] Upload functionality works
- [ ] PWA manifest is accessible

### Step 3: Check PWA Manifest

1. Open Chrome DevTools → **Application** tab
2. Click **Manifest** in left sidebar

**Verify:**

- [ ] `scope`: `/transcript-parser/`
- [ ] `start_url`: `/transcript-parser/`
- [ ] All icons load correctly

### Step 4: Check Service Worker

1. Still in DevTools → **Application** → **Service Workers**

**Verify:**

- [ ] Service worker shows "Activated and running"
- [ ] Scope is `/transcript-parser/`
- [ ] No registration errors

---

## 🚀 Deployment

### Automatic (Recommended)

```bash
git add .
git commit -m "feat: your changes"
git push origin master
```

- [ ] Push triggers GitHub Actions automatically
- [ ] Go to **GitHub** → **Actions** tab
- [ ] Watch workflow progress (usually 2-5 minutes)
- [ ] All steps complete successfully ✓

### Manual Trigger

1. Go to **GitHub** → **Actions** tab
2. Click **Deploy to Hostinger** workflow
3. Click **Run workflow** → **Run workflow**

---

## ✅ Post-Deployment Verification

### 1. Production URL

- [ ] Visit: `https://smarthavenai.com/transcript-parser/`
- [ ] Page loads successfully
- [ ] No 404 errors on refresh

### 2. Browser Console

- [ ] Open DevTools → **Console**
- [ ] No critical errors
- [ ] No asset loading failures (404s)

### 3. PWA Features

**Desktop (Chrome):**

1. Open DevTools → **Application** → **Manifest**
   - [ ] Manifest loads correctly
   - [ ] Icons display

2. **Application** → **Service Workers**
   - [ ] Service worker active
   - [ ] Caching works

**Mobile (iOS Safari):**

1. Visit URL on iPhone/iPad
2. Tap **Share** → **Add to Home Screen**
   - [ ] Option appears
   - [ ] Icon installs
   - [ ] Opens full-screen

**Mobile (Android Chrome):**

1. Visit URL on Android
2. Tap **Menu** → **Install app**
   - [ ] Install prompt appears
   - [ ] App installs
   - [ ] Opens as standalone

### 4. Core Functionality

- [ ] Can upload video file
- [ ] API key settings work
- [ ] Login/Register flows work
- [ ] Transcript displays correctly
- [ ] Export features work
- [ ] Demo transcript loads

### 5. Offline Mode

1. Load app in browser
2. Disconnect internet
3. Refresh page
   - [ ] App still loads from cache
   - [ ] Shows cached content

---

## 🔧 Troubleshooting

### ❌ Deployment Fails in GitHub Actions

**Check:**

1. GitHub Actions logs for error message
2. Verify all 3 secrets are set correctly
3. Test FTP credentials manually
4. Ensure `/public_html/transcript-parser/` exists on Hostinger

**Fix:**

- Re-add GitHub secrets
- Create folder manually in Hostinger File Manager
- Check FTP permissions

### ❌ 404 on Page Refresh

**Problem:** Refreshing returns 404

**Fix:** Add `.htaccess` to Hostinger (via File Manager or FTP):

```apache
# public_html/transcript-parser/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /transcript-parser/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /transcript-parser/index.html [L]
</IfModule>
```

### ❌ Assets Not Loading (404 errors)

**Check:**

1. Browser Network tab for failed requests
2. Verify `vite.config.ts` has `base: '/transcript-parser/'`
3. Rebuild: `npm run build:web`
4. Redeploy

### ❌ PWA Won't Install

**Check:**

1. Must use HTTPS (check for padlock in URL)
2. Manifest must be valid (DevTools → Application → Manifest)
3. Service worker must be active
4. Try incognito mode
5. Clear cache and revisit

### ❌ Old Version Still Showing

**Fix:**

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear service worker: DevTools → Application → Service Workers → Unregister
3. Clear cache: DevTools → Application → Clear storage

---

## 📱 Mobile Testing Checklist

### iOS Safari

- [ ] Visit `https://smarthavenai.com/transcript-parser/`
- [ ] Tap Share → Add to Home Screen
- [ ] Icon appears on home screen
- [ ] Opens full-screen (no Safari UI)
- [ ] All features work
- [ ] Works offline after initial load

### Android Chrome

- [ ] Visit `https://smarthavenai.com/transcript-parser/`
- [ ] Install prompt appears OR Menu → Install app
- [ ] Icon appears on home screen
- [ ] Opens as standalone app
- [ ] All features work
- [ ] Works offline after initial load

---

## 🎯 Success Criteria

All of these should be ✓:

- [ ] GitHub secrets configured
- [ ] Local build succeeds (`npm run build:web`)
- [ ] Local preview works (`npm run preview:web`)
- [ ] GitHub Actions deployment succeeds
- [ ] Production URL loads: `https://smarthavenai.com/transcript-parser/`
- [ ] No console errors
- [ ] PWA manifest valid
- [ ] Service worker active
- [ ] Installs on iOS Safari
- [ ] Installs on Android Chrome
- [ ] Works offline
- [ ] All core features functional

---

## 📞 Quick Commands Reference

```bash
# Build for web
npm run build:web

# Preview build locally
npm run preview:web

# Development mode
npm run dev

# Build for Electron (different base path)
npm run electron:build:win
```

---

## 🔗 Important URLs

- **Production**: `https://smarthavenai.com/transcript-parser/`
- **GitHub Actions**: `https://github.com/YOUR_USERNAME/transcript-parser/actions`
- **Hostinger Panel**: `https://hpanel.hostinger.com/`

---

**All items checked?** You're ready to deploy! 🎉
