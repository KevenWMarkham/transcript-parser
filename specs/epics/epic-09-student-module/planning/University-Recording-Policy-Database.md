# University Recording Policy Database: Implementation Plan

**Feature**: Automated university policy scraping and compliance guidance
**Priority**: Medium-High (unique differentiator, legal risk mitigation)
**Timeline**: Sprint 02-03 (after core features stable)
**Estimated Effort**: 13-21 story points

---

## 🎯 Executive Summary

Create a comprehensive database of lecture recording policies for 1,000+ U.S. universities (expandable to international). Help students understand:
- Is recording allowed at their university?
- Do they need permission (professor, classmates)?
- What disability accommodations are available?
- Where to find official policies?

**Unique Value Proposition**: No other transcript tool provides university-specific policy guidance. This builds trust and reduces legal risk for students.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    University Policy Database                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
┌──────────────────────┐              ┌──────────────────────┐
│   Data Collection    │              │   Student-Facing     │
│      Pipeline        │              │       Features       │
└──────────────────────┘              └──────────────────────┘
          │                                       │
          │                                       │
    ┌─────┴─────┐                         ┌──────┴──────┐
    │           │                         │             │
    ▼           ▼                         ▼             ▼
┌────────┐  ┌────────┐              ┌─────────┐  ┌──────────┐
│ Web    │  │ Human  │              │ Policy  │  │ In-App   │
│Scraper │  │Verify  │              │ Search  │  │ Guidance │
└────────┘  └────────┘              └─────────┘  └──────────┘
    │           │                         │             │
    │           │                         │             │
    └───────────┴─────────────────────────┴─────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   PostgreSQL Database  │
              │   + Full-Text Search   │
              └────────────────────────┘
```

---

## 📊 Database Schema

### Table: `universities`
```sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100), -- e.g., "UC Berkeley", "MIT"
  country VARCHAR(2) DEFAULT 'US', -- ISO country code
  state VARCHAR(2), -- US states only
  type VARCHAR(50), -- 'public' | 'private' | 'community'

  -- Contact Information
  website_url TEXT,
  disability_services_email VARCHAR(255),
  disability_services_phone VARCHAR(50),

  -- Metadata
  student_population INTEGER,
  carnegie_classification VARCHAR(100), -- R1, R2, etc.

  -- Search & Display
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(short_name, ''))
  ) STORED,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  CONSTRAINT unique_university_name UNIQUE(name, country)
);

CREATE INDEX idx_universities_search ON universities USING GIN(search_vector);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_state ON universities(state);
```

### Table: `recording_policies`
```sql
CREATE TABLE recording_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,

  -- Policy Details
  recording_allowed VARCHAR(50) NOT NULL,
    -- 'yes' | 'no' | 'permission_required' | 'disability_only' | 'varies_by_college'

  consent_required VARCHAR(50),
    -- 'none' | 'professor_only' | 'all_participants' | 'written_form'

  -- Policy Documentation
  policy_text TEXT, -- Extracted policy language
  policy_url TEXT, -- Source URL
  policy_effective_date DATE,

  -- Restrictions
  restrictions JSONB, -- Array of restriction objects
  -- Example: [
  --   { "type": "medical_courses", "reason": "HIPAA privacy", "allowed": false },
  --   { "type": "law_school", "reason": "Socratic method", "allowed": "permission_required" }
  -- ]

  -- Verification
  data_source VARCHAR(50), -- 'web_scraper' | 'human_verified' | 'crowdsourced' | 'university_official'
  verified_by VARCHAR(255), -- User ID or 'scraper_v1.0'
  verified_date TIMESTAMP,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00 (scraper confidence)

  -- Versioning
  version INTEGER DEFAULT 1,
  superseded_by UUID REFERENCES recording_policies(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_current_policy UNIQUE(university_id)
    WHERE superseded_by IS NULL
);

