# Quick Deployment Instructions for SmartHavenAI.com

## Package Created

✅ **transcript-parser-root-deployment.tar.gz** (13 MB)

- Built for root domain (/) deployment
- Includes FFmpeg.wasm fix for Docker builds
- All tests passing

## Deployment Steps

### 1. Upload to VPS

```bash
scp transcript-parser-root-deployment.tar.gz root@72.62.86.210:/tmp/
```

### 2. SSH into VPS

```bash
ssh root@72.62.86.210
```

### 3. Extract and Deploy

```bash
# Create deployment directory
mkdir -p /var/www/smarthaven
cd /var/www/smarthaven

# Extract package
tar -xzf /tmp/transcript-parser-root-deployment.tar.gz

# Create environment file
cp specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/.env.production.example .env.production

# Edit with your values
nano .env.production
```

### 4. Required Environment Variables

Edit `.env.production`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YourSecurePassword123!
POSTGRES_DB=transcript_parser

N8N_DB=n8n
N8N_USER=admin
N8N_PASSWORD=YourN8NPassword123!
N8N_HOST=n8n.smarthavenai.com

VITE_GEMINI_API_KEY=your_gemini_api_key_here

TIMEZONE=America/New_York
DOMAIN=smarthavenai.com
```

### 5. Start Docker Services

```bash
# Build and start all containers
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 6. Get SSL Certificates

```bash
# Request certificates for main domain
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d smarthavenai.com \
  -d www.smarthavenai.com

# Request certificate for N8N subdomain
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d n8n.smarthavenai.com

# Restart Nginx to use certificates
docker compose restart nginx
```

### 7. Verify Deployment

```bash
# Test main app
curl https://smarthavenai.com

# Test N8N
curl https://n8n.smarthavenai.com

# Check all containers are healthy
docker compose ps
```

## DNS Records Needed

Before deploying, update DNS in Hostinger:

| Type | Name | Value        | TTL  |
| ---- | ---- | ------------ | ---- |
| A    | @    | 72.62.86.210 | 3600 |
| A    | www  | 72.62.86.210 | 3600 |
| A    | n8n  | 72.62.86.210 | 3600 |

## Access URLs

After deployment:

- **Main App**: https://smarthavenai.com
- **N8N**: https://n8n.smarthavenai.com

## Troubleshooting

### View logs

```bash
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres
```

### Restart services

```bash
docker compose restart app
docker compose restart nginx
```

### Rebuild after code changes

```bash
git pull origin master
docker compose up -d --build app
```

## What's Fixed

✅ FFmpeg.wasm Docker build error resolved
✅ All packages build correctly in Node.js environment
✅ Production build tested and working
✅ All tests passing (57/57)

## Files Included

- ✅ Built application (`dist/`)
- ✅ Docker configuration (`Dockerfile`, `docker-compose.yml`)
- ✅ Package definitions (`package.json`, `pnpm-workspace.yaml`)
- ✅ All workspace packages (`packages/`)
- ✅ Deployment documentation
- ✅ Environment template

## Package Contents

The tar.gz includes:

- Production build (dist/)
- Docker files
- All packages (audio-processing, types, module-sdk, ui)
- Deployment documentation
- Lock files for reproducible builds

Total size: **13 MB**
