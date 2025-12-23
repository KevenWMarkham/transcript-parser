# Sprint 01 - Docker Deployment Session Prompt

**Target Environment**: SmartHavenAI.com on Hostinger VPS (KVM 2)
**Status**: ✅ Infrastructure Ready - DNS & VPS Setup Required
**Recommended Model**: Claude Sonnet 4.5
**Estimated Time**: 45-60 minutes

---

## 🎯 Session Goal

Deploy the Transcript Parser application with N8N workflow automation to SmartHavenAI.com using Docker, Nginx reverse proxy, and automated CI/CD pipeline.

---

## 📋 Prerequisites Checklist

Before starting this deployment session, verify:

- [ ] E2E tests are passing (`pnpm test:e2e`)
- [ ] Unit tests are passing (`pnpm test`)
- [ ] Build completes successfully (`pnpm build`)
- [ ] **Hostinger VPS is provisioned** (IP: 72.62.86.210)
- [ ] **SSH access working**: `ssh root@72.62.86.210`
- [ ] **Domain configured**: smarthavenai.com
- [ ] **Gemini API key** available for production
- [ ] **Docker infrastructure files** present:
  - `Dockerfile`
  - `docker-compose.yml`
  - `nginx/nginx.conf`
  - `nginx/conf.d/*.conf`
  - `.env.production.example`
  - `init-db.sql`

---

## 🏗️ Deployment Architecture

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

**Services**:
- **Nginx**: Reverse proxy with SSL
- **Transcript Parser**: Main application (React + Vite)
- **N8N**: Workflow automation platform
- **PostgreSQL 16**: Shared database
- **Certbot**: SSL certificate management

---

## 📂 Phase 1: VPS Initial Setup (20 minutes)

### Step 1.1: SSH into Hostinger VPS

```bash
# SSH into your VPS
ssh root@72.62.86.210

# Update system
apt update && apt upgrade -y
```

### Step 1.2: Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add user to docker group (if not root)
usermod -aG docker $USER

# Install Docker Compose plugin
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Enable Docker to start on boot
systemctl enable docker
systemctl start docker
```

### Step 1.3: Create Application Directory

```bash
# Create app directory
mkdir -p /var/www/smarthaven
cd /var/www/smarthaven

# Set ownership
chown -R $USER:$USER /var/www/smarthaven
```

### Step 1.4: Clone Repository

```bash
# Clone your repository
cd /var/www/smarthaven
git clone https://github.com/YOUR_USERNAME/transcript-parser.git .

# Or if you need to set up SSH key first:
ssh-keygen -t ed25519 -C "vps@smarthaven.ai.com"
cat ~/.ssh/id_ed25519.pub
# Add this public key to your GitHub account
```

---

## 📂 Phase 2: Configure Environment (10 minutes)

### Step 2.1: Create Production Environment File

```bash
# Copy environment template
cd /var/www/smarthaven
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

**Required values** in `.env.production`:

```env
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE_123!
POSTGRES_DB=transcript_parser

# N8N Configuration
N8N_DB=n8n
N8N_USER=admin
N8N_PASSWORD=YOUR_N8N_PASSWORD_HERE_123!
N8N_HOST=n8n.smarthaven.ai.com

# Application
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production

# Domain
TIMEZONE=America/New_York
DOMAIN=smarthaven.ai.com
```

**Security Best Practices**:
- Use strong passwords (16+ characters, mixed case, numbers, symbols)
- Never commit `.env.production` to git (already in .gitignore)
- Store credentials securely in password manager

### Step 2.2: Create Required Directories

```bash
# Create directories for SSL certificates
mkdir -p certbot/conf certbot/www
```

---

## 📂 Phase 3: DNS Configuration (5 minutes)

### Step 3.1: Update DNS Records

**In Hostinger Control Panel** → Domains → DNS Zone Editor:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 72.62.86.210 | 3600 |
| A | www | 72.62.86.210 | 3600 |
| A | n8n | 72.62.86.210 | 3600 |

**Or use Hostinger MCP Server** (if configured):
```bash
# The MCP server can programmatically update DNS records
# See docs/hosting/Hostinger.md for MCP setup instructions
```

### Step 3.2: Verify DNS Propagation

