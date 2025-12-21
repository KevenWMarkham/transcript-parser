# Cloud Deployment Guide - Access Transcript Parser From Anywhere

**Goal**: Deploy Transcript Parser to cloud platforms for global accessibility
**Platforms**: Vercel, Netlify, AWS, Azure, Google Cloud, Hostinger
**Domain**: SmartHavenAI.com

---

## 🌐 Overview

This guide covers deploying Transcript Parser to various cloud platforms, allowing access from anywhere with internet connectivity. Each platform has different features, pricing, and setup requirements.

---

## 🎯 Platform Comparison

| Platform                  | Best For                   | Free Tier         | Pros                                     | Cons                            |
| ------------------------- | -------------------------- | ----------------- | ---------------------------------------- | ------------------------------- |
| **Vercel**                | React/Vite apps            | Yes (generous)    | Fastest deployment, automatic SSL, CDN   | Limited serverless functions    |
| **Netlify**               | Static sites + functions   | Yes (100GB/month) | Easy setup, form handling, split testing | Build minutes limited           |
| **Hostinger**             | Full control, custom needs | No (paid only)    | cPanel, FTP access, databases            | Manual deployment               |
| **AWS S3 + CloudFront**   | Enterprise, scalability    | Yes (12 months)   | Unlimited scale, full AWS ecosystem      | Complex setup, can be expensive |
| **Azure Static Web Apps** | Microsoft ecosystem        | Yes (100GB/month) | GitHub integration, staging environments | Azure-specific                  |
| **Google Cloud Storage**  | Google ecosystem           | Yes (limited)     | Fast CDN, Firebase integration           | Complex pricing                 |

---

## 🚀 Option 1: Vercel (Recommended for React/Vite)

### Why Vercel?

- **Zero configuration** for Vite projects
- **Automatic deployments** from GitHub
- **Free SSL** and global CDN
- **Preview deployments** for pull requests
- **Generous free tier**

### Deployment Steps

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Configure Project

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "name": "transcript-parser",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "VITE_GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

#### Step 4: Deploy

```bash
# Test deployment (preview)
vercel

# Production deployment
vercel --prod
```

**Expected Output**:

```
Vercel CLI 28.0.0
🔍 Inspect: https://vercel.com/your-username/transcript-parser/xxx
✅ Production: https://transcript-parser.vercel.app
```

#### Step 5: Add Custom Domain

1. Go to Vercel Dashboard
2. Select project → Settings → Domains
3. Add domain: `smarthavenai.com`
4. Follow DNS configuration instructions
5. Add CNAME or A record to your DNS

**DNS Records** (at GoDaddy or Hostinger):

```
Type    Name    Value                              TTL
A       @       76.76.21.21                        600
CNAME   www     cname.vercel-dns.com               600
```

#### Step 6: Configure Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_GEMINI_API_KEY = your_actual_api_key_here
```

#### Step 7: Enable Automatic Deployments from GitHub

1. Push code to GitHub
2. Vercel Dashboard → Import Git Repository
3. Select `transcript-parser` repo
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy

**Auto-deploy on push**:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview URLs

### GitHub Actions Integration

Create `.github/workflows/vercel-deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

**Setup Secrets in GitHub**:

1. Get Vercel token: https://vercel.com/account/tokens
2. GitHub repo → Settings → Secrets → Actions
3. Add:
   - `VERCEL_TOKEN`
   - `ORG_ID` (from Vercel settings)
   - `PROJECT_ID` (from Vercel project settings)
   - `VITE_GEMINI_API_KEY`

---

## 🌊 Option 2: Netlify

### Why Netlify?

- **Easy drag-and-drop deployment**
- **Form handling** (for contact forms)
- **Split testing** (A/B testing)
- **Free SSL** and CDN

### Deployment Steps

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

#### Step 3: Initialize Project

```bash
netlify init
```

Follow prompts:

- Create new site? Yes
- Team: Your team
- Site name: transcript-parser
- Build command: `npm run build`
- Publish directory: `dist`

#### Step 4: Configure Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

#### Step 6: Add Custom Domain

1. Netlify Dashboard → Site → Domain Settings
2. Add custom domain: `smarthavenai.com`
3. Follow DNS instructions

**DNS Configuration** (at GoDaddy or Hostinger):

