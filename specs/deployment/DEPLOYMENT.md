# Hostinger Deployment Guide

This guide covers deploying the Transcript Parser PWA to Hostinger shared hosting at `smarthavenai.com/transcript-parser/`.

## Overview

- **Deployment Method**: GitHub Actions + FTP
- **Target URL**: `https://smarthavenai.com/transcript-parser/`
- **Build Output**: `dist/` folder
- **Auto-Deploy**: Triggers on push to `master` branch

---

## 1. GitHub Secrets Setup

Before the first deployment, you need to configure these GitHub secrets:

### Required Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these three secrets:

| Secret Name    | Description            | Example Value          |
| -------------- | ---------------------- | ---------------------- |
| `FTP_SERVER`   | Hostinger FTP hostname | `ftp.smarthavenai.com` |
| `FTP_USERNAME` | Hostinger FTP username | `u123456789`           |
| `FTP_PASSWORD` | Hostinger FTP password | `your-ftp-password`    |

### How to Get FTP Credentials from Hostinger

1. Log in to Hostinger control panel
2. Go to **Files** → **FTP Accounts**
3. Find or create an FTP account for your domain
4. Note the:
   - **FTP hostname** (e.g., `ftp.smarthavenai.com`)
   - **Username** (usually something like `u123456789`)
   - **Password** (set when creating the account)

---

## 2. Deployment Workflow

### Automatic Deployment

The app deploys automatically when you push to the `master` branch:

```bash
git add .
git commit -m "feat: your changes"
git push origin master
```

### Manual Deployment

You can also trigger deployment manually:

1. Go to GitHub → **Actions** tab
2. Click **Deploy to Hostinger** workflow
3. Click **Run workflow** → **Run workflow**

### Monitoring Deployment

1. Go to GitHub → **Actions** tab
2. Click on the latest workflow run
3. View progress and logs in real-time
4. Deployment typically takes 2-5 minutes

---

## 3. Testing the Deployment Locally

Before pushing to production, test the build locally:

### Step 1: Build for Production

```bash
npm run build:web
```

This creates an optimized build in the `dist/` folder with the correct base path (`/transcript-parser/`).

### Step 2: Preview Locally

```bash
npm run preview:web
```

This serves the built files at `http://localhost:4173/transcript-parser/`

### Step 3: Test PWA Features

1. Open Chrome DevTools → **Application** tab
2. Check **Manifest** - should show correct `scope` and `start_url`
3. Check **Service Workers** - should be registered for `/transcript-parser/`
4. Test offline functionality:
   - Refresh the page
   - Turn off dev server
   - Page should still load from cache

---

## 4. Verifying PWA Installation on Mobile

### iOS (Safari)

1. Visit `https://smarthavenai.com/transcript-parser/` on iPhone/iPad
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** to confirm
5. The app icon should appear on your home screen
6. Open the app - it should run full-screen without browser UI

### Android (Chrome)

1. Visit `https://smarthavenai.com/transcript-parser/` on Android
2. Tap the **Menu** (three dots) in Chrome
3. Tap **Add to Home screen** or **Install app**
4. Tap **Install** or **Add** to confirm
5. The app icon should appear on your home screen
6. Open the app - it should run as a standalone app

### Debugging PWA Issues

If the "Add to Home Screen" option doesn't appear:

1. **Check HTTPS**: PWAs require HTTPS (Hostinger provides this automatically)
2. **Check Manifest**: Open DevTools → Application → Manifest
   - Verify `start_url` is `/transcript-parser/`
   - Verify `scope` is `/transcript-parser/`
   - Check all icons are loading correctly
3. **Check Service Worker**: Open DevTools → Application → Service Workers
   - Should show "Activated and running"
   - If not, check Console for errors
4. **Clear Cache**: Sometimes you need to clear browser cache and revisit

---

## 5. Post-Deployment Checklist

After deployment, verify these items:

- [ ] Visit `https://smarthavenai.com/transcript-parser/`
- [ ] App loads correctly (no 404s or broken assets)
- [ ] All images and icons display properly
- [ ] PWA manifest is accessible: `https://smarthavenai.com/transcript-parser/manifest.webmanifest`
- [ ] Service worker registers successfully (check DevTools → Application)
- [ ] Upload a test video file
- [ ] Verify transcription functionality works
- [ ] Test login/register flows
- [ ] Test "Add to Home Screen" on mobile device
- [ ] Test offline functionality (disconnect internet, refresh page)
- [ ] Check browser console for any errors

---

## 6. Common Troubleshooting

### 🔴 404 Errors on Refresh

**Problem**: Refreshing the page returns 404

**Solution**: Add `.htaccess` file to Hostinger:

```bash
# Add this to public_html/transcript-parser/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /transcript-parser/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /transcript-parser/index.html [L]
</IfModule>
```

You'll need to add this file manually via Hostinger File Manager or FTP.

