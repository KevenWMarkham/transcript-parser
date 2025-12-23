# Expert Feedback: Architecture & Data Strategy

**Expert Profile**: Li Wei, Principal Architect
**Specialization**: Distributed Systems, Offline-First Architecture, Location-Based Services, Multi-Region Infrastructure
**Experience**: 16 years, former architect at Google Maps, led offline sync at Uber, advisor to Airbnb infrastructure team
**Review Date**: December 21, 2024
**Review Scope**: Epic 07 - Travel Module (architecture, data storage, sync strategy)

---

## 📋 Executive Summary

**Overall Assessment**: ⭐⭐⭐ (3/5) - Cloud-first approach problematic for travel use case, recommend offline-first hybrid

The Travel Module's current architecture (implied cloud-first with offline mode bolted on) is **backwards for travel**. Travel apps must be **offline-first by design**, not offline-capable as an afterthought. Given that travelers spend 60-80% of time offline (airplane mode, roaming avoidance, rural areas), combined with GPS tracking, large audio files, and cross-border data compliance, I strongly recommend an **offline-first, sync-when-online architecture** with multi-region deployment.

**Critical Architectural Challenges**:
1. **Offline is the norm** (not the exception) in travel
2. **Large data** (audio files 30-50 MB/hour, GPS tracks)
3. **Cross-border compliance** (GDPR, China, Russia data residency)
4. **Battery constraints** (GPS + recording + sync = battery killer)
5. **Network variability** (5G → 3G → No signal, unpredictable)

---

## 🏗️ Recommended Architecture: Offline-First, Sync-When-Online

### Core Principle
**App functions 100% offline. Cloud sync is background operation, opportunistic, user-controlled.**

### Why Offline-First for Travel?

**1. Travel Reality (Data from Personas)**:
- **Emma** (backpacker): No roaming, Wi-Fi only → Offline 80% of day
- **David** (business traveler): Airplane mode common → Offline 40% of day
- **Marco** (tour guide): Works in castles, countryside → Spotty signal
- **Robertsons** (family): Avoid €200 roaming bill → Offline most of trip

**2. Industry Benchmarks**:
- Google Maps: Downloaded maps work 100% offline (navigation, search, reviews)
- Spotify: Downloaded music works 100% offline
- Travel apps: Offline = table stakes, not premium feature

**3. Architecture Benefits**:
- **Performance**: Instant reads (no network latency)
- **Reliability**: Works in subway, airplane, mountains
- **Battery**: Sync on Wi-Fi only (save battery vs cellular upload)
- **Cost**: No roaming data charges for users

---

## 🎯 Proposed 3-Tier Architecture

### Tier 1: Offline-First Core (Free Tier)
```
Mobile Device (iOS/Android Native App)
├── Local SQLite Database (Core Data/Room)
│   ├── Trips (metadata, dates, locations)
│   ├── Recordings (audio files, metadata, GPS tracks)
│   ├── Transcripts (cached, from cloud AI when online)
│   ├── Recommendations (extracted, categorized)
│   └── User preferences (settings, language packs)
│
├── File System (Audio Storage)
│   ├── Recordings/ (M4A files, 30-50 MB/hour)
│   │   ├── prague_castle_tour.m4a (140 MB)
│   │   ├── food_tour.m4a (75 MB)
│   │   └── ...
│   └── Offline Assets/
│       ├── Language packs (Czech: 380 MB)
│       └── Map tiles (Prague: 120 MB)
│
├── Sync Queue (Background Service)
│   ├── Pending uploads (recordings waiting for Wi-Fi)
│   ├── Retry queue (failed uploads)
│   └── Conflict resolution (CRDT-based)
│
└── GPS Background Service
    ├── Location sampling (adaptive, battery-aware)
    ├── Geofencing (home exclusion, privacy)
    └── Offline GPS (works without internet)
```

**Offline Capabilities** (100% functional):
- ✅ Record audio (store locally, M4A compressed)
- ✅ Capture GPS (offline, no internet required)
- ✅ Play recordings (local files)
- ✅ View cached transcripts (if previously transcribed)
- ✅ Browse cached recommendations (if previously extracted)
- ✅ Edit recommendations manually (sync changes later)
- ✅ Search recordings/transcripts (local SQLite FTS)
- ✅ Export data (PDF, GPX, JSON)
- ✅ View maps (if tiles cached - Google Maps SDK offline mode)