CREATE INDEX idx_policies_university ON recording_policies(university_id);
CREATE INDEX idx_policies_verified ON recording_policies(verified_date DESC);
```

### Table: `disability_accommodations`
```sql
CREATE TABLE disability_accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,

  -- Accommodation Types
  note_taker_provided BOOLEAN DEFAULT FALSE,
  recording_allowed BOOLEAN DEFAULT FALSE,
  transcription_services BOOLEAN DEFAULT FALSE,
  extended_time_exams BOOLEAN DEFAULT FALSE,
  assistive_technology BOOLEAN DEFAULT FALSE,

  -- Registration Process
  registration_required BOOLEAN DEFAULT TRUE,
  documentation_required BOOLEAN DEFAULT TRUE,
  registration_url TEXT,

  -- Additional Details
  accommodation_details JSONB,
  -- Example: {
  --   "note_taker": { "description": "Peer note-taker assigned", "how_to_request": "..." },
  --   "recording": { "description": "Audio recording permitted with DSP letter", "restrictions": "..." }
  -- }

  -- Source
  source_url TEXT,
  last_verified TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_university_accommodations UNIQUE(university_id)
);
```

### Table: `policy_updates`
```sql
CREATE TABLE policy_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,

  -- Change Tracking
  field_changed VARCHAR(100), -- 'recording_allowed', 'consent_required', etc.
  old_value TEXT,
  new_value TEXT,

  -- Source of Change
  changed_by VARCHAR(255), -- 'scraper', 'admin_user_123', 'student_report'
  change_reason TEXT,
  evidence_url TEXT,

  -- Review
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_policy_updates_university ON policy_updates(university_id);
CREATE INDEX idx_policy_updates_reviewed ON policy_updates(reviewed, created_at);
```

### Table: `crowdsourced_reports`
```sql
CREATE TABLE crowdsourced_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,

  -- Report Details
  reported_by UUID REFERENCES users(id), -- Student who reported
  report_type VARCHAR(50), -- 'policy_incorrect' | 'policy_updated' | 'new_restriction'

  -- Current vs Reported
  current_policy JSONB, -- Snapshot of current policy
  reported_policy JSONB, -- What student says it should be

  -- Evidence
  description TEXT,
  evidence_url TEXT, -- Student provides link to policy page
  evidence_screenshot TEXT, -- S3 URL to screenshot (optional)

  -- Voting
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'verified' | 'rejected' | 'duplicate'
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  admin_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON crowdsourced_reports(status, created_at);
CREATE INDEX idx_reports_university ON crowdsourced_reports(university_id);
```

---

## 🤖 Web Scraping Pipeline

### Phase 1: Target Identification

**Data Source**: U.S. Department of Education - Integrated Postsecondary Education Data System (IPEDS)
- **URL**: https://nces.ed.gov/ipeds/datacenter/
- **Data**: List of all accredited U.S. universities (4,000+)
- **Export**: CSV with name, website, location, type

**Priority Order**:
```typescript
const universityPriority = [
  // Tier 1: Top 100 universities by student population (80% of users)
  { rank: 1, count: 100, reason: "Largest student populations" },

  // Tier 2: R1 Research universities (PhD students like Marcus)
  { rank: 2, count: 150, reason: "Carnegie R1 classification" },

  // Tier 3: State flagship universities
  { rank: 3, count: 50, reason: "One per state" },

  // Tier 4: Community colleges (accessibility focus)
  { rank: 4, count: 200, reason: "Diverse student populations" },

  // Tier 5: Remaining accredited universities
  { rank: 5, count: 3500, reason: "Long-tail coverage" }
];

// Total: ~4,000 universities
// Sprint 02: Top 100 (covers 80% of students)
// Sprint 03: Top 500 (covers 95% of students)
// Post-launch: All 4,000
```

---

### Phase 2: Web Scraping Strategy

**Technology Stack**:
```typescript
// Scraping & Automation
import { chromium } from 'playwright'; // Headless browser
import * as cheerio from 'cheerio'; // HTML parsing
import axios from 'axios'; // HTTP requests

// AI-Powered Extraction
import Anthropic from '@anthropic-ai/sdk'; // Claude for policy analysis
import { OpenAI } from 'openai'; // GPT-4 alternative

// Data Storage
import { db } from './db'; // Drizzle ORM + PostgreSQL

// Job Queue
import { Queue } from 'bullmq'; // Background job processing
import Redis from 'ioredis'; // Job queue backend
```

**Scraping Algorithm**:
```typescript
async function scrapeUniversityPolicies(university: University) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'TranscriptParserBot/1.0 (Educational Research; contact@transcriptparser.com)'
  });
  const page = await context.newPage();

  // Step 1: Find policy pages via sitemap or search
  const policyUrls = await findPolicyPages(university, page);

  // Step 2: Scrape each policy page
  const scrapedPolicies = [];
  for (const url of policyUrls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Extract text content
      const pageContent = await page.evaluate(() => {
        // Remove nav, footer, ads
        const main = document.querySelector('main') || document.body;
        return main.innerText;
      });

      // AI-powered policy extraction
      const extractedPolicy = await extractPolicyWithAI(pageContent, url);

      scrapedPolicies.push({
        url,
        content: pageContent,
        extracted: extractedPolicy
      });

      // Rate limiting: 1 request per 2 seconds
      await sleep(2000);

    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      // Log failure for human review
      await db.insert(scrapingErrors).values({
        universityId: university.id,
        url,
        error: error.message,
        needsHumanReview: true
      });
    }
  }

  await browser.close();
  return scrapedPolicies;
}