```
Type    Name    Value                           TTL
A       @       75.2.60.5                       600
CNAME   www     your-site.netlify.app           600
```

#### Step 7: Environment Variables

Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
VITE_GEMINI_API_KEY = your_api_key_here
```

### Continuous Deployment

1. Netlify Dashboard → Site Settings → Build & Deploy
2. Connect to Git provider (GitHub)
3. Select repository
4. Configure:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`

Now every push to `main` auto-deploys!

---

## ☁️ Option 3: AWS S3 + CloudFront (Enterprise)

### Why AWS?

- **Unlimited scalability**
- **99.99% uptime SLA**
- **Global CDN** with CloudFront
- **Integration** with other AWS services

### Architecture

```
User Request
    ↓
CloudFront CDN (Global Edge Locations)
    ↓
S3 Bucket (Static Files)
    ↓
Lambda@Edge (Optional: Auth, Headers)
```

### Deployment Steps

#### Step 1: Install AWS CLI

```bash
# macOS
brew install awscli

# Windows
# Download from https://aws.amazon.com/cli/

# Linux
sudo apt-get install awscli
```

Configure:

```bash
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: us-east-1
# Default output format: json
```

#### Step 2: Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://smarthavenai-app --region us-east-1

# Enable static website hosting
aws s3 website s3://smarthavenai-app --index-document index.html --error-document index.html
```

#### Step 3: Create Bucket Policy

Create `s3-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::smarthavenai-app/*"
    }
  ]
}
```

Apply policy:

```bash
aws s3api put-bucket-policy --bucket smarthavenai-app --policy file://s3-policy.json
```

#### Step 4: Build and Upload

```bash
# Build production files
npm run build

# Upload to S3
aws s3 sync dist/ s3://smarthavenai-app --delete --cache-control max-age=31536000,public

# Upload index.html separately (no cache)
aws s3 cp dist/index.html s3://smarthavenai-app/index.html --cache-control max-age=0,no-cache,no-store,must-revalidate
```

#### Step 5: Create CloudFront Distribution

```bash
# Create distribution
aws cloudfront create-distribution --origin-domain-name smarthavenai-app.s3.amazonaws.com --default-root-object index.html
```

Or via AWS Console:

1. CloudFront → Create Distribution
2. Origin:
   - Domain: smarthavenai-app.s3.amazonaws.com
   - Origin path: (leave empty)
3. Default cache behavior:
   - Viewer protocol policy: Redirect HTTP to HTTPS
4. Settings:
   - Alternate domain names (CNAMEs): smarthavenai.com, www.smarthavenai.com
   - SSL Certificate: Request certificate (ACM)
5. Create

#### Step 6: Configure DNS

Get CloudFront domain name (e.g., `d111111abcdef8.cloudfront.net`)

**DNS at GoDaddy/Hostinger**:

```
Type    Name    Value                              TTL
CNAME   @       d111111abcdef8.cloudfront.net      600
CNAME   www     d111111abcdef8.cloudfront.net      600
```

#### Step 7: Request SSL Certificate (ACM)

1. AWS Certificate Manager → Request Certificate
2. Domain names:
   - smarthavenai.com
   - \*.smarthavenai.com
3. Validation method: DNS validation
4. Add CNAME records to DNS (provided by ACM)
5. Wait for validation (5-30 minutes)
6. Associate certificate with CloudFront distribution

### Deployment Script

Create `aws-deploy.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Deploying to AWS S3 + CloudFront..."

# Build
echo "📦 Building..."
npm run build

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://smarthavenai-app --delete \
  --exclude "index.html" \
  --cache-control "max-age=31536000,public"

# Upload index.html (no cache)
aws s3 cp dist/index.html s3://smarthavenai-app/index.html \
  --cache-control "max-age=0,no-cache,no-store,must-revalidate"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='smarthavenai-app.s3.amazonaws.com']].Id" --output text)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 URL: https://smarthavenai.com"
```

---

## 🔵 Option 4: Azure Static Web Apps

### Why Azure?

- **Integrated with GitHub**
- **Staging environments** for PRs
- **Free SSL** and CDN
- **Azure Functions** integration

### Deployment Steps

#### Step 1: Install Azure CLI

```bash
# macOS
brew install azure-cli

# Windows/Linux
# Download from https://aka.ms/installazurecliwindows
```

Login:

```bash
az login
```

#### Step 2: Create Static Web App

```bash
az staticwebapp create \
  --name transcript-parser \
  --resource-group MyResourceGroup \
  --source https://github.com/your-username/transcript-parser \
  --location "eastus2" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

#### Step 3: Configure GitHub Actions

Azure automatically creates `.github/workflows/azure-static-web-apps-xxx.yml`

Example workflow:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: '/'
          api_location: ''
          output_location: 'dist'
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
```

#### Step 4: Add Custom Domain

1. Azure Portal → Static Web Apps → Your App → Custom Domains
2. Add domain: smarthavenai.com
3. Follow DNS validation instructions

**DNS Configuration**:

```
Type    Name    Value                                          TTL
CNAME   @       your-app.azurestaticapps.net                  600
TXT     @       [validation token from Azure]                  600
```

---

## 📱 Option 5: Firebase Hosting (Google Cloud)

### Why Firebase?

- **Simple CLI deployment**
- **Global CDN** powered by Google
- **Free SSL**
- **Firebase integrations** (Auth, Firestore)

### Deployment Steps

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login and Initialize

```bash
# Login
firebase login

# Initialize project
firebase init
```

Select:

- Hosting
- Use existing project or create new
- Public directory: `dist`
- Single-page app: Yes
- GitHub Actions: Yes (optional)

#### Step 3: Configure Firebase

`firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### Step 4: Deploy

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

#### Step 5: Add Custom Domain

```bash
firebase hosting:channel:deploy live
```

Firebase Console:

1. Hosting → Add Custom Domain
2. Enter: smarthavenai.com
3. Follow verification steps
4. Add DNS records

**DNS Configuration**:

```
Type    Name    Value                              TTL
A       @       151.101.1.195                      600
A       @       151.101.65.195                     600
TXT     @       [verification token]               600
```

---

## 🏗️ Option 6: Hostinger (Covered in SPRINT_11_HOSTINGER_DEPLOYMENT.md)

See main deployment document for Hostinger-specific instructions.

---

## 🔐 Security Best Practices (All Platforms)

### Environment Variables

**Never commit sensitive data to Git**:

```bash
# .env.production (DO NOT COMMIT)
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Add to .gitignore
echo ".env.production" >> .gitignore
```

**Use platform-specific secret management**:

- Vercel: Environment Variables in dashboard
- Netlify: Environment Variables in settings
- AWS: AWS Secrets Manager or Systems Manager Parameter Store
- Azure: Azure Key Vault
- Firebase: Firebase Functions config

### CORS Configuration

If you add a backend API, configure CORS:

```javascript
// Express example
const cors = require('cors')
app.use(
  cors({
    origin: ['https://smarthavenai.com', 'https://www.smarthavenai.com'],
    credentials: true,
  })
)
```

### Security Headers

Already configured in `.htaccess` for Hostinger.

For other platforms, use platform-specific settings or edge functions.

---

## 🌍 DNS Configuration Summary

### If Using GoDaddy DNS (Before Transfer)

**For Vercel**:

```
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**For Netlify**:

```
A       @       75.2.60.5
CNAME   www     your-site.netlify.app
```

**For AWS CloudFront**:

```
CNAME   @       d111111abcdef8.cloudfront.net
CNAME   www     d111111abcdef8.cloudfront.net
```

**For Azure**:

```
CNAME   @       your-app.azurestaticapps.net
TXT     @       [validation token]
```

**For Firebase**:

```
A       @       151.101.1.195
A       @       151.101.65.195
TXT     @       [verification token]
```

### DNS Propagation

After changing DNS:

- **Minimum**: 5-10 minutes
- **Typical**: 1-4 hours
- **Maximum**: 48 hours (rare)

Check propagation:

```bash
# Command line
nslookup smarthavenai.com

# Online tools
https://www.whatsmydns.net/#A/smarthavenai.com
https://dnschecker.org/
```

---

## 💰 Cost Comparison

### Free Tier Limits

| Platform  | Free Tier | Bandwidth   | Build Minutes | Custom Domain |
| --------- | --------- | ----------- | ------------- | ------------- |
| Vercel    | Yes       | 100GB/month | Unlimited     | Yes           |
| Netlify   | Yes       | 100GB/month | 300 min/month | Yes           |
| Hostinger | No        | Varies      | N/A           | Yes           |
| AWS       | 12 months | 15GB/month  | N/A           | Yes           |
| Azure     | Yes       | 100GB/month | Unlimited     | Yes           |
| Firebase  | Yes       | 10GB/month  | N/A           | Yes           |

### Estimated Monthly Costs (Paid Tiers)

Assuming 10,000 users, 500GB bandwidth:

- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **Hostinger**: $3-12/month (depends on plan)
- **AWS**: ~$5-15/month (S3 + CloudFront)
- **Azure**: ~$10-20/month
- **Firebase**: ~$25/month (Blaze plan)

---

## 🎯 Recommended Platform by Use Case

### Best for Getting Started Fast

**→ Vercel** or **Netlify**

- Zero config
- GitHub integration
- Generous free tier

### Best for Full Control

**→ Hostinger**

- cPanel access
- FTP deployment
- Custom server configs

### Best for Enterprise

**→ AWS** or **Azure**

- Unlimited scalability
- Advanced features
- SLA guarantees

### Best for Firebase Users

**→ Firebase Hosting**

- Integrates with Firebase Auth, Firestore
- Google Cloud integration

---

## 📊 Multi-Region Deployment (Advanced)

For global users, deploy to multiple regions:

### Vercel Edge Network

- Automatic global CDN
- 70+ edge locations
- No configuration needed

### AWS Multi-Region

```bash
# Deploy to multiple S3 buckets
aws s3 sync dist/ s3://smarthavenai-us-east-1
aws s3 sync dist/ s3://smarthavenai-eu-west-1
aws s3 sync dist/ s3://smarthavenai-ap-south-1

# Use Route 53 for geo-routing
```

### Cloudflare (CDN Layer)

Works with any platform:

1. Add site to Cloudflare
2. Update nameservers
3. Enable CDN, DDoS protection, WAF
4. Free tier available

---

## 🔄 Continuous Integration / Continuous Deployment (CI/CD)

### GitHub Actions + Vercel

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD + Netlify

`.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist
  only:
    - main
```

---

## 🧪 Testing Deployment

After deploying to any platform:

### 1. Functional Tests

```bash
# Check homepage
curl -I https://smarthavenai.com
# Should return 200 OK

# Check HTTPS redirect
curl -I http://smarthavenai.com
# Should return 301 redirect to HTTPS

# Check assets load
curl https://smarthavenai.com/assets/index-[hash].js
# Should return JavaScript code
```

### 2. Performance Tests

**Lighthouse**:

```bash
npm install -g lighthouse
lighthouse https://smarthavenai.com --view
```

**WebPageTest**:

- Visit https://www.webpagetest.org/
- Enter URL: https://smarthavenai.com
- Run test from multiple locations

### 3. PWA Tests

**Chrome DevTools**:

1. Open https://smarthavenai.com
2. DevTools → Application tab
3. Check:
   - Manifest loads
   - Service worker registers
   - Install button appears

### 4. Cross-Browser Tests

- Chrome/Edge (Windows, macOS, Android)
- Firefox (Windows, macOS, Linux)
- Safari (macOS, iOS)

---

## 🎉 Post-Deployment Checklist

- [ ] Site loads at https://smarthavenai.com
- [ ] www redirects to non-www (or vice versa)
- [ ] HTTPS works (green padlock)
- [ ] All pages/routes accessible
- [ ] Video upload works
- [ ] Transcription works
- [ ] Export functions work
- [ ] Mobile responsive
- [ ] PWA install works
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Analytics/monitoring set up
- [ ] DNS fully propagated
- [ ] Custom domain configured
- [ ] Environment variables set
- [ ] Automated deployments working

---

## 📞 Support Resources

### Platform Support

- **Vercel**: https://vercel.com/support
- **Netlify**: https://www.netlify.com/support/
- **AWS**: https://aws.amazon.com/support/
- **Azure**: https://azure.microsoft.com/en-us/support/
- **Firebase**: https://firebase.google.com/support

### Community

- **Vercel Discord**: https://vercel.com/discord
- **Netlify Community**: https://community.netlify.com/
- **StackOverflow**: Tag with platform name

---

**Ready to Deploy to the Cloud?** Choose your platform and follow the steps! 🚀☁️