```bash
# Check DNS resolution (wait 5-10 minutes after DNS changes)
nslookup smarthaven.ai.com
nslookup www.smarthaven.ai.com
nslookup n8n.smarthaven.ai.com

# All should resolve to 72.62.86.210
```

---

## 📂 Phase 4: SSL Certificate Setup (10 minutes)

### Step 4.1: Start Nginx Temporarily

```bash
cd /var/www/smarthaven

# Start Nginx without SSL first (for Let's Encrypt validation)
docker compose up nginx -d
```

### Step 4.2: Obtain SSL Certificates

```bash
# For main domain (smarthaven.ai.com)
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d smarthaven.ai.com \
  -d www.smarthaven.ai.com

# For N8N subdomain (n8n.smarthaven.ai.com)
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d n8n.smarthaven.ai.com
```

**Expected Output**: Certificates saved to `/etc/letsencrypt/live/`

### Step 4.3: Stop Temporary Nginx

```bash
docker compose down
```

---

## 📂 Phase 5: Deploy Full Stack (10 minutes)

### Step 5.1: Build and Start All Services

```bash
cd /var/www/smarthaven

# Build and start all containers
docker compose up -d --build

# This will start:
# - postgres (PostgreSQL 16)
# - app (Transcript Parser)
# - n8n (N8N workflows)
# - nginx (Reverse proxy)
# - certbot (SSL renewal)
```

### Step 5.2: Monitor Container Status

```bash
# Check if all containers are running
docker compose ps

# Expected output:
# NAME                  STATUS
# postgres-db           Up (healthy)
# transcript-parser     Up (healthy)
# n8n-workflows         Up (healthy)
# nginx-proxy           Up
# certbot               Up

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f app
docker compose logs -f n8n
docker compose logs -f nginx
```

### Step 5.3: Verify Deployment

```bash
# Test main app (HTTP should redirect to HTTPS)
curl -I http://smarthaven.ai.com

# Test HTTPS
curl https://smarthaven.ai.com

# Test N8N
curl https://n8n.smarthaven.ai.com

# Check PostgreSQL (should not be accessible externally)
# This should timeout or be refused:
telnet 72.62.86.210 5432
```

---

## 📂 Phase 6: Configure Firewall (5 minutes)

### Step 6.1: Set Up UFW Firewall

```bash
# Install UFW if not already installed
apt install ufw -y

# Allow SSH (CRITICAL - do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status verbose
```

**Expected Output**:
```
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## 📂 Phase 7: GitHub Actions CI/CD (Optional - 10 minutes)

### Step 7.1: Add GitHub Secrets

Go to GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

1. **HOSTINGER_SSH_KEY**: Private SSH key for deployment
   ```bash
   # Generate SSH key on your local machine
   ssh-keygen -t ed25519 -C "github-actions@smarthaven.ai.com"

   # Copy private key content to GitHub secret
   cat ~/.ssh/id_ed25519

   # Copy public key to server
   ssh-copy-id root@72.62.86.210
   ```

2. **HOSTINGER_KNOWN_HOSTS**: Server fingerprint
   ```bash
   ssh-keyscan 72.62.86.210
   ```

3. **HOSTINGER_USER**: `root` (or your VPS username)

4. **HOSTINGER_HOST**: `72.62.86.210`

### Step 7.2: Verify GitHub Actions Workflow

The workflow file is already created at `.github/workflows/deploy.yml`

**Test automated deployment**:
```bash
# Make a small change
echo "# Deployment test" >> README.md
git add README.md
git commit -m "test: verify automated deployment"
git push origin master

# Watch GitHub Actions
# Visit: https://github.com/YOUR_USERNAME/transcript-parser/actions
```

---

## ✅ Deployment Verification Checklist

### Main Application
- [ ] https://smarthaven.ai.com loads successfully
- [ ] SSL certificate is valid (green padlock)
- [ ] HTTP redirects to HTTPS
- [ ] All pages load correctly
- [ ] Upload functionality works
- [ ] Transcription works (test with sample video)
- [ ] Export features work (TXT, SRT, VTT, CSV, JSON)
- [ ] No console errors in browser DevTools

### N8N Platform
- [ ] https://n8n.smarthaven.ai.com loads successfully
- [ ] Can log in with N8N_USER and N8N_PASSWORD
- [ ] Dashboard is accessible
- [ ] Can create a test workflow

### Infrastructure
- [ ] All Docker containers running (`docker compose ps`)
- [ ] PostgreSQL healthy and accessible to app/n8n
- [ ] Nginx serving both domains correctly
- [ ] SSL certificates valid for both domains
- [ ] Auto-renewal configured for SSL (`certbot renew --dry-run`)

### Security
- [ ] Firewall enabled (UFW)
- [ ] Only ports 22, 80, 443 open
- [ ] PostgreSQL not accessible externally
- [ ] Environment variables not committed to git
- [ ] Strong passwords used for database and N8N

### Performance
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] No memory leaks (check `docker stats`)

---

## 📊 Daily Operations

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

# Rebuild and restart (with downtime ~10 seconds)
docker compose up -d --build app

# Zero-downtime update
docker compose build app
docker compose up -d --no-deps app
```