async function findPolicyPages(university: University, page: any) {
  const searches = [
    // Strategy 1: Sitemap
    `${university.websiteUrl}/sitemap.xml`,

    // Strategy 2: Common paths
    `${university.websiteUrl}/policies/recording`,
    `${university.websiteUrl}/student-handbook`,
    `${university.websiteUrl}/disability-services`,
    `${university.websiteUrl}/accessibility`,

    // Strategy 3: Google search (last resort)
    `site:${university.domain} "lecture recording policy"`,
    `site:${university.domain} "disability services" "note taker"`,
  ];

  // Try each strategy, return first success
  for (const search of searches) {
    const urls = await tryFindPolicy(search, page);
    if (urls.length > 0) return urls;
  }

  return []; // No policy found (human review needed)
}
```

---

### Phase 3: AI-Powered Policy Extraction

**Claude Prompt** (optimized for policy analysis):
```typescript
async function extractPolicyWithAI(pageContent: string, sourceUrl: string) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `You are an expert policy analyst helping students understand university lecture recording policies.

TASK: Analyze this university policy page and extract key information.

PAGE CONTENT:
${pageContent.slice(0, 8000)} // Limit to ~8k tokens

PAGE URL: ${sourceUrl}

EXTRACT:
1. Recording Allowed?
   - Answer: "yes" | "no" | "permission_required" | "disability_only" | "unclear"
   - Exact quote from policy (if found)
   - Confidence (0.0 to 1.0)

2. Consent Requirements?
   - Answer: "none" | "professor_only" | "all_participants" | "written_form" | "unclear"
   - Exact quote from policy (if found)
   - Confidence (0.0 to 1.0)

3. Disability Accommodations?
   - Note-taker provided: yes/no/unclear
   - Recording allowed with accommodation letter: yes/no/unclear
   - How to register: URL or description
   - Exact quote from policy (if found)

4. Restrictions?
   - List any course types or situations where recording is prohibited
   - Example: "Medical courses (HIPAA)", "Law school exams (honor code)"

5. Policy Last Updated?
   - Date (if mentioned in page)

OUTPUT FORMAT (JSON):
{
  "recordingAllowed": "permission_required",
  "recordingQuote": "Students may record lectures with instructor permission...",
  "recordingConfidence": 0.95,

  "consentRequired": "professor_only",
  "consentQuote": "Prior approval from the instructor is required...",
  "consentConfidence": 0.90,

  "disabilityAccommodations": {
    "noteTakerProvided": true,
    "recordingAllowed": true,
    "registrationUrl": "https://...",
    "quote": "Students registered with Disability Services may record lectures..."
  },

  "restrictions": [
    { "type": "medical_courses", "reason": "Patient privacy (HIPAA)", "allowed": false }
  ],

  "policyDate": "2023-08-15",

  "overallConfidence": 0.88,
  "humanReviewNeeded": false,
  "humanReviewReason": null
}

INSTRUCTIONS:
- Only extract information EXPLICITLY stated in the text
- If unclear or contradictory, set confidence < 0.7 and humanReviewNeeded = true
- Provide exact quotes to support each conclusion
- Be conservative: if unsure, mark for human review`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    temperature: 0, // Deterministic for policy extraction
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].text;

  // Parse JSON response
  const extracted = JSON.parse(responseText);

  return extracted;
}
```

**Cost Analysis**:
```
Per university:
- 3 pages scraped avg (student handbook, disability services, IT policy)
- 8,000 tokens input × 3 pages = 24k tokens
- 1,500 tokens output × 3 pages = 4.5k tokens
- Claude Sonnet: $3/million input, $15/million output
- Cost per university: (24k × $3 + 4.5k × $15) / 1M = $0.14

For 100 universities (Sprint 02):
- Total cost: $14
- Processing time: ~30 min (with rate limiting)

For 1,000 universities (post-launch):
- Total cost: $140
- Processing time: ~5 hours (parallelized with 10 workers)

