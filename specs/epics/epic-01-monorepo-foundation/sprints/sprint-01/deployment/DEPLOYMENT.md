# 🚀 SmartHavenAI.com Deployment Guide

Quick reference for deploying the Transcript Parser application to production.

## Target Environment

- **VPS**: Hostinger KVM 2 (72.62.86.210)
- **Domains**:
  - Main app: https://smarthavenai.com
  - N8N workflows: https://n8n.smarthavenai.com

## Prerequisites

- SSH access to VPS: `ssh root@72.62.86.210`
- GitHub repository access
- Gemini API key
- Email for SSL certificates

## Quick Deploy (Automated)

The fastest way to deploy is using the automated deployment script:

```bash
# 1. SSH into VPS
ssh root@72.62.86.210

# 2. Download and run deployment script
curl -fsSL https://raw.githubusercontent.com/KevenWMarkham/transcript-parser/master/scripts/deploy-vps.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

The script will:

- Install Docker & Docker Compose
- Clone the repository
- Guide you through environment configuration
- Set up SSL certificates
- Deploy all services (App, N8N, PostgreSQL, Nginx)
- Configure firewall
- Verify deployment

## Manual Deployment Steps

If you prefer manual control, follow these steps:

### 1. System Setup (5 min)

```bash
ssh root@72.62.86.210

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2. Clone Repository (2 min)

```bash
mkdir -p /var/www/smarthaven
cd /var/www/smarthaven
git clone https://github.com/KevenWMarkham/transcript-parser.git .
```

### 3. Configure Environment (3 min)

```bash
# Copy template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Required values:**

- `POSTGRES_PASSWORD`: Strong password for PostgreSQL
- `N8N_PASSWORD`: Password for N8N access
- `VITE_GEMINI_API_KEY`: Your Gemini API key

```bash
# Create SSL directories
mkdir -p certbot/conf certbot/www
```

### 4. DNS Configuration (5 min)

In your Hostinger DNS settings, add these A records:

| Name | Type | Value        | TTL  |
| ---- | ---- | ------------ | ---- |
| @    | A    | 72.62.86.210 | 3600 |
| www  | A    | 72.62.86.210 | 3600 |
| n8n  | A    | 72.62.86.210 | 3600 |

Verify DNS propagation:

```bash
nslookup smarthavenai.com
nslookup www.smarthavenai.com
nslookup n8n.smarthavenai.com
```

### 5. SSL Certificates (10 min)

```bash
cd /var/www/smarthaven

# Start Nginx temporarily
docker compose up nginx -d

# Get certificate for main domain
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d smarthavenai.com \
  -d www.smarthavenai.com

# Get certificate for N8N
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d n8n.smarthavenai.com

# Stop temporary Nginx
docker compose down
```

### 6. Deploy Services (5 min)

```bash
cd /var/www/smarthaven

# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 7. Configure Firewall (2 min)

```bash
# Install UFW
apt install -y ufw

# Allow required ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# Enable firewall
ufw enable

# Check status
ufw status verbose
```

### 8. Verify Deployment (2 min)

```bash
# Test main app
curl -I https://smarthavenai.com

# Test N8N
curl -I https://n8n.smarthavenai.com

# Check all containers are healthy
docker compose ps
```

## Post-Deployment

### Access Applications

- **Main App**: https://smarthavenai.com
- **N8N Platform**: https://n8n.smarthavenai.com
  - Username: (from `N8N_USER` in .env.production)
  - Password: (from `N8N_PASSWORD` in .env.production)

### Useful Commands

```bash
# View logs
docker compose logs -f app
docker compose logs -f n8n
docker compose logs -f nginx

# Restart services
docker compose restart app
docker compose restart n8n

# Update application
cd /var/www/smarthaven
git pull origin master
docker compose up -d --build app

# Database backup
docker compose exec postgres pg_dump -U postgres transcript_parser > backup_$(date +%Y%m%d).sql

# Access database
docker compose exec postgres psql -U postgres transcript_parser

# Check SSL certificate renewal
docker compose run --rm certbot renew --dry-run
```

### Monitoring

```bash
# Container status
docker compose ps

# Resource usage
docker stats

# Disk usage
df -h

# Check logs for errors
docker compose logs app | grep -i error
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs app

# Recreate container
docker compose up -d --force-recreate app
```

### SSL Certificate Errors

```bash
# Test renewal
docker compose run --rm certbot renew --dry-run

# Force renewal
docker compose run --rm certbot renew --force-renewal

# Restart Nginx
docker compose restart nginx
```

### Database Connection Issues

```bash
# Check PostgreSQL status
docker compose ps postgres

# View logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker system
docker system prune -a

# Remove old images
docker image prune -a
```

## GitHub Actions CI/CD (Optional)

To enable automated deployments on push to master:

### 1. Generate SSH Key

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions@smarthavenai.com"

# Copy private key
cat ~/.ssh/id_ed25519

# Add public key to server
ssh-copy-id root@72.62.86.210
```

### 2. Add GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

- `HOSTINGER_SSH_KEY`: Paste private key content
- `HOSTINGER_KNOWN_HOSTS`: Run `ssh-keyscan 72.62.86.210`
- `HOSTINGER_USER`: `root`
- `HOSTINGER_HOST`: `72.62.86.210`

### 3. Test Automated Deployment

```bash
# Make a change and push
echo "# Test" >> README.md
git add README.md
git commit -m "test: verify automated deployment"
git push origin master

# Watch GitHub Actions
# Visit: https://github.com/KevenWMarkham/transcript-parser/actions
```

## Architecture

```
┌─────────────────────────────────────────────┐
│          Internet Traffic                    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 80/443)          │
│  - SSL Termination (Let's Encrypt)          │
│  - Routes to App or N8N                     │
└───────┬──────────────────┬──────────────────┘
        │                  │
        ▼                  ▼
┌──────────────┐    ┌──────────────────┐
│  App         │    │  N8N Workflows   │
│  (Port 3000) │    │  (Port 5678)     │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌────────────────┐
         │  PostgreSQL    │
         │  (Port 5432)   │
         │  - app DB      │
         │  - n8n DB      │
         └────────────────┘
```

## Security Checklist

- [ ] Strong passwords in `.env.production`
- [ ] `.env.production` not committed to git
- [ ] Firewall enabled (UFW)
- [ ] Only ports 22, 80, 443 open
- [ ] SSL certificates valid
- [ ] PostgreSQL not accessible externally
- [ ] Regular database backups configured

## Performance Targets

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## Support

For detailed deployment documentation, see:

- [Complete Deployment Guide](specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/DEPLOYMENT_SESSION_PROMPT.md)
- [Docker Deployment Details](specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/DOCKER_DEPLOYMENT.md)

---

**Generated with [Claude Code](https://claude.com/claude-code)**
