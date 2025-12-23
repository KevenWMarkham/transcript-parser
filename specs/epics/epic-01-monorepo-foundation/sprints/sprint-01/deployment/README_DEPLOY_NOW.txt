================================================================================
  DEPLOY TO FIX PRODUCTION ERROR
================================================================================

YOUR CURRENT ISSUE:
  https://smarthavenai.com/transcript-parser/ shows:
  "Failed to load FFmpeg: ffmpeg.wasm does not support nodejs"

WHAT'S FIXED:
  ✅ FFmpeg Docker build error resolved
  ✅ Built for root domain (not /transcript-parser/)
  ✅ All tests passing (57/57)
  ✅ Ready for immediate deployment

DEPLOYMENT PACKAGE:
  📦 transcript-parser-root-deployment.tar.gz (13 MB)

================================================================================
  DEPLOYMENT STEPS (15 minutes)
================================================================================

1. UPLOAD TO SERVER
   -------------------------------
   Open a terminal on your Windows machine:

   scp transcript-parser-root-deployment.tar.gz root@72.62.86.210:/tmp/

2. SSH TO SERVER
   -------------------------------
   ssh root@72.62.86.210

3. RUN AUTO-DEPLOY SCRIPT
   -------------------------------
   cd /tmp
   tar -xzf transcript-parser-root-deployment.tar.gz quick-deploy.sh
   chmod +x quick-deploy.sh
   ./quick-deploy.sh

   The script will:
   - Backup existing deployment
   - Extract new files
   - Copy your .env.production
   - Build Docker containers
   - Start all services
   - Show status

4. VERIFY IT WORKS
   -------------------------------
   Visit: https://smarthavenai.com
   Upload a video
   Should process successfully!

================================================================================
  MANUAL DEPLOYMENT (if script fails)
================================================================================

1. ssh root@72.62.86.210

2. cd /var/www/smarthaven && docker compose down

3. mv /var/www/smarthaven /var/www/smarthaven-backup

4. mkdir -p /var/www/smarthaven && cd /var/www/smarthaven

5. tar -xzf /tmp/transcript-parser-root-deployment.tar.gz

6. cp ../smarthaven-backup/.env.production .env.production

7. docker compose up -d --build

8. docker compose ps

9. Visit https://smarthavenai.com

================================================================================
  NEED HELP?
================================================================================

Check Docker logs:
  docker compose logs -f app

Check all services:
  docker compose ps

Restart app:
  docker compose restart app

Read detailed instructions:
  - IMPORTANT_DEPLOYMENT_FIX.md
  - DEPLOYMENT_INSTRUCTIONS.md

================================================================================

🚀 READY TO DEPLOY! Use the auto-deploy script for fastest results.

================================================================================