AFFORDABLE ✅
```

---

### Phase 4: Human Verification Pipeline

**Why Needed**:
- AI confidence < 0.7 (unclear policies)
- Contradictory information found
- Critical universities (top 20)
- Legal risk (verify before showing to students)

**Human Verification Workflow**:
```typescript
interface VerificationTask {
  id: string;
  universityId: string;
  universityName: string;

  // AI Extraction
  aiExtractedPolicy: PolicyExtraction;
  aiConfidence: number;
  sourceUrls: string[];
  pageContent: string[];

  // For Human Reviewer
  questionForReviewer: string;
  reviewPriority: 'high' | 'medium' | 'low';

  // Review Result
  humanVerifiedPolicy?: PolicyExtraction;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

// Example verification task
const task: VerificationTask = {
  id: 'verify-123',
  universityId: 'ucb-001',
  universityName: 'UC Berkeley',

  aiExtractedPolicy: {
    recordingAllowed: 'permission_required',
    confidence: 0.65 // LOW - needs human review
  },

  questionForReviewer: `
    AI found two conflicting policies:
    1. Student Handbook (2022): "Recording requires instructor permission"
    2. Disability Services (2023): "Recording allowed for registered students"

    Which is correct? Or do both apply?
  `,

  reviewPriority: 'high', // UC Berkeley = high priority
  sourceUrls: [
    'https://studentconduct.berkeley.edu/handbook',
    'https://dsp.berkeley.edu/accommodations'
  ]
};
```

**Reviewer Interface** (Admin Dashboard):
```typescript
// Admin sees:
// - University name
// - AI's best guess (highlighted in yellow if confidence < 0.7)
// - Original policy text (with relevant sections highlighted)
// - Links to source pages
// - Question from AI ("Which policy is current?")

// Reviewer actions:
// 1. Confirm AI extraction (if correct)
// 2. Correct AI extraction (edit fields)
// 3. Add notes (e.g., "Policy updated Sept 2023, replaces 2022 version")
// 4. Flag for legal review (if risky)

// After review:
// - Policy marked as "human_verified"
// - Confidence set to 1.0
// - Shown to students with "✓ Verified" badge
```

**Who Does Verification**:
- **Law school students** (paid internship, 10-15 hours/week)
- **EdTech compliance specialists** (contractors)
- **University disability services staff** (partnerships - they provide official policies)

**Verification SLA**:
- High priority (top 100 universities): 48 hours
- Medium priority (top 500): 1 week
- Low priority (remaining): 1 month

---

### Phase 5: Crowdsourcing & Community Validation

**Upvote/Downvote System**:
```typescript
// Students can report incorrect policies
interface PolicyFeedback {
  universityId: string;
  currentPolicy: PolicyExtraction;

  feedbackType: 'correct' | 'incorrect' | 'outdated' | 'missing_info';
  studentComment?: string;
  evidenceUrl?: string; // Student provides link to updated policy