### Database Backup

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres transcript_parser > backup_$(date +%Y%m%d).sql

# Restore from backup
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

## 🚨 Troubleshooting

### Issue: Container won't start

```bash
# Check logs
docker compose logs app

# Check if port is already in use
netstat -tulpn | grep 3000

# Recreate container
docker compose up -d --force-recreate app
```

### Issue: SSL certificate errors

```bash
# Test certificate renewal
docker compose run --rm certbot renew --dry-run

# Force renewal
docker compose run --rm certbot renew --force-renewal

# Restart Nginx
docker compose restart nginx
```

### Issue: N8N not accessible

```bash
# Check N8N logs
docker compose logs n8n

# Verify N8N is running
docker compose exec n8n wget -O- http://localhost:5678/healthz

# Check Nginx config
docker compose exec nginx nginx -t
```

### Issue: Database connection errors

```bash
# Check PostgreSQL status
docker compose ps postgres

# Check logs
docker compose logs postgres

# Restart database
docker compose restart postgres
```

### Issue: Out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a
```

---

## 🔄 Rollback Procedure

If deployment fails:

```bash
# SSH into server
ssh root@72.62.86.210
cd /var/www/smarthaven

# List git commits
git log --oneline -5

# Rollback to previous commit
git reset --hard PREVIOUS_COMMIT_HASH

# Rebuild and restart
docker compose up -d --build app

# Verify
curl https://smarthaven.ai.com
```

---

## 📊 Success Criteria

### Deployment is successful when:

1. ✅ Main app accessible at https://smarthaven.ai.com
2. ✅ N8N accessible at https://n8n.smarthaven.ai.com
3. ✅ SSL certificates valid on both domains
4. ✅ All Docker containers healthy
5. ✅ Upload and transcription functionality works
6. ✅ Export features work (all formats)
7. ✅ No console errors
8. ✅ Lighthouse performance score > 90
9. ✅ Database backups working
10. ✅ Firewall configured correctly

### Performance Targets:

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

---

## 📚 Documentation References

- **Complete Deployment Guide**: [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
- **Deployment Folder README**: [README.md](./README.md) - Overview and quick start
- **Hosting Credentials**: `docs/hosting/Hostinger.md` (local only, gitignored)
- **Environment Template**: [.env.production.example](./.env.production.example)
- **Database Init**: [init-db.sql](./init-db.sql)
- **Docker Compose**: `docker-compose.yml` (project root)
- **Nginx Config**: `nginx/conf.d/*.conf` (project root)

---

## 🎯 Next Steps After Deployment

1. **Monitor Application**:
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Configure error tracking (Sentry)
   - Enable log aggregation

2. **N8N Workflow Setup**:
   - Log into N8N platform
   - Create automation workflows
   - Set up integrations

3. **Code Review**:
   - Run [CODE_REVIEW_SESSION_PROMPT.md](../implementation/CODE_REVIEW_SESSION_PROMPT.md)
   - Address any issues found
   - Document learnings

4. **Demo Preparation**:
   - Prepare demo script
   - Test all features end-to-end
   - Prepare presentation materials

---

**Deployment Phase Complete!** 🚀

**Application URLs**:
- **Main App**: https://smarthaven.ai.com
- **N8N Workflows**: https://n8n.smarthaven.ai.com

**Next Action**: Once deployment is verified, run [CODE_REVIEW_SESSION_PROMPT.md](../implementation/CODE_REVIEW_SESSION_PROMPT.md) for final validation before Sprint 01 completion.