**Cloud-Dependent** (requires internet):
- ❌ Transcription (requires cloud AI - Gemini/Whisper)
- ❌ AI recommendation extraction (requires cloud AI)
- ❌ Translation (requires cloud AI, unless on-device pack downloaded)
- ❌ Social media integration (requires API access)

**Sync Strategy**:
- **Wi-Fi only** (default): Upload recordings on Wi-Fi, save cellular data
- **Wi-Fi + Cellular** (opt-in): Upload on any connection, warn about data usage
- **Manual sync** (user control): Tap "Sync now" anytime

**Privacy**: 🔒 Maximum - Data on device until user chooses to sync

---

### Tier 2: Multi-Device Sync (Pro Tier, $5.99/month)
```
Primary Device (e.g., iPhone)
├── Local SQLite (primary storage)
│
└── Sync Engine (CRDT-based, conflict-free)
    ├── Sync to Cloud (end-to-end encrypted)
    │   └── Multi-Region Storage (compliance)
    │       ├── US: AWS S3 (us-east-1) - US residents
    │       ├── EU: AWS S3 (eu-central-1) - EU residents (GDPR)
    │       └── Asia: AWS S3 (ap-southeast-1) - Asian residents
    │
    └── Sync to Other Devices
        ├── iPad (secondary device)
        ├── Android phone (cross-platform)
        └── Web browser (view-only access)
```

**Cloud Infrastructure** (Multi-Region for Compliance):
```
Region-Specific Deployment (Data Residency)
├── US Region (AWS us-east-1)
│   ├── API Gateway + Lambda (serverless, auto-scale)
│   ├── S3 (audio storage, encrypted at rest)
│   ├── DynamoDB (metadata, fast reads)
│   └── CloudFront CDN (fast downloads)
│
├── EU Region (AWS eu-central-1)
│   ├── GDPR-compliant (data stays in EU)
│   ├── Same stack as US (S3, DynamoDB, Lambda)
│   └── Data Processing Agreement (DPA with AWS)
│
└── Asia Region (AWS ap-southeast-1)
    ├── Low latency for Asian travelers
    ├── Same stack
    └── (Exclude China/Russia - compliance too complex)

User routing:
- Auto-detect user region via GPS/IP
- Store data in nearest compliant region
- User can override (Settings → Data Region)
```

**Additional Features**:
- ✅ Sync across unlimited devices
- ✅ Web access (view recordings, transcripts)
- ✅ Cloud backup (disaster recovery)
- ✅ Sharing (send recommendations to friends)

**Privacy**: 🔒 High - End-to-end encrypted, multi-region compliance

---

### Tier 3: B2B Tour Guide (Marco Persona, $49/month)
```
Tour Guide Multi-User Dashboard
├── Guide Account (Marco)
│   ├── Unlimited recordings (9 hours/day)
│   ├── Performance analytics (AI-powered)
│   ├── Client CRM (preferences, allergies, repeat visits)
│   └── Training library (share recordings with staff)
│
├── Team Management
│   ├── Sub-accounts (5 trainee guides)
│   ├── Role-based access (admin, guide, trainee)
│   └── Shared recommendation database
│
└── Business Features
    ├── Auto-email generation (one-click send recommendations)
    ├── Calendar integration (Google Calendar, Outlook)
    ├── Payment processing (Stripe for tip/booking links)
    └── Custom branding (white-label option)

Cloud Infrastructure (Enhanced):
├── Dedicated database (PostgreSQL, not DynamoDB)
├── Real-time analytics (Datadog, monitoring)
├── Priority support (24/7 support team)
└── SLA (99.9% uptime guarantee)
```

**Benefits**:
- ✅ Unlimited storage (vs 5GB free tier)
- ✅ Advanced analytics (engagement scoring, FAQ tracking)
- ✅ CRM features (client profiles, repeat business)
- ✅ Team collaboration (train multiple guides)
- ✅ Priority transcription (< 5 min vs < 30 min)

---

## 🔐 End-to-End Encryption Strategy

