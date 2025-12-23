# Sprint 01 - Deployment Documentation

**Status**: ✅ Infrastructure Ready - DNS & VPS Setup Required
**Target**: SmartHavenAI.com on Hostinger VPS (KVM 2)
**Last Updated**: 2025-12-21

---

## 📂 What's in This Folder

This folder contains all deployment-related documentation and configuration files for deploying the Transcript Parser application to production.

---

## 📄 Files

### [DEPLOYMENT_SESSION_PROMPT.md](./DEPLOYMENT_SESSION_PROMPT.md) 🎯 **START HERE**

**The main deployment guide for Claude sessions**

Use this file when you're ready to deploy to production. It contains:
- ✅ Step-by-step deployment instructions (7 phases, 45-60 minutes)
- ✅ VPS setup with Docker & Docker Compose
- ✅ DNS configuration
- ✅ SSL certificate setup (Let's Encrypt)
- ✅ Full stack deployment (App, N8N, PostgreSQL, Nginx)
- ✅ Firewall configuration
- ✅ GitHub Actions CI/CD setup
- ✅ Troubleshooting guide
- ✅ Daily operations (logs, updates, backups)

**Prerequisites**:
- E2E tests passing
- VPS provisioned (IP: 72.62.86.210)
- Domain configured (smarthavenai.com)
- Docker files present

---

### [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) 📚 **REFERENCE GUIDE**

**Complete 200+ line deployment reference**

Comprehensive guide covering:
- Architecture diagrams
- Quick start instructions
- Daily operations commands
- Troubleshooting procedures
- Security best practices
- Monitoring setup
- CI/CD integration
- Complete command reference

**Use when**: You need detailed explanations or reference material

---

### [.env.production.example](./.env.production.example) ⚙️ **CONFIGURATION TEMPLATE**

**Production environment variables template**

Copy this to `.env.production` on the server and fill in:
- PostgreSQL credentials
- N8N configuration
- Gemini API key
- Domain settings

**Security**: Never commit `.env.production` to git

---

### [init-db.sql](./init-db.sql) 🗄️ **DATABASE SCHEMA**

**PostgreSQL initialization script**

Automatically creates:
- N8N database
- Transcript parser tables (users, transcripts, entries, speakers, usage_tracking)
- Indexes for performance
- Proper permissions

**Used by**: Docker Compose on first PostgreSQL startup

---

### [ecosystem.config.js](./ecosystem.config.js) 📦 **PM2 CONFIG (Optional)**

**PM2 process manager configuration**

For non-Docker deployments using PM2. Contains:
- Process name and script
- Environment variables
- Auto-restart settings
- Log file locations

**Note**: Docker deployment is recommended over PM2

---

## 🚀 Quick Start

### For New Deployment

1. **Read prerequisites** in [DEPLOYMENT_SESSION_PROMPT.md](./DEPLOYMENT_SESSION_PROMPT.md)
2. **Configure DNS** (5 minutes)
   - Add A records pointing to 72.62.86.210
3. **Run deployment** following the session prompt
   - SSH into VPS
   - Install Docker
   - Clone repository
   - Configure environment
   - Deploy stack

### For Updates

```bash
# SSH into server
ssh root@72.62.86.210
cd /var/www/smarthaven

# Pull latest code
git pull origin master

# Zero-downtime update
docker compose build app
docker compose up -d --no-deps app

# Verify
curl https://smarthavenai.com
```

---

## 🏗️ Deployment Architecture

```
Internet Traffic
      ↓
Nginx (SSL ports 80/443)
      ├─> smarthavenai.com → Transcript Parser (port 3000)
      └─> n8n.smarthavenai.com → N8N (port 5678)
             ↓
      PostgreSQL (port 5432)
      ├─> transcript_parser DB
      └─> n8n DB
```

**Services**:
- **Nginx**: Reverse proxy + SSL termination
- **Transcript Parser**: Main React application
- **N8N**: Workflow automation platform
- **PostgreSQL 16**: Shared database
- **Certbot**: SSL certificate management

---

## 📊 Current Status

### Infrastructure ✅

- [x] VPS provisioned (Hostinger KVM 2)
- [x] IP assigned (72.62.86.210)
- [x] Docker files created
- [x] Nginx configuration ready
- [x] Database schema defined
- [x] Environment template created
- [x] Deployment guide written
- [x] GitHub Actions workflow ready

### Pending User Actions ⏳

- [ ] Configure DNS A records
- [ ] SSH into VPS and install Docker
- [ ] Clone repository to VPS
- [ ] Configure `.env.production`
- [ ] Obtain SSL certificates
- [ ] Deploy Docker stack
- [ ] Verify deployment
- [ ] Set up GitHub secrets for CI/CD

---

## 🔗 Related Documentation

### Sprint 01 Documentation
- [Implementation README](../implementation/README.md) - Sprint progress and context
- [E2E Testing Prompt](../implementation/E2E_TESTING_SESSION_PROMPT.md) - Test before deployment
- [Code Review Prompt](../implementation/CODE_REVIEW_SESSION_PROMPT.md) - Review after deployment

### Planning Documentation
- [Orchestration Prompt](../planning/ORCHESTRATION_PROMPT.md#L498-L648) - Deployment infrastructure section
- [Sprint Overview](../Sprint%2001%20-%20Overview.md) - Sprint goals and scope

### Hosting Information (Local Only)
- `docs/hosting/Hostinger.md` - VPS credentials (gitignored)
- `docs/hosting/hostinger-mcp-config.json` - MCP server config

---

## 🎯 Success Criteria

Deployment is successful when:

### Main Application
- [ ] https://smarthavenai.com loads successfully
- [ ] SSL certificate valid (green padlock)
- [ ] All features working (upload, transcription, export)
- [ ] No console errors
- [ ] Lighthouse score > 90

### N8N Platform
- [ ] https://n8n.smarthavenai.com accessible
- [ ] Can log in and access dashboard
- [ ] Can create workflows

### Infrastructure
- [ ] All Docker containers healthy
- [ ] PostgreSQL accessible to app/n8n only
- [ ] SSL auto-renewal configured
- [ ] Firewall configured (ports 22, 80, 443 only)
- [ ] Database backups working

### CI/CD
- [ ] GitHub Actions workflow passing
- [ ] Zero-downtime updates working
- [ ] Automated deployment on push to master

---

## 📞 Getting Help

### Common Issues

**Issue**: Container won't start
```bash
docker compose logs app
docker compose up -d --force-recreate app
```

**Issue**: SSL certificate errors
```bash
docker compose run --rm certbot renew --dry-run
docker compose restart nginx
```

**Issue**: N8N not accessible
```bash
docker compose logs n8n
docker compose exec nginx nginx -t
```

See [DEPLOYMENT_SESSION_PROMPT.md](./DEPLOYMENT_SESSION_PROMPT.md#L505-L570) for complete troubleshooting guide.

---

## 🔄 Maintenance

### Daily Operations

```bash
# View logs
docker compose logs -f

# Restart service
docker compose restart app

# Database backup
docker compose exec postgres pg_dump -U postgres transcript_parser > backup.sql
```

### Updates

```bash
# Zero-downtime update
git pull origin master
docker compose build app
docker compose up -d --no-deps app
```

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md#L209-L273) for complete operations guide.

---

## 🎓 Next Steps

1. **Review Prerequisites**: Check all requirements in deployment prompt
2. **Configure DNS**: Add A records in Hostinger control panel
3. **Deploy**: Follow [DEPLOYMENT_SESSION_PROMPT.md](./DEPLOYMENT_SESSION_PROMPT.md)
4. **Verify**: Test all functionality
5. **Monitor**: Set up monitoring and alerts
6. **Code Review**: Run code review session after successful deployment

---

**Ready to deploy?** Start with [DEPLOYMENT_SESSION_PROMPT.md](./DEPLOYMENT_SESSION_PROMPT.md) 🚀

**Application URLs (After Deployment)**:
- Main App: https://smarthavenai.com
- N8N Workflows: https://n8n.smarthavenai.com

**VPS Access**:
- SSH: `ssh root@72.62.86.210`
- Location: Boston, USA
- Plan: KVM 2 (8GB RAM, 2 CPU, 100GB NVMe)