### 🔴 Assets Not Loading (CORS/Path Issues)

**Problem**: CSS, JS, or images return 404

**Solution**:

1. Check browser DevTools → Network tab for failed requests
2. Verify `vite.config.ts` has `base: '/transcript-parser/'`
3. Rebuild: `npm run build:web`
4. Redeploy

### 🔴 Service Worker Not Updating

**Problem**: Old version still running after deployment

**Solution**:

1. Open DevTools → Application → Service Workers
2. Check **Update on reload**
3. Click **Unregister** to force re-registration
4. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### 🔴 FTP Deployment Fails

**Problem**: GitHub Action fails during FTP upload

**Solution**:

1. Verify GitHub secrets are set correctly
2. Check FTP credentials in Hostinger
3. Ensure FTP account has write permissions to `/public_html/transcript-parser/`
4. Try creating the `/transcript-parser/` folder manually in Hostinger File Manager

### 🔴 PWA Won't Install on Mobile

**Problem**: "Add to Home Screen" doesn't appear

**Solution**:

1. Must use HTTPS (check URL shows padlock)
2. Manifest must be valid - check DevTools
3. Service worker must be active
4. Try in Incognito/Private mode first
5. Clear browser cache and revisit

---

## 7. Electron Desktop App Compatibility

The project also builds as an Electron desktop app. To maintain compatibility:

### Building for Electron

```bash
# Set base path to relative for Electron
export VITE_BASE_PATH='./'  # On Windows: set VITE_BASE_PATH=./

# Build Electron app
npm run electron:build:win
```

The `vite.config.ts` checks `VITE_BASE_PATH` environment variable:

- **Production Web**: `/transcript-parser/` (default)
- **Electron**: `./` (set via env var)

---

## 8. Continuous Deployment Workflow

### Standard Development Flow

1. **Develop locally**:

   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

2. **Test build locally**:

   ```bash
   npm run build:web
   npm run preview:web
   # Visit http://localhost:4173/transcript-parser/
   ```

3. **Commit and push**:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin master
   ```

4. **Auto-deploy**: GitHub Actions builds and deploys automatically

5. **Verify**: Visit `https://smarthavenai.com/transcript-parser/`

### Hotfix Workflow

For urgent fixes:

```bash
# Make fix
git add .
git commit -m "fix: critical bug"
git push origin master

# Monitor deployment
# Go to GitHub → Actions → Watch progress
# Usually deploys in 2-5 minutes
```

---

## 9. File Structure

```
transcript-parser/
├── .github/
│   └── workflows/
│       └── deploy-hostinger.yml    # GitHub Actions deployment workflow
├── dist/                            # Build output (created by npm run build)
├── src/                             # Source code
├── vite.config.ts                   # Build config with base path
├── .ftpignore                       # Files to exclude from FTP upload
├── .env.electron                    # Electron build environment
└── DEPLOYMENT.md                    # This file
```

---

## 10. Environment Variables Reference

| Variable         | Purpose         | Development   | Production (Web)      | Electron     |
| ---------------- | --------------- | ------------- | --------------------- | ------------ |
| `VITE_BASE_PATH` | Asset base path | `/` (auto)    | `/transcript-parser/` | `./`         |
| `NODE_ENV`       | Build mode      | `development` | `production`          | `production` |

---

## 11. Support and Resources

### GitHub Actions Logs

If deployment fails, check logs:

1. Go to **GitHub** → **Actions**
2. Click on failed workflow run
3. Expand **Deploy to Hostinger via FTP** step
4. Review error messages

### Hostinger File Manager

To manually check/fix files on Hostinger:

1. Log in to Hostinger control panel
2. Go to **Files** → **File Manager**
3. Navigate to `/public_html/transcript-parser/`
4. View/edit files directly

### Testing Checklist

Before considering deployment successful:

- [ ] Production URL loads: `https://smarthavenai.com/transcript-parser/`
- [ ] No console errors in browser DevTools
- [ ] PWA installs on iOS Safari
- [ ] PWA installs on Android Chrome
- [ ] App works offline after initial load
- [ ] All core features work (upload, transcribe, export)
- [ ] Authentication flows work (login, register)
- [ ] Transcript library loads saved transcripts

---

## Quick Reference

### Build Commands

```bash
npm run build:web        # Build for web deployment
npm run preview:web      # Preview web build locally
npm run build           # Build (web by default)
npm run dev             # Development server
```

### Deployment

- **Auto**: Push to `master` branch
- **Manual**: GitHub Actions → Run workflow
- **Target**: `/public_html/transcript-parser/` on Hostinger
- **URL**: `https://smarthavenai.com/transcript-parser/`

### GitHub Secrets

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

---

**Deployment configured successfully!** 🚀

For questions or issues, check:

1. GitHub Actions logs
2. Browser DevTools → Console
3. Hostinger File Manager for deployed files
