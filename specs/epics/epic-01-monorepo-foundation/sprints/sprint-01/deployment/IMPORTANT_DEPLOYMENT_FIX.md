# IMPORTANT: Deployment Fix Required

## Current Issue on Production

Your app at **https://smarthavenai.com/transcript-parser/** is showing:
```
Processing failed
Failed to load FFmpeg: ffmpeg.wasm does not support nodejs
```

## Root Cause

The current deployment has TWO issues:

1. **Old code without FFmpeg fix** - The Docker build failed because FFmpeg.wasm was being bundled during Node.js builds
2. **Wrong base path** - App was built with `base: '/transcript-parser/'` but needs to be at root `/` for proper asset loading

## What Was Fixed

### Fix #1: FFmpeg Docker Build
- ✅ Added `--external @ffmpeg/ffmpeg --external @ffmpeg/util` to tsup build
- ✅ This prevents FFmpeg.wasm from being bundled during Docker build
- ✅ FFmpeg.wasm now only loads in the browser where it belongs

### Fix #2: Base Path
- ✅ Rebuilt with `VITE_BASE_PATH=/` for root domain deployment
- ✅ All assets now load from correct paths
- ✅ FFmpeg WASM files accessible at proper URLs

## New Deployment Package

**File**: `transcript-parser-root-deployment.tar.gz` (13 MB)

**What's included**:
- ✅ Fixed FFmpeg build configuration
- ✅ Built for root domain (/)
- ✅ All Docker files
- ✅ Complete deployment documentation
- ✅ Environment templates

## Deploy Instructions

### Quick Deploy (15 minutes)

1. **Upload new package**:
   ```bash
   scp transcript-parser-root-deployment.tar.gz root@72.62.86.210:/tmp/
   ```

2. **SSH to server**:
   ```bash
   ssh root@72.62.86.210
   ```

3. **Stop current containers**:
   ```bash
   cd /var/www/smarthaven
   docker compose down
   ```

4. **Backup old deployment** (optional):
   ```bash
   mv /var/www/smarthaven /var/www/smarthaven-backup-$(date +%Y%m%d)
   ```

5. **Extract new deployment**:
   ```bash
   mkdir -p /var/www/smarthaven
   cd /var/www/smarthaven
   tar -xzf /tmp/transcript-parser-root-deployment.tar.gz
   ```

6. **Copy environment file**:
   ```bash
   # If you had a .env.production before, copy it
   cp /var/www/smarthaven-backup-*/.env.production .env.production

   # Otherwise create new one
   cp specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/.env.production.example .env.production
   nano .env.production  # Edit with your values
   ```

7. **Build and start**:
   ```bash
   docker compose up -d --build
   ```

8. **Check status**:
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

9. **Test the app**:
   - Visit: https://smarthavenai.com
   - Upload a video
   - FFmpeg should load and process successfully

## Verification Steps

After deployment, verify:

1. **App loads**: Visit https://smarthavenai.com
2. **Upload works**: Try uploading a video
3. **FFmpeg loads**: Check browser console for FFmpeg loading messages
4. **Processing works**: Video should process without errors

## If Still Having Issues

### Check Docker logs:
```bash
docker compose logs app
docker compose logs nginx
```

### Check if FFmpeg files are accessible:
```bash
# From browser, check these URLs:
https://smarthavenai.com/ffmpeg-core.js
https://smarthavenai.com/ffmpeg-core.wasm
```

### Restart services:
```bash
docker compose restart app
docker compose restart nginx
```

## DNS Configuration

Before deploying, ensure DNS is configured:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 72.62.86.210 | 3600 |
| A | www | 72.62.86.210 | 3600 |
| A | n8n | 72.62.86.210 | 3600 |

## What's Different from Previous Deploy

1. **Base path changed**: From `/transcript-parser/` to `/`
2. **FFmpeg fix applied**: External dependencies in build
3. **Fresh production build**: Built with `VITE_BASE_PATH=/`
4. **All tests passing**: 57/57 unit tests green

## Support

If you encounter issues:
1. Check Docker logs: `docker compose logs -f`
2. Check browser console for errors
3. Verify all containers are healthy: `docker compose ps`
4. Check this file for troubleshooting steps

---

**Ready to deploy!** Use `transcript-parser-root-deployment.tar.gz`
