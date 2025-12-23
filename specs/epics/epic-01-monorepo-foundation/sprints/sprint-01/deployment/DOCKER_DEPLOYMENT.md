# Docker Deployment Guide for SmartHavenAI.com

**Complete Docker-based deployment for Transcript Parser + N8N on Hostinger VPS**

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                 Internet Traffic                      │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 80/443)                   │
│  - SSL Termination                                    │
│  - Routes traffic to app or N8N                       │
└───────┬──────────────────────────────┬───────────────┘
        │                              │
        ▼                              ▼
┌──────────────────┐         ┌──────────────────────┐
│  Transcript App  │         │       N8N            │
│  (Port 3000)     │         │  (Port 5678)         │
│                  │         │                      │
│  smarthaven      │         │  n8n.smarthaven      │
│  .ai.com         │         │  .ai.com             │
└────────┬─────────┘         └──────────┬───────────┘
         │                              │
         └──────────────┬───────────────┘
                        ▼
               ┌─────────────────┐
               │   PostgreSQL    │
               │   (Port 5432)   │
               │                 │
               │  - transcript_  │
               │    parser DB    │
               │  - n8n DB       │
               └─────────────────┘
```

---

## 📦 What's Included

1. **Transcript Parser** - Your main application
2. **N8N** - Workflow automation platform
3. **PostgreSQL** - Shared database (16-alpine)
4. **Nginx** - Reverse proxy with SSL
5. **Certbot** - Automatic SSL certificate renewal

---

## 🚀 Quick Start

### Step 1: Prepare Your VPS

SSH into your Hostinger VPS:

```bash
ssh username@smarthaven.ai.com
```

### Step 2: Install Docker

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Logout and login again for group changes to take effect
exit
```

### Step 3: Clone Your Repository

```bash
# SSH back in
ssh username@smarthaven.ai.com

# Create application directory
sudo mkdir -p /var/www/smarthaven
sudo chown -R $USER:$USER /var/www/smarthaven

# Clone your repository
cd /var/www/smarthaven
git clone https://github.com/your-username/transcript-parser.git .
```

### Step 4: Configure Environment Variables

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Required values**:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YourSecurePasswordHere123!
POSTGRES_DB=transcript_parser

N8N_DB=n8n
N8N_USER=admin
N8N_PASSWORD=YourN8NPasswordHere123!
N8N_HOST=n8n.smarthaven.ai.com

VITE_GEMINI_API_KEY=your_gemini_api_key_here

TIMEZONE=America/New_York
DOMAIN=smarthaven.ai.com
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 5: Set Up DNS Records

In your Hostinger control panel, add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your-VPS-IP | 3600 |
| A | www | Your-VPS-IP | 3600 |
| A | n8n | Your-VPS-IP | 3600 |

Wait 5-10 minutes for DNS propagation.

### Step 6: Initial SSL Certificate Setup

```bash
# Create required directories
mkdir -p certbot/conf certbot/www

# Start Nginx temporarily without SSL
docker compose up nginx -d

# Get SSL certificates
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d smarthaven.ai.com \
  -d www.smarthaven.ai.com

docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d n8n.smarthaven.ai.com

# Stop temporary Nginx
docker compose down
```

### Step 7: Start All Services

```bash
# Build and start all containers
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 8: Verify Deployment

```bash
# Check if all containers are running
docker compose ps

# Should show:
# - postgres-db (healthy)
# - transcript-parser (healthy)
# - n8n-workflows (healthy)
# - nginx-proxy (healthy)
# - certbot (healthy)

# Test main app
curl https://smarthaven.ai.com

# Test N8N
curl https://n8n.smarthaven.ai.com
```

---

## 🔄 Daily Operations

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f n8n
docker compose logs -f nginx
docker compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart app
docker compose restart n8n
```

### Update Application

```bash
cd /var/www/smarthaven

# Pull latest code
git pull origin master

# Rebuild and restart
docker compose up -d --build app

# Or zero-downtime update:
docker compose build app
docker compose up -d --no-deps app
```

### Database Backup

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres transcript_parser > backup_$(date +%Y%m%d).sql

# Restore backup
docker compose exec -T postgres psql -U postgres transcript_parser < backup_20231221.sql
```

### Access Database

```bash
# PostgreSQL shell
docker compose exec postgres psql -U postgres transcript_parser

# List tables
\dt

# Exit
\q
```

---

## 🛠️ Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs app

# Check if port is already in use
sudo netstat -tulpn | grep 3000

# Recreate container
docker compose up -d --force-recreate app
```

### SSL Certificate Issues

```bash
# Test certificate renewal
docker compose run --rm certbot renew --dry-run

# Force renewal
docker compose run --rm certbot renew --force-renewal

# Restart Nginx after renewal
docker compose restart nginx
```

### N8N Not Accessible

```bash
# Check N8N logs
docker compose logs n8n

# Verify N8N is running
docker compose exec n8n wget -O- http://localhost:5678/healthz

# Check Nginx config
docker compose exec nginx nginx -t
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

```bash
# Edit .env.production
nano .env.production

# Change:
# - POSTGRES_PASSWORD
# - N8N_PASSWORD
```

### 2. Enable Firewall

```bash
# Install UFW
sudo apt install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

### 4. Monitor Logs

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/docker-containers

# Add:
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
```

---

## 📊 Monitoring

### Health Checks

```bash
# Check all service health
docker compose ps

# Manual health check
curl https://smarthaven.ai.com
curl https://n8n.smarthaven.ai.com/healthz
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

---

## 🔄 CI/CD Integration

The GitHub Actions workflow automatically:

1. Runs tests
2. Builds Docker image
3. Pushes to Docker Hub (optional)
4. SSHs to server
5. Pulls latest code
6. Rebuilds and restarts containers

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| POSTGRES_USER | PostgreSQL username | Yes | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | Yes | - |
| POSTGRES_DB | Main database name | Yes | transcript_parser |
| N8N_DB | N8N database name | Yes | n8n |
| N8N_USER | N8N login username | Yes | admin |
| N8N_PASSWORD | N8N login password | Yes | - |
| N8N_HOST | N8N domain | Yes | n8n.smarthaven.ai.com |
| VITE_GEMINI_API_KEY | Google Gemini API key | Yes | - |
| TIMEZONE | Server timezone | No | America/New_York |
| DOMAIN | Main app domain | No | smarthaven.ai.com |

---

## 🎯 Access URLs

After deployment:

- **Main App**: https://smarthaven.ai.com
- **N8N Workflows**: https://n8n.smarthaven.ai.com
  - Username: (from N8N_USER)
  - Password: (from N8N_PASSWORD)

---

## 🆘 Common Commands Cheat Sheet

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart service
docker compose restart app

# View logs
docker compose logs -f app

# Rebuild and restart
docker compose up -d --build app

# Update from Git
git pull && docker compose up -d --build

# Backup database
docker compose exec postgres pg_dump -U postgres transcript_parser > backup.sql

# Access container shell
docker compose exec app sh

# Check service status
docker compose ps

# Clean up unused containers
docker system prune -a
```

---

**Deployment Complete!** 🎉

Your application is now running with:
- ✅ HTTPS encryption
- ✅ Automatic SSL renewal
- ✅ PostgreSQL database
- ✅ N8N workflow automation
- ✅ Reverse proxy routing
- ✅ Health checks and auto-restart

Visit https://smarthaven.ai.com to see your app live!