### Why E2EE?
Travelers record **highly sensitive conversations**:
- Political views (dangerous in authoritarian countries)
- Sexual orientation (criminalized in 70+ countries)
- Medical info (HIV status, mental health)
- Financial data (discussing money, bank details)

**We (the company) should NOT be able to read recordings, even if stored on our servers.**

### Implementation

**1. Client-Side Encryption (Before Upload)**:
```typescript
// Generate encryption key from user passphrase
// Or use device-based key (secure enclave/keychain)

import { encrypt, decrypt } from '@noble/ciphers/aes-gcm';

// User's device generates 256-bit key (stored in secure keychain)
const encryptionKey = generateKeyFromDevice();

// Encrypt audio file before upload
const encryptedAudio = encrypt(audioFile, encryptionKey);

// Upload encrypted file (server can't decrypt)
await uploadToS3(encryptedAudio);

// Metadata encrypted separately (different key)
const metadataKey = deriveKey(encryptionKey, 'metadata');
const encryptedMetadata = encrypt(tripData, metadataKey);
```

**2. Server-Side (Zero Knowledge)**:
```
Server stores:
- Encrypted audio blobs (can't decrypt)
- Encrypted metadata (can't decrypt)
- User account info (email, hashed password)
- Public key (for sharing with other users)

Server CANNOT:
- Read transcripts
- Read recommendations
- Read GPS data
- Access plain-text audio
```

**3. Sharing Mechanism (End-to-End)**:
```typescript
// Marco wants to share recommendation with client

// Marco's device encrypts recommendation with recipient's public key
const recipientPublicKey = fetchPublicKey(clientEmail);
const sharedData = encryptWithPublicKey(recommendation, recipientPublicKey);

// Server relays encrypted data (can't read it)
await server.share(sharedData, recipientEmail);

// Client's device decrypts with their private key
const decryptedRecommendation = decryptWithPrivateKey(sharedData, privateKey);
```