  votedBy: string; // Student user ID
  voteType: 'upvote' | 'downvote';
}

// If 5+ students report a policy as incorrect:
// → Trigger re-scraping
// → Flag for human review
// → Notify admin team

// If 10+ students upvote a policy as correct:
// → Increase confidence score
// → Add "✓ Verified by 10 students" badge
```

**Incentives for Student Reports**:
- **Gamification**: "Earn points for accurate policy reports"
- **Leaderboard**: "Top 10 policy contributors this month"
- **Rewards**: "100 reports = 1 month Pro subscription free"

---

## 🎨 Student-Facing Features

### Feature 1: Policy Checker (Onboarding)

**When**: Student creates account → selects university

**UI Flow**:
```
Step 1: Select Your University
┌────────────────────────────────────────┐
│ 🎓 Which university do you attend?     │
│                                        │
│ [Search: Type university name...]     │
│                                        │
│ Popular:                               │
│ • UC Berkeley                          │
│ • Stanford University                  │
│ • MIT                                  │
│ • University of Texas at Austin       │
│                                        │
│ [Show all 1,000+ universities ▼]      │
└────────────────────────────────────────┘

Step 2: Recording Policy for [University Name]
┌────────────────────────────────────────┐
│ 📋 Recording Policy at UC Berkeley     │
│                                        │
│ ⚠️ Recording Allowed: With Permission  │
│ You must notify your professor before  │
│ recording lectures.                    │
│                                        │
│ 👥 Consent Required: Professor only    │
│ Written consent not required, but      │
│ verbal notification is recommended.    │
│                                        │
│ ♿ Disability Services Available        │
│ If you have a documented disability,   │
│ you may be eligible for:               │
│ • Note-taker services                  │
│ • Audio recording accommodation        │
│ • Extended time on exams               │
│                                        │
│ 📞 Contact: dsp@berkeley.edu           │
│                                        │
│ [View Full Policy]  [Report Incorrect] │
│                                        │
│ ✓ Verified by 47 students              │
│ Last updated: Sept 15, 2023            │
└────────────────────────────────────────┘

Step 3: Pre-Recording Checklist (Optional)
┌────────────────────────────────────────┐
│ ✅ Before Recording Your First Lecture │
│                                        │
│ Based on UC Berkeley's policy:         │
│                                        │
│ ☐ Notify your professor you'll be     │
│   recording (email or in-person)       │
│                                        │
│ ☐ Confirm recording is for personal   │
│   study use only (don't share publicly)│
│                                        │
│ ☐ If registered with Disability       │
│   Services, provide accommodation      │
│   letter to professor                  │
│                                        │
│ [I understand] [Skip for now]          │
└────────────────────────────────────────┘
```

---

### Feature 2: In-App Guidance (Recording Screen)

**When**: Student starts recording a lecture

**UI**:
```
┌────────────────────────────────────────┐
│ 🎙️ Record Lecture                      │
│                                        │
│ Course: Biology 101                    │
│ Professor: Dr. Smith                   │
│                                        │
│ ⚠️ Reminder: UC Berkeley Policy         │
│ Have you notified Dr. Smith about      │
│ recording this lecture?                │
│                                        │
│ [ ] Yes, professor is aware            │
│ [ ] No, but I will mention it          │
│ [ ] I have disability accommodation    │
│ [ ] Don't show this again              │
│                                        │
│ [Start Recording] [Cancel]             │
└────────────────────────────────────────┘
```

**Smart Reminders**:
- Show policy reminder for **first 3 recordings only** (then dismiss)
- **If disability accommodations**: Show different message
- **If university policy = "no recording"**: Warning dialog before allowing recording
  - "Your university policy prohibits recording. Proceed at your own risk. [Continue] [Cancel]"

---

### Feature 3: Policy Search & Browse

**URL**: `/policies` or `/universities`

**Features**:
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 University Recording Policies                        │
│                                                         │
│ [Search universities...]                                │
│                                                         │
│ Filter by:                                              │
│ [ ] Recording Allowed (342 universities)                │
│ [ ] Permission Required (521 universities)              │
│ [ ] Disability Only (89 universities)                   │
│ [ ] No Recording (43 universities)                      │
│ [ ] Policy Unclear (5 universities)                     │
│                                                         │
│ Filter by State: [All States ▼]                         │
│ Filter by Type: [All Types ▼] Public / Private / CC    │
│                                                         │
│ Results: 1,000 universities                             │
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ UC Berkeley - Berkeley, CA                         │   │
│ │ ⚠️ Permission Required | 👥 Professor consent       │   │
│ │ ♿ Disability services available                    │   │
│ │ ✓ Verified | Last updated: Sept 2023              │   │
│ │ [View Details →]                                   │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ┌───────────────────────────────────────────────────┐   │
│ │ MIT - Cambridge, MA                                │   │
│ │ ✅ Recording Allowed | 👥 No consent needed         │   │
│ │ ♿ Disability services available                    │   │
│ │ ✓ Verified | Last updated: Aug 2023               │   │
│ │ [View Details →]                                   │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ [Load More...]                                          │
└─────────────────────────────────────────────────────────┘
```

**Value**:
- **Comparison shopping** (students considering multiple universities)
- **Transfer students** (moving from one university to another)
- **Transparency** (builds trust in our product)
- **SEO value** (rank for "can I record lectures at [university]")

---

## 📅 Implementation Timeline

### Sprint 02 (Week 1-2)
**Goal**: MVP with top 100 universities

**Tasks**:
- [ ] Database schema design & migration (2 pts)
- [ ] Web scraper infrastructure (Playwright, BullMQ) (3 pts)
- [ ] AI policy extraction (Claude integration, prompt engineering) (3 pts)
- [ ] Scrape top 100 universities (1 pt - mostly automated)
- [ ] Human verification dashboard (admin panel) (3 pts)
- [ ] Student-facing: University selector in onboarding (2 pts)
- [ ] Student-facing: Policy display on profile page (1 pt)

**Total**: 15 story points

---

### Sprint 03 (Week 1-2)
**Goal**: Expand to 500 universities, add features

**Tasks**:
- [ ] Scrape additional 400 universities (2 pts - parallelized)
- [ ] Human verification of top 200 (hire law student interns) (2 pts)
- [ ] Crowdsourcing: Report incorrect policy (2 pts)
- [ ] Crowdsourcing: Upvote/downvote policies (1 pt)
- [ ] In-app recording guidance (policy reminder) (2 pts)
- [ ] Policy search & browse page (3 pts)
- [ ] SEO optimization (landing pages per university) (2 pts)

**Total**: 14 story points

---

### Post-Launch (Ongoing)
**Goal**: Maintain database, expand to all 4,000 universities

**Tasks**:
- [ ] Scrape remaining 3,500 universities (6 pts over 3 months)
- [ ] Automated re-scraping (quarterly updates) (3 pts)
- [ ] Human verification workflow (ongoing, 10 hrs/week law student)
- [ ] Community management (review crowdsourced reports) (5 hrs/week)
- [ ] International expansion (UK, Canada, Australia) (future epic)

---

## 💰 Cost Analysis

### One-Time Costs (Setup)

| Item | Cost | Notes |
|------|------|-------|
| AI extraction (1,000 universities) | $140 | Claude Sonnet, 3 pages/university |
| Scraping infrastructure | $0 | Open-source tools (Playwright, BullMQ) |
| Database hosting | $25/mo | PostgreSQL on Render/Railway (first month) |
| Human verification (top 200) | $500 | Law students @ $25/hr, 20 hrs |
| **Total** | **$665** | |

### Ongoing Costs (Monthly)

| Item | Cost | Notes |
|------|------|-------|
| Database hosting | $25 | PostgreSQL |
| Scraping server | $20 | Background workers (BullMQ, Redis) |
| AI re-scraping (quarterly updates) | $12 | 1,000 universities / 3 months = 333/mo × $0.14 |
| Human verification | $100 | Law student intern, 4 hrs/week |
| **Total** | **$157/mo** | |

**Annual Cost**: ~$2,000 (very affordable for 1,000 universities)

---

## 📈 Success Metrics

### Quantitative
- **Coverage**: 1,000+ U.S. universities (95%+ of students)
- **Accuracy**: 95%+ policy accuracy (verified by students)
- **Freshness**: Policies updated quarterly
- **User engagement**: 70%+ of students view policy during onboarding
- **Crowdsourcing**: 500+ student policy reports per month

### Qualitative
- **Trust**: Students feel confident recording is legal/appropriate
- **Differentiation**: Only transcript tool with university policy database
- **SEO**: Rank #1 for "[university name] lecture recording policy"
- **Partnerships**: Universities link to our policy database

---

## 🎯 Competitive Advantage

### No Other Tool Has This
- **Otter.ai**: No university policy guidance
- **Notion AI**: No education-specific features
- **Zoom**: Generic recording, no university context
- **Tape.ai**: No policy database

**We become the trusted source** for students asking:
- "Can I record lectures at my university?"
- "Do I need to ask permission?"
- "What if I have dyslexia - can I get accommodations?"

**SEO Opportunity**: Create landing pages for each university:
- `/universities/uc-berkeley-recording-policy`
- `/universities/mit-recording-policy`
- Rank for long-tail searches → drive organic traffic

---

## ⚠️ Legal Considerations

### Disclaimer (Required)
```
This information is provided for educational purposes only
and does not constitute legal advice. University policies
may change. Students should verify current policies with
their institution before recording. Transcript Parser is
not responsible for any consequences of recording lectures
in violation of university policy.
```

### Risk Mitigation
1. **Always cite sources** (link to official policy page)
2. **Show last updated date** (transparency)
3. **Encourage verification** ("Confirm with your professor")
4. **Crowdsource corrections** (students help keep policies current)
5. **Human review** for top universities (reduce errors)

---

## 🔗 Related Documents

- [Architecture Expert Feedback](./expert-feedback/Expert%20Feedback%20-%20Architecture.md) - Original idea source
- [Privacy & Security Expert Feedback](./expert-feedback/Expert%20Feedback%20-%20Privacy%20&%20Security.md) - Compliance considerations
- [Sprint 02 User Stories](./user-stories/Sprint%2002%20-%20Advanced%20Features.md) - Implementation sprint

---

**Created**: December 21, 2024
**Status**: Planning (not yet implemented)
**Next Steps**: Review with team, prioritize for Sprint 02 or later