**Trade-Offs**:
- ✅ Maximum privacy (server can't read data)
- ✅ Protection from hacks (encrypted blobs useless to attackers)
- ✅ Compliance (GDPR "privacy by design")
- ✗ No server-side search (encrypted data not searchable)
- ✗ No password recovery (lose key = lose data)
- ✗ Slower sync (encrypt/decrypt overhead)

**Recommendation**: Make E2EE **opt-in** for privacy-conscious users, not default (complexity trade-off).

---

## 📡 Sync Architecture (CRDT-Based Conflict Resolution)

### Challenge
User records tour on iPhone → Edits recommendations on iPad → Both sync to cloud → Conflict!

### Solution: Conflict-Free Replicated Data Types (CRDT)

**What is CRDT?**
- Data structure that guarantees eventual consistency without conflicts
- Multiple devices can edit offline, merge changes when online
- No "last write wins" (doesn't lose data)

**Example**:
```typescript
// User adds recommendation on iPhone (offline)
iPhone: trip.recommendations.add({ name: 'Café Neustadt', category: 'restaurant' });

// User adds different recommendation on iPad (offline)
iPad: trip.recommendations.add({ name: 'Letná Beer Garden', category: 'bar' });

// Both sync to cloud (no conflict)
Cloud merges: trip.recommendations = [
  { name: 'Café Neustadt', category: 'restaurant' },
  { name: 'Letná Beer Garden', category: 'bar' }
];

// Both devices receive merged state (no data loss)
```

**CRDT Libraries**:
- **Automerge**: Mature, good for JSON-like data
- **Yjs**: Fast, good for text (transcripts)
- **ElectricSQL**: Local-first with PostgreSQL sync

**Recommendation**: Use **Yjs** for transcripts (text), **Automerge** for trip metadata.

---

## 🗺️ GPS Data Architecture

### Challenge
GPS data is **continuous** (1 point every 5-30 seconds). Storage grows fast.

**3-Hour Tour Example**:
- High-frequency GPS (every 5 seconds): 3 hours = 2,160 points × 16 bytes = 34 KB
- Low-frequency GPS (every 30 seconds): 3 hours = 360 points × 16 bytes = 5.8 KB

**30-Day Trip** (2 hours recording/day):
- High-frequency: 20 MB GPS data
- Low-frequency: 3.5 MB GPS data

### Proposed GPS Data Model

**1. Sparse GPS Pings (Not Continuous)**:
```typescript
// Don't record GPS every second (wasteful, privacy risk)
// Record GPS only when:
// - Recording starts
// - Recommendation captured
// - Significant location change (>50m movement)
// - Recording ends

interface GPSPing {
  timestamp: number;        // Unix timestamp
  latitude: number;         // 8 bytes
  longitude: number;        // 8 bytes
  accuracy: number;         // Meters (GPS precision)
  event: 'start' | 'recommendation' | 'end'; // Why captured
}

// Example: 3-hour tour with 8 recommendations
const gpsPings = [
  { timestamp: 1700000000, lat: 50.0875, lon: 14.4213, event: 'start' },
  { timestamp: 1700000600, lat: 50.0878, lon: 14.4220, event: 'recommendation' }, // Café
  { timestamp: 1700001200, lat: 50.0881, lon: 14.4225, event: 'recommendation' }, // Museum
  // ...8 recommendations total...
  { timestamp: 1700010800, lat: 50.0890, lon: 14.4240, event: 'end' }
];

// Storage: 10 pings × 32 bytes = 320 bytes (vs 34 KB continuous)
```

**2. GPS Compression** (For Longer Trips):
```typescript
// Use Polyline encoding (Google Maps standard)
// Reduces GPS tracks by 90%

import { encode, decode } from '@mapbox/polyline';

const gpsTracks = [
  [50.0875, 14.4213],
  [50.0878, 14.4220],
  // ...1000 points...
];

// Encode to polyline string
const encoded = encode(gpsTracks, 5); // "_p~iF~ps|U_ulL..." (tiny string)

// Storage: 1000 points = 16 KB → Encoded = 1.5 KB (90% reduction)
```

**3. Privacy: Home Location Exclusion**:
```typescript
// Don't record GPS near home (stalking risk, privacy)

interface PrivacySettings {
  homeLocation: { lat: number; lon: number }; // User sets once
  homeRadius: number; // Default: 500m
}

function shouldRecordGPS(currentLocation: Location): boolean {
  const distanceFromHome = calculateDistance(currentLocation, homeLocation);

  if (distanceFromHome < homeRadius) {
    return false; // Don't record GPS near home
  }

  return true;
}
```

---

## 💾 Storage Strategy & Limits

### Free Tier Limits
```
Local Storage (Device):
- Audio files: 5 GB (≈ 100 hours recording)
- Transcripts: 500 MB (cached)
- Offline assets: 1 GB (language packs, map tiles)
- Total: ~6.5 GB

Cloud Storage (If Synced):
- Audio files: 5 GB
- Transcripts: 500 MB
- GPS data: 10 MB
- Total: 5.5 GB
```

### Pro Tier Limits
```
Cloud Storage:
- Audio files: Unlimited (pay-per-GB, $0.02/GB/month)
- Transcripts: Unlimited
- GPS data: Unlimited
- Total: Unlimited (reasonable use)
```

### Storage Cleanup (Auto-Delete)
```markdown
Settings → Storage

Automatic cleanup:
□ Delete recordings after successful transcription (save 5 GB)
□ Delete recordings older than: [30 days / 90 days / 1 year / Never]
□ Compress transcripts after 30 days (reduce size by 70%)

Manual cleanup:
- View storage usage by trip
- Delete individual recordings/trips
- "Free up space" wizard (suggests deletions)
```

---

## 🌐 Multi-Region Deployment (Compliance & Performance)

### Data Residency Requirements

**GDPR (EU)**:
- EU residents' data must stay in EU (or adequacy country)
- Cannot freely transfer to US (Schrems II)
- Solution: Store EU users' data in AWS eu-central-1 (Frankfurt)

**China (PIPL)**:
- Chinese users' data must stay in China
- Cross-border transfer requires approval
- Solution: **Don't operate in China** (too complex for MVP)

**Russia (Federal Law 242-FZ)**:
- Russian users' data must stay in Russia
- Solution: **Don't operate in Russia** (too complex)

### Proposed Multi-Region Architecture

**Region Routing**:
```typescript
// Route user to nearest compliant region

function getRegion(user: User): Region {
  if (user.ipCountry in EU_COUNTRIES) {
    return 'eu-central-1'; // Frankfurt (GDPR compliant)
  } else if (user.ipCountry in ASIA_COUNTRIES) {
    return 'ap-southeast-1'; // Singapore (low latency)
  } else {
    return 'us-east-1'; // US default
  }
}

// Store user's region preference (can override)
user.settings.dataRegion = 'eu-central-1'; // User choice
```

**Failover & Disaster Recovery**:
```
Primary Region: eu-central-1 (Frankfurt)
├── S3 (audio files, multi-AZ replication)
├── DynamoDB (metadata, global tables)
└── Lambda (API, auto-scale)

Backup Region: eu-west-1 (Ireland)
├── S3 replication (automatic, versioned)
├── DynamoDB replica (read-only)
└── Standby Lambda (activate on failure)

Disaster scenario:
- Frankfurt down → Route to Ireland (< 1 min failover)
- Data replicated (no loss)
- RTO: 5 minutes, RPO: 0 (zero data loss)
```

---

## 📊 Architecture Performance Benchmarks

| Metric | Target | Implementation |
|--------|--------|---------------|
| **App launch (offline)** | < 1 second | SQLite local, no network calls |
| **Recording start** | < 500ms | Local write, no cloud interaction |
| **Transcript search (local)** | < 100ms | SQLite FTS (full-text search) |
| **Sync upload (Wi-Fi)** | < 5 min for 90 MB | Resumable upload, 4G+ speeds |
| **GPS battery drain** | < 10%/hour | Adaptive sampling, low-power mode |
| **Storage efficiency** | 30 MB/hour recording | M4A compression, Opus for speech |

---

## 🎯 Priority Action Items

### CRITICAL (Foundational Architecture)
1. **Offline-first local storage** (SQLite/Core Data, not cloud-first)
2. **Sync queue system** (background upload, Wi-Fi preference)
3. **Multi-region deployment** (US, EU regions for compliance)
4. **GPS sparse sampling** (event-based, not continuous)
5. **End-to-end encryption** (client-side, zero-knowledge server)

### HIGH (Sprint 01-02)
6. **CRDT-based sync** (conflict-free multi-device editing)
7. **Resumable uploads** (handle network interruptions)
8. **Storage management** (auto-cleanup, compression)
9. **Privacy controls** (home exclusion, GPS opt-out)
10. **Battery optimization** (adaptive GPS, low-power mode)

### MEDIUM (Sprint 02-03)
11. **Web access** (read-only, view recordings/transcripts)
12. **Sharing mechanism** (end-to-end encrypted sharing)
13. **B2B multi-user** (team accounts, role-based access)
14. **Analytics** (performance monitoring, usage insights)

---

## ✅ Final Assessment

**Offline-First Design**: 3/10 (mentioned, not architected for it)
**Multi-Region Compliance**: 2/10 (not addressed)
**Sync Strategy**: 4/10 (needs CRDT, resumable uploads)
**Privacy Architecture**: 5/10 (E2EE not specified)
**Scalability**: 6/10 (serverless good, but offline-first needed)

**Overall**: ⭐⭐⭐ (3/5) - **Needs architectural rethink: offline-first, multi-region**

**Recommendation**:
Current implied cloud-first architecture will fail for travel use case:
- 60-80% of usage is offline → Cloud-first = broken experience
- Cross-border data transfer → GDPR violations, compliance risk
- Large audio files + cellular sync → Battery drain, data charges
- No CRDT → Multi-device conflicts, data loss

**Immediate Actions**:
1. Adopt offline-first architecture (Google Maps model, not cloud-first)
2. Multi-region deployment (US, EU at minimum for compliance)
3. CRDT-based sync (Yjs/Automerge for conflict-free editing)
4. GPS sparse sampling (event-based, privacy-aware)
5. E2EE implementation (client-side encryption, zero-knowledge server)

**Competitive Benchmark**:
- Google Maps: 100% offline navigation, search, reviews → **We must match this**
- Spotify: 100% offline playback → Our transcripts must work offline
- Notion: Local-first with cloud sync → Our architecture should mirror this

**Architecture is product strategy.** Offline-first = traveler-first = product-market fit.

---

**Reviewed by**: Li Wei, Principal Architect
**Date**: December 21, 2024
**Next Review**: After architectural decision (offline-first vs cloud-first)
**Recommendation**: Prototype offline-first sync in Sprint 01, test with real travelers
