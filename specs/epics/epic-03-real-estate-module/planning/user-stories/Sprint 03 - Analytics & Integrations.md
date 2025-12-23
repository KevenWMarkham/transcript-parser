# Sprint 03: Analytics & Integrations - Real Estate Module

**Epic**: Epic 03 - Real Estate Module
**Sprint**: 03 of 3
**Duration**: 6 weeks
**Sprint Goal**: Enterprise CRM integrations, Fair Housing compliance AI, advanced analytics, and market readiness

---

## 📊 Sprint Overview

### Story Points Breakdown
- **Total Points**: 76
- **Critical (Legal/Compliance)**: 34 points (Fair Housing, MLS compliance)
- **High Priority (CRM Integration)**: 28 points (Zillow, Salesforce, AppFolio, HomeGauge)
- **Medium Priority (Analytics)**: 14 points (Usage tracking, performance metrics)

### Success Criteria
✅ Fair Housing AI detection prevents $16K-$65K violations
✅ CRM integration achieves 3x adoption rate (auto-sync vs. manual export)
✅ MLS compliance verified by legal team (no data restriction violations)
✅ Wire fraud prevention saves $680K (Amanda's closing scenario)
✅ Multi-speaker diarization identifies 6-8 people in closings (95%+ accuracy)

---

## 🔴 Critical Priority Stories (Legal/Compliance)

### Story 1: Fair Housing AI Detection & Redaction
**Story Points**: 21
**Persona**: Lisa, Carmen (Fair Housing compliance)
**Priority**: CRITICAL (Legal liability)

#### User Story
```
As a real estate agent or property manager conducting client/tenant interactions
I want AI to automatically detect and flag potential Fair Housing violations
So that I can review and redact problematic language before sharing transcripts or facing $16K-$65K fines
```

#### Acceptance Criteria
- [ ] **Protected Class Detection**: AI identifies mentions of protected classes:
  - [ ] Race, color, national origin
  - [ ] Religion
  - [ ] Sex, gender identity, sexual orientation
  - [ ] Familial status (children, pregnancy)
  - [ ] Disability (physical, mental)
  - [ ] Source of income (in applicable jurisdictions)
- [ ] **Contextual Analysis**: AI distinguishes between:
  - [ ] Neutral mentions ("property near Temple Beth Shalom") - OK
  - [ ] Discriminatory statements ("Don't show them properties in that neighborhood") - VIOLATION
  - [ ] Steering ("You'd fit better in this area") - VIOLATION
  - [ ] Preference enforcement ("Owner prefers no children") - VIOLATION
- [ ] **Real-Time Warnings** (During Recording):
  - [ ] Pop-up alert: "⚠️ FAIR HOUSING ALERT: You mentioned [protected class]. Review for compliance."
  - [ ] Non-blocking (doesn't stop recording)
  - [ ] Log timestamp for post-recording review
- [ ] **Post-Recording Review**:
  - [ ] Flagged segments highlighted in transcript
  - [ ] Severity level: Low (neutral mention) / Medium (unclear) / High (likely violation)
  - [ ] Suggested actions: "Consider redacting" / "Review with compliance officer" / "Do not share externally"
  - [ ] Legal reference: Link to HUD Fair Housing Act guidance
- [ ] **Auto-Redaction Options**:
  - [ ] "Redact all protected class mentions" (conservative approach)
  - [ ] "Redact medium/high severity only" (balanced)
  - [ ] "Manual review only" (agent decides)
  - [ ] Preview redacted transcript before finalizing
- [ ] **Compliance Reporting**:
  - [ ] Brokerage dashboard: "15 Fair Housing alerts this month (12 resolved, 3 pending review)"
  - [ ] Training recommendations: "Agent Lisa triggered 3 alerts - recommend Fair Housing refresher"
  - [ ] Audit trail: All flags and resolutions logged for legal defense

#### Fair Housing Violation Examples (AI Training Data)

**Discriminatory Statements** (HIGH severity):
- "This neighborhood is changing, you wouldn't like it" (race/national origin)
- "This building is mostly young professionals, not families" (familial status)
- "The landlord prefers working tenants, not Section 8" (source of income)
- "You'd be more comfortable in a different area" (steering)
- "The owner wants stable tenants without kids" (familial status)

**Neutral Mentions** (LOW severity):
- "This property is near St. Mary's Church and Temple Emanuel" (religion - factual)
- "The neighborhood has excellent schools for families" (familial status - not discriminatory)
- "This building has wheelchair ramps and accessible units" (disability - positive compliance)
- "The community center offers Spanish language services" (national origin - factual resource)

**Unclear Context** (MEDIUM severity - requires human review):
- "This is a quiet, adult-oriented community" (could be age discrimination or legitimate senior housing)
- "The landlord is very selective about tenants" (could be discriminatory screening or legitimate creditworthiness)
- "This area has a strong sense of community" (could be steering or factual neighborhood description)

#### Technical Implementation

```python
# Fair Housing AI Detection System

from transformers import pipeline
import re
from typing import List, Dict

class FairHousingDetector:
    def __init__(self):
        # Use fine-tuned model on Fair Housing training data
        self.classifier = pipeline(
            "text-classification",
            model="fairhousing-bert-base",  # Custom model
            device=0  # GPU
        )

        self.protected_classes = {
            'race': ['race', 'color', 'ethnic', 'African American', 'Hispanic', 'Asian', 'white', 'Black'],
            'religion': ['Christian', 'Jewish', 'Muslim', 'Catholic', 'church', 'temple', 'mosque'],
            'familial_status': ['children', 'kids', 'family', 'pregnant', 'single mother', 'daycare'],
            'disability': ['disabled', 'wheelchair', 'mental health', 'handicap', 'accessible'],
            'sex': ['male', 'female', 'gender', 'LGBTQ', 'gay', 'lesbian', 'transgender'],
            'national_origin': ['immigrant', 'foreign', 'accent', 'nationality', 'Spanish', 'English'],
            'source_of_income': ['Section 8', 'voucher', 'welfare', 'disability benefits', 'SSI']
        }

    def analyze_transcript(self, transcript: str) -> List[Dict]:
        """
        Analyze transcript for Fair Housing violations
        Returns: List of flagged segments with severity and recommendations
        """
        segments = self._split_into_segments(transcript)
        violations = []

        for segment in segments:
            # Check for protected class mentions
            detected_classes = self._detect_protected_classes(segment['text'])

            if detected_classes:
                # Classify context (neutral, unclear, discriminatory)
                classification = self.classifier(segment['text'])[0]
                severity = self._calculate_severity(classification['label'], classification['score'])

                violations.append({
                    'timestamp': segment['timestamp'],
                    'text': segment['text'],
                    'protected_classes': detected_classes,
                    'severity': severity,  # 'LOW', 'MEDIUM', 'HIGH'
                    'classification': classification['label'],  # 'NEUTRAL', 'UNCLEAR', 'DISCRIMINATORY'
                    'confidence': classification['score'],
                    'recommendation': self._get_recommendation(severity),
                    'legal_reference': self._get_legal_reference(detected_classes)
                })

        return violations

    def _detect_protected_classes(self, text: str) -> List[str]:
        """Detect mentions of protected classes"""
        detected = []
        text_lower = text.lower()

        for class_name, keywords in self.protected_classes.items():
            for keyword in keywords:
                if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower):
                    detected.append(class_name)
                    break

        return list(set(detected))

    def _calculate_severity(self, label: str, confidence: float) -> str:
        """Calculate severity level based on classification and confidence"""
        if label == 'DISCRIMINATORY' and confidence > 0.85:
            return 'HIGH'
        elif label == 'DISCRIMINATORY' or (label == 'UNCLEAR' and confidence > 0.70):
            return 'MEDIUM'
        else:
            return 'LOW'

    def _get_recommendation(self, severity: str) -> str:
        """Get action recommendation based on severity"""
        if severity == 'HIGH':
            return "DO NOT SHARE EXTERNALLY. Review with compliance officer immediately. Consider redacting this segment."
        elif severity == 'MEDIUM':
            return "Review for context. Consult Fair Housing guidelines. Consider redacting if unclear."
        else:
            return "Likely neutral mention. No action required unless sharing with external parties."

    def _get_legal_reference(self, protected_classes: List[str]) -> str:
        """Get relevant legal citation"""
        return f"Fair Housing Act 42 U.S.C. § 3604. Protected classes: {', '.join(protected_classes)}"

    def auto_redact(self, transcript: str, violations: List[Dict], mode: str = 'high_only') -> str:
        """
        Auto-redact protected class mentions based on severity
        mode: 'all', 'high_only', 'medium_high'
        """
        redacted = transcript

        for violation in violations:
            if mode == 'all' or \
               (mode == 'high_only' and violation['severity'] == 'HIGH') or \
               (mode == 'medium_high' and violation['severity'] in ['HIGH', 'MEDIUM']):

                # Replace protected class mentions with [REDACTED]
                for protected_class in violation['protected_classes']:
                    keywords = self.protected_classes[protected_class]
                    for keyword in keywords:
                        redacted = re.sub(
                            r'\b' + re.escape(keyword) + r'\b',
                            '[REDACTED]',
                            redacted,
                            flags=re.IGNORECASE
                        )

        return redacted
```

#### UI/UX Design

**During Recording - Real-Time Alert**:
```
┌─────────────────────────────────────────┐
│  ⚠️ FAIR HOUSING ALERT                 │
│                                         │
│  You mentioned "family" - a protected  │
│  class under Fair Housing Act.         │
│                                         │
│  Ensure your statement is neutral and  │
│  does not discriminate based on        │
│  familial status.                      │
│                                         │
│  [Review Guidelines]  [Dismiss]        │
└─────────────────────────────────────────┘
```

**Post-Recording - Review Dashboard**:
```
Transcript: Lisa's Showing - 123 Oak Street
Duration: 45 minutes
Fair Housing Alerts: 3 (1 High, 1 Medium, 1 Low)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[00:15:30] 🔴 HIGH SEVERITY
Speaker: Lisa
"This neighborhood is changing, you might prefer
a different area with more families like yours."

Protected Classes: race (implied), familial status
Issue: STEERING - Directing clients based on protected class
Recommendation: DO NOT SHARE. Redact immediately.
Legal Risk: $16,000-$65,000 fine (HUD violation)

[Auto-Redact] [Manual Edit] [Keep Original]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[00:28:45] 🟡 MEDIUM SEVERITY
Speaker: Client
"Are there many families with kids in this building?"

Protected Classes: familial status
Issue: UNCLEAR - Client inquiry, but Lisa's response matters
Recommendation: Review response for neutral language
Legal Risk: Low if response is neutral

[Review Response] [Mark Reviewed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[00:42:10] 🟢 LOW SEVERITY
Speaker: Lisa
"The neighborhood has excellent schools and a
new family recreation center."

Protected Classes: familial status
Issue: NEUTRAL - Factual neighborhood amenity
Recommendation: No action required
Legal Risk: None

[Mark Reviewed]
```

#### Training & Education Integration

- [ ] **Onboarding Tutorial**: 10-minute Fair Housing training before first recording
- [ ] **Annual Refresher**: Required yearly Fair Housing module
- [ ] **Alert-Triggered Training**: If agent triggers 3+ high severity alerts, mandatory refresher
- [ ] **Best Practices Library**:
  - "How to answer client questions about neighborhoods" (neutral scripts)
  - "Common Fair Housing mistakes and how to avoid them"
  - "What to say when clients make discriminatory requests"

#### Performance Requirements

- [ ] Detection accuracy: 95%+ for discriminatory statements (validated with HUD case law)
- [ ] False positive rate: <10% (don't flag too many neutral mentions)
- [ ] Processing time: <30 seconds for 60-minute transcript
- [ ] Real-time alert latency: <3 seconds from speech to alert

#### Definition of Done

- [ ] AI model trained on 10,000+ Fair Housing case examples (HUD complaints, legal cases)
- [ ] Protected class detection tested: 95%+ accuracy across all 7 classes
- [ ] Severity classification validated with Fair Housing attorneys
- [ ] Auto-redaction tested: No false removals of neutral content
- [ ] UI/UX tested with 10 real estate agents (80%+ find alerts helpful, not annoying)
- [ ] Legal review completed by Fair Housing compliance attorney
- [ ] Training modules created and tested (10-min onboarding, annual refresher)
- [ ] Brokerage dashboard tested with property management firms
- [ ] Documentation updated with Fair Housing best practices

---

### Story 2: Multi-Speaker Diarization for Closings (6-8 People)
**Story Points**: 13
**Persona**: Amanda (Title/Escrow Officer), Jennifer (Loan Officer)
**Priority**: HIGH (Wire fraud prevention, dispute resolution)

#### User Story
```
As a title officer conducting closings with 6-8 people present
I want AI to identify and label each speaker accurately
So that I have a defensible verbatim record of who said what (especially wire transfer instructions)
```

#### Acceptance Criteria
- [ ] **Speaker Count**: Identify 6-8 simultaneous speakers (typical closing: buyer, seller, 2 agents, lender, title officer, notary, attorney)
- [ ] **Speaker Labeling**:
  - [ ] Auto-detect number of speakers
  - [ ] Assign labels: Speaker A, Speaker B, etc.
  - [ ] Manual rename: Speaker A → "Sarah Chen (Buyer)"
  - [ ] Preserve labels across transcript
- [ ] **Speaker Separation Accuracy**:
  - [ ] 95%+ accuracy for 2-3 speakers
  - [ ] 90%+ accuracy for 4-5 speakers
  - [ ] 85%+ accuracy for 6-8 speakers
  - [ ] Handle overlapping speech (multiple people talking simultaneously)
- [ ] **Wire Transfer Instruction Verification**:
  - [ ] Auto-flag wire transfer discussions
  - [ ] Highlight speaker who provided wire instructions (title officer)
  - [ ] Timestamp exact wording for legal verification
  - [ ] Alert if wire instructions differ from written closing documents
- [ ] **Legal Export Features**:
  - [ ] Verbatim transcript with speaker labels
  - [ ] Certified timestamps (UTC + local time)
  - [ ] Speaker identification log (who was present)
  - [ ] Audio checksum (verify no tampering)
  - [ ] Exportable to litigation software (Clio, MyCase)

#### Use Cases by Persona

**Amanda (Title Officer) - $680K Wire Fraud Prevention**:
- 6 people in closing: Sarah (buyer), Sarah's agent, seller, seller's agent, Jennifer (lender), Amanda (title)
- Amanda verbally confirms wire instructions: "Wire $680,000 to account ending in 4532 at First National Bank"
- AI identifies Amanda as speaker providing wire instructions
- Transcript shows exact timestamp and wording
- If wire fraud attempted (fake email with different account), Amanda has proof of correct instructions
- **Impact**: $680K saved (one wire fraud attempt prevented pays for 5 years of software)

**Jennifer (Loan Officer) - TILA Compliance**:
- 4 people in consultation: Borrower couple, Jennifer, realtor
- Jennifer verbally discloses APR, closing costs, payment terms
- AI identifies Jennifer as speaker for all TILA disclosures
- If borrower later disputes terms ("You said 3.5% APR, not 3.75%"), transcript shows exact quote
- **Impact**: $5K-$10K dispute prevented, zero TILA violations

#### Technical Implementation

```python
# Multi-Speaker Diarization with Pyannote Audio

from pyannote.audio import Pipeline
from typing import List, Dict
import torch

class MultiSpeakerDiarizer:
    def __init__(self):
        # Pyannote 3.0 with speaker diarization
        self.pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.0",
            use_auth_token="HF_TOKEN"
        )

        # Run on GPU if available
        if torch.cuda.is_available():
            self.pipeline.to(torch.device("cuda"))

    def diarize_closing(self, audio_file: str, num_speakers: int = None) -> List[Dict]:
        """
        Perform speaker diarization on closing recording
        num_speakers: Hint for expected speaker count (optional)
        """
        # Run diarization
        diarization = self.pipeline(
            audio_file,
            num_speakers=num_speakers  # Hint: 6-8 for closings
        )

        # Convert to structured segments
        segments = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            segments.append({
                'start': turn.start,
                'end': turn.end,
                'speaker': speaker,  # "SPEAKER_00", "SPEAKER_01", etc.
                'duration': turn.end - turn.start
            })

        return segments

    def merge_with_transcript(self, segments: List[Dict], transcript: Dict) -> Dict:
        """
        Merge diarization segments with transcribed text
        Returns: Transcript with speaker labels
        """
        labeled_transcript = []

        for word in transcript['words']:
            # Find matching speaker segment
            speaker = self._find_speaker_at_time(word['start'], segments)

            labeled_transcript.append({
                'word': word['text'],
                'start': word['start'],
                'end': word['end'],
                'speaker': speaker
            })

        # Group by speaker turns
        return self._group_by_speaker_turns(labeled_transcript)

    def detect_wire_transfer_instructions(self, labeled_transcript: Dict) -> List[Dict]:
        """
        Detect and flag wire transfer instruction segments
        """
        wire_keywords = [
            'wire transfer', 'wire funds', 'wiring instructions',
            'account number', 'routing number', 'bank account',
            'transfer amount', 'closing funds'
        ]

        wire_segments = []

        for segment in labeled_transcript:
            text_lower = segment['text'].lower()

            for keyword in wire_keywords:
                if keyword in text_lower:
                    wire_segments.append({
                        'timestamp': segment['start'],
                        'speaker': segment['speaker'],
                        'text': segment['text'],
                        'alert_level': 'CRITICAL',
                        'reason': f'Wire transfer discussion detected: "{keyword}"',
                        'verification_needed': True
                    })
                    break

        return wire_segments

    def verify_speaker_consistency(self, wire_segments: List[Dict]) -> Dict:
        """
        Verify that wire instructions came from authorized speaker (title officer)
        """
        # Count who provided wire instructions
        speaker_counts = {}
        for segment in wire_segments:
            speaker = segment['speaker']
            speaker_counts[speaker] = speaker_counts.get(speaker, 0) + 1

        # Alert if multiple speakers provided wire instructions (red flag)
        if len(speaker_counts) > 1:
            return {
                'status': 'WARNING',
                'message': 'Multiple speakers provided wire instructions. Verify authenticity.',
                'speakers': speaker_counts
            }
        else:
            return {
                'status': 'OK',
                'message': 'Single speaker (title officer) provided wire instructions.',
                'speakers': speaker_counts
            }
```

#### UI/UX Design

**Speaker Labeling Interface**:
```
Closing Recording - Sarah Chen Purchase
Duration: 90 minutes
Detected Speakers: 6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Assign Speaker Names:

Speaker A (42 min) → [Sarah Chen (Buyer)      ]
Speaker B (38 min) → [Lisa Thompson (Agent)   ]
Speaker C (35 min) → [Robert Smith (Seller)   ]
Speaker D (25 min) → [Jennifer Park (Lender)  ]
Speaker E (22 min) → [Amanda Williams (Title) ]
Speaker F (15 min) → [Mark Davis (Seller Agt) ]

[Save Speaker Names]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 WIRE TRANSFER ALERT (3 segments detected)

[01:15:30] Amanda Williams (Title)
"Wire the closing funds of $680,000 to First
National Bank, account ending in 4532, routing
number 111000025."

⚠️ Verify: Does this match closing documents?
[✓ Verified] [✗ Discrepancy]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Performance Requirements

- [ ] Diarization processing time: <10 minutes for 90-minute closing
- [ ] Speaker accuracy: 90%+ for 6-8 speakers (validated with real closings)
- [ ] Wire instruction detection: 98%+ recall (must catch all wire discussions)
- [ ] Memory usage: <8 GB RAM for 90-minute audio
- [ ] GPU acceleration: 3x faster on NVIDIA GPU vs. CPU

#### Definition of Done

- [ ] Pyannote 3.0 integration tested with 6-8 speaker closings
- [ ] Speaker accuracy measured: 90%+ for 6-8 speakers (20 real closing recordings)
- [ ] Wire transfer detection tested: 98%+ recall, <5% false positives
- [ ] Speaker labeling UI tested with title officers (80%+ easy to use)
- [ ] Legal export format validated with title companies and attorneys
- [ ] Performance benchmarks met (<10 min processing for 90-min closing)
- [ ] User testing with 5 title officers (85%+ would use for wire fraud prevention)
- [ ] Documentation updated with wire fraud prevention best practices

---

## 🟡 High Priority Stories (CRM Integration)

### Story 3: Zillow Premier Agent Integration (Tier 1)
**Story Points**: 8
**Persona**: Lisa (Residential Agent)
**Priority**: HIGH (3x adoption rate with CRM integration)

#### User Story
```
As a residential agent using Zillow Premier Agent CRM
I want transcripts to auto-sync with client profiles in Zillow
So that I don't waste 20 minutes per showing manually entering notes
```

#### Acceptance Criteria
- [ ] **OAuth Integration**: Secure login with Zillow Premier Agent account
- [ ] **Auto-Sync Features**:
  - [ ] Transcript summary → Zillow client notes
  - [ ] Property address → Link to Zillow listing (if MLS match found)
  - [ ] Client reactions → Property favorites/dislikes
  - [ ] Action items → Follow-up tasks in Zillow
  - [ ] Next showing date → Zillow calendar event
- [ ] **Field Mapping**:
  - [ ] Client preferences → Zillow "Buyer Requirements"
  - [ ] Property feedback → Zillow "Showing Feedback"
  - [ ] Objections → Zillow "Client Concerns"
  - [ ] Enthusiasm score (1-10) → Zillow "Interest Level"
- [ ] **Two-Way Sync**:
  - [ ] Zillow client name → Auto-tag transcript
  - [ ] Zillow property address → Auto-tag recording location
  - [ ] Zillow client phone → Auto-match incoming calls to client profile
- [ ] **Privacy Controls**:
  - [ ] Select which transcripts to sync (don't sync confidential conversations)
  - [ ] Redact sensitive info before sync (financial details, personal issues)
  - [ ] One-way sync option (app → Zillow only, no data pulled from Zillow)

#### Lisa's Time Savings
- **Before**: 20 min/showing manually entering notes in Zillow = 160 min/day (8 showings)
- **After**: 2 min/showing reviewing auto-synced notes = 16 min/day
- **Savings**: 144 min/day = **12 hours/week** = $600/week value (Lisa's hourly rate $50)

#### Technical Implementation

```typescript
// Zillow Premier Agent API Integration

import axios from 'axios';

interface ZillowClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  buyerRequirements: {
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    location: string[];
  };
}

interface ZillowShowingFeedback {
  clientId: string;
  propertyId: string;
  address: string;
  showingDate: Date;
  interestLevel: number; // 1-10
  feedback: string;
  concerns: string[];
  nextSteps: string;
}

class ZillowIntegration {
  private apiKey: string;
  private accessToken: string;
  private baseURL = 'https://api.zillow.com/premier-agent/v2';

  async authenticateWithOAuth(authCode: string): Promise<string> {
    const response = await axios.post(`${this.baseURL}/oauth/token`, {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: process.env.ZILLOW_CLIENT_ID,
      client_secret: process.env.ZILLOW_CLIENT_SECRET,
      redirect_uri: 'app://oauth-callback'
    });

    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async syncTranscriptToZillow(transcript: any): Promise<void> {
    // Extract client info from transcript
    const clientName = transcript.metadata.clientName;

    // Find matching Zillow client
    const zillowClient = await this.findClientByName(clientName);

    // Create showing feedback entry
    const feedback: ZillowShowingFeedback = {
      clientId: zillowClient.id,
      propertyId: await this.findPropertyByAddress(transcript.metadata.address),
      address: transcript.metadata.address,
      showingDate: transcript.metadata.date,
      interestLevel: transcript.ai_analysis.enthusiasm_score, // 1-10
      feedback: transcript.ai_analysis.summary,
      concerns: transcript.ai_analysis.objections,
      nextSteps: transcript.ai_analysis.action_items.join('; ')
    };

    // Sync to Zillow
    await axios.post(
      `${this.baseURL}/clients/${zillowClient.id}/showings`,
      feedback,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );

    // Update client buyer requirements if preferences mentioned
    if (transcript.ai_analysis.preferences) {
      await this.updateBuyerRequirements(zillowClient.id, transcript.ai_analysis.preferences);
    }

    // Create follow-up task if needed
    if (transcript.ai_analysis.follow_up_needed) {
      await this.createTask(zillowClient.id, {
        title: `Follow up on ${transcript.metadata.address}`,
        dueDate: this.calculateFollowUpDate(transcript.ai_analysis.enthusiasm_score),
        notes: transcript.ai_analysis.follow_up_suggestions
      });
    }
  }

  async updateBuyerRequirements(clientId: string, preferences: any): Promise<void> {
    const updates = {
      minPrice: preferences.budget_min,
      maxPrice: preferences.budget_max,
      bedrooms: preferences.bedrooms,
      bathrooms: preferences.bathrooms,
      mustHaveFeatures: preferences.must_have,
      dealBreakers: preferences.deal_breakers,
      preferredAreas: preferences.neighborhoods
    };

    await axios.patch(
      `${this.baseURL}/clients/${clientId}/requirements`,
      updates,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
  }

  private calculateFollowUpDate(enthusiasmScore: number): Date {
    // High enthusiasm (8-10) = follow up within 24 hours
    // Medium enthusiasm (5-7) = follow up within 3 days
    // Low enthusiasm (1-4) = follow up within 1 week
    const daysToAdd = enthusiasmScore >= 8 ? 1 : enthusiasmScore >= 5 ? 3 : 7;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + daysToAdd);
    return followUpDate;
  }
}
```

#### Definition of Done

- [ ] OAuth integration tested with Zillow Premier Agent
- [ ] Auto-sync tested: Transcript → Zillow (field mapping 95%+ accurate)
- [ ] Two-way sync tested: Zillow client data → App
- [ ] Time savings measured: Lisa saves 12+ hours/week
- [ ] Privacy controls tested: Selective sync, redaction options
- [ ] User testing with 10 Zillow Premier Agent users (80%+ satisfaction)
- [ ] Documentation updated with Zillow setup guide

---

### Story 4: Salesforce CRM Integration (Tier 1 - Commercial)
**Story Points**: 8
**Persona**: David (Commercial Broker)
**Priority**: HIGH (Enterprise CRM for commercial real estate)

#### User Story
```
As a commercial broker using Salesforce CRM
I want transcripts to auto-sync with Opportunity and Contact records
So that my entire deal pipeline is updated without manual data entry
```

#### Acceptance Criteria
- [ ] **Salesforce Objects Supported**:
  - [ ] Contacts (client, tenant, broker contacts)
  - [ ] Accounts (institutional clients, REITs, pension funds)
  - [ ] Opportunities (active deals, $5M-$50M+ transactions)
  - [ ] Properties (custom object for CRE firms)
  - [ ] Activities (meetings, calls, property tours)
- [ ] **Auto-Sync Features**:
  - [ ] Transcript summary → Opportunity "Deal Notes"
  - [ ] Financial terms → Opportunity "Amount", "Deal Structure"
  - [ ] Key dates → Opportunity "Close Date", "Due Diligence Deadline"
  - [ ] Action items → Salesforce Tasks (assigned to team members)
  - [ ] Client requirements → Account "Investment Criteria"
- [ ] **Custom Field Mapping**:
  - [ ] Property type → Custom field "Asset Class" (office, industrial, retail, multifamily)
  - [ ] Cap rate discussions → Custom field "Target Cap Rate"
  - [ ] NOI projections → Custom field "Projected NOI"
  - [ ] Tenant rollover → Custom field "Lease Expiration Risk"
- [ ] **Team Collaboration**:
  - [ ] @mention team members in transcript → Salesforce Chatter notification
  - [ ] Share transcript with Opportunity team → Salesforce file attachment
  - [ ] Deal status updates → Opportunity Stage progression

#### David's Use Case
- Tours $18M industrial property with institutional client
- 90-minute discussion covers: NOI ($1.2M), cap rate (6.5%), tenant rollover risk, value-add opportunities
- AI extracts financial terms and syncs to Salesforce Opportunity:
  - Opportunity Name: "Industrial Property - 200K SF - $18M"
  - Amount: $18,000,000
  - Close Date: Q2 2025 (mentioned in conversation)
  - Custom Fields: Cap Rate 6.5%, NOI $1.2M, Asset Class "Industrial"
  - Next Steps: Due diligence, environmental assessment (auto-created as Salesforce Tasks)
- **Time Savings**: 45 min/deal manually entering data → 5 min reviewing auto-synced data = **40 min saved per deal**

#### Technical Implementation

```typescript
// Salesforce API Integration

import jsforce from 'jsforce';

interface SalesforceOpportunity {
  Name: string;
  Amount: number;
  CloseDate: Date;
  StageName: string;
  AccountId: string;
  Description: string;
  // Custom fields (CRE-specific)
  Property_Address__c: string;
  Asset_Class__c: string; // Office, Industrial, Retail, Multifamily
  Cap_Rate__c: number;
  NOI__c: number;
  Square_Footage__c: number;
  Occupancy_Rate__c: number;
}

class SalesforceIntegration {
  private conn: jsforce.Connection;

  async authenticateWithOAuth(authCode: string): Promise<void> {
    this.conn = new jsforce.Connection({
      oauth2: {
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
        redirectUri: 'https://app.transcriptparser.com/oauth/salesforce'
      }
    });

    await this.conn.authorize(authCode);
  }

  async syncCommercialDealToSalesforce(transcript: any): Promise<void> {
    // Extract deal information from transcript
    const dealInfo = transcript.ai_analysis.investment_memo;

    // Find or create Opportunity
    const opportunity: SalesforceOpportunity = {
      Name: `${dealInfo.property_type} - ${dealInfo.square_footage} SF - $${dealInfo.price}`,
      Amount: dealInfo.price,
      CloseDate: this.parseCloseDate(dealInfo.timeline),
      StageName: 'Property Tour Completed',
      AccountId: await this.findOrCreateAccount(transcript.metadata.clientName),
      Description: dealInfo.executive_summary,
      // Custom fields
      Property_Address__c: dealInfo.address,
      Asset_Class__c: dealInfo.asset_class,
      Cap_Rate__c: dealInfo.cap_rate,
      NOI__c: dealInfo.noi,
      Square_Footage__c: dealInfo.square_footage,
      Occupancy_Rate__c: dealInfo.occupancy_rate
    };

    // Upsert Opportunity (update if exists, create if new)
    const result = await this.conn.sobject('Opportunity').upsert(opportunity, 'Property_Address__c');

    // Create Tasks for action items
    for (const actionItem of dealInfo.action_items) {
      await this.createTask({
        Subject: actionItem.task,
        WhatId: result.id, // Link to Opportunity
        ActivityDate: this.parseTaskDate(actionItem.deadline),
        Status: 'Not Started',
        Priority: actionItem.priority,
        Description: actionItem.details
      });
    }

    // Attach transcript as Salesforce File
    await this.attachTranscript(result.id, transcript);
  }

  async createTask(task: any): Promise<void> {
    await this.conn.sobject('Task').create(task);
  }

  async attachTranscript(opportunityId: string, transcript: any): Promise<void> {
    // Generate PDF of transcript
    const pdfBuffer = await this.generateTranscriptPDF(transcript);

    // Upload to Salesforce Files
    await this.conn.sobject('ContentVersion').create({
      Title: `Transcript - ${transcript.metadata.address}`,
      PathOnClient: 'transcript.pdf',
      VersionData: pdfBuffer.toString('base64'),
      FirstPublishLocationId: opportunityId
    });
  }

  private parseCloseDate(timeline: string): Date {
    // Extract close date from conversation
    // "We're targeting Q2 2025" → April 1, 2025
    // "Close by end of June" → June 30, 2025
    // Uses NLP to extract date mentions
    return new Date(); // Placeholder
  }
}
```

#### Definition of Done

- [ ] Salesforce OAuth integration tested
- [ ] Custom object mapping tested (CRE-specific fields)
- [ ] Auto-sync tested: Transcript → Salesforce Opportunity
- [ ] Task creation tested: Action items → Salesforce Tasks
- [ ] File attachment tested: Transcript PDF → Salesforce Files
- [ ] Time savings measured: 40+ min saved per deal
- [ ] User testing with 5 commercial brokers (85%+ satisfaction)
- [ ] Documentation updated with Salesforce setup guide

---

### Story 5: AppFolio Property Manager Integration (Tier 1)
**Story Points**: 6
**Persona**: Carmen (Property Manager)
**Priority**: HIGH (240-unit portfolio automation)

#### User Story
```
As a property manager using AppFolio
I want tenant call transcripts to auto-sync with tenant profiles and work orders
So that I can manage 240 units efficiently without manual note-taking
```

#### Acceptance Criteria
- [ ] **AppFolio Objects Supported**:
  - [ ] Tenants (resident profiles)
  - [ ] Units (property units)
  - [ ] Work Orders (maintenance requests)
  - [ ] Leases (rental agreements)
  - [ ] Communications Log (tenant interactions)
- [ ] **Auto-Sync Features**:
  - [ ] Tenant call transcript → Communications Log
  - [ ] Maintenance request → Work Order creation
  - [ ] Lease renewal discussion → Lease Notes
  - [ ] Late rent conversation → Payment tracking notes
  - [ ] Tenant complaint → Compliance documentation
- [ ] **Bilingual Support**:
  - [ ] Spanish tenant calls → Translated to English for AppFolio
  - [ ] English work orders → Translated to Spanish for maintenance team
  - [ ] Preserve original language in transcript + add translation

#### Carmen's Time Savings
- **Before**: 240 units × 2 calls/month/unit = 480 calls/month × 10 min/call = **80 hours/month** manual notes
- **After**: 480 calls × 2 min/call (review auto-synced) = **16 hours/month**
- **Savings**: **64 hours/month** = $3,200/month value (Carmen's hourly rate $50)

#### Definition of Done

- [ ] AppFolio API integration tested
- [ ] Work order auto-creation tested (maintenance requests → AppFolio)
- [ ] Bilingual translation tested (Spanish ↔ English)
- [ ] Time savings measured: 64+ hours/month saved
- [ ] User testing with 3 property managers (80%+ satisfaction)
- [ ] Documentation updated with AppFolio setup guide

---

### Story 6: HomeGauge / Spectora Integration (Inspector CRM - Tier 1)
**Story Points**: 6
**Persona**: Michael (Home Inspector)
**Priority**: HIGH (Automated inspection report generation)

#### User Story
```
As a home inspector using HomeGauge/Spectora
I want inspection voice notes to auto-populate my inspection report
So that I spend <2 hours/night on reports instead of 4-5 hours
```

#### Acceptance Criteria
- [ ] **HomeGauge/Spectora Objects**:
  - [ ] Inspection Report (main document)
  - [ ] Report Sections (roof, foundation, electrical, plumbing, HVAC)
  - [ ] Defects (issues found during inspection)
  - [ ] Photos (visual evidence)
  - [ ] Recommendations (repair/replace/monitor)
- [ ] **Auto-Sync Features**:
  - [ ] Voice notes → Report section text
  - [ ] "Roof section: 5 years old, good condition" → Roof section notes
  - [ ] "Foundation crack, 1/4 inch, recommend monitoring" → Foundation Defect entry
  - [ ] Photos captured during inspection → Linked to report sections
  - [ ] Severity levels → Auto-categorized (Safety Issue, Major Concern, Minor Issue, Monitor)
- [ ] **Template Matching**:
  - [ ] HomeGauge uses templates (standard report format)
  - [ ] AI extracts inspection findings and maps to template fields
  - [ ] Pre-populated report ready for inspector's final review

#### Michael's Time Savings
- **Before**: 400 inspections/year × 4.5 hrs/report = **1,800 hours/year**
- **After**: 400 inspections/year × 1.5 hrs/report = **600 hours/year**
- **Savings**: **1,200 hours/year** = $60K-$90K value (Michael's hourly rate $50-$75)

#### Definition of Done

- [ ] HomeGauge API integration tested
- [ ] Spectora API integration tested
- [ ] Voice note → Report section mapping tested (90%+ accuracy)
- [ ] Photo linking tested (GPS + timestamp match)
- [ ] Time savings measured: 1,200+ hours/year saved
- [ ] User testing with 5 home inspectors (85%+ satisfaction)
- [ ] Documentation updated with inspector CRM setup guides

---

## 🟢 Medium Priority Stories (Analytics & Compliance)

### Story 7: MLS Data Compliance Review & Safeguards
**Story Points**: 5
**Persona**: Lisa, David (MLS compliance)
**Priority**: MEDIUM (Legal risk mitigation)

#### User Story
```
As a real estate agent discussing MLS listing data during showings
I want to ensure transcripts don't violate MLS terms of service
So that I avoid fines, license suspension, or MLS data access revocation
```

#### Acceptance Criteria
- [ ] **MLS Data Detection**:
  - [ ] AI detects MLS-sourced data mentions (price, square footage, DOM, listing agent)
  - [ ] Flag segments containing MLS data
  - [ ] Warning: "This transcript contains MLS data. Review usage restrictions."
- [ ] **MLS Compliance Modes**:
  - [ ] **Cloud AI Mode**: Warn user that MLS data will be sent to third party (OpenAI)
  - [ ] **Local AI Mode**: No warning (data stays on device, MLS compliant)
  - [ ] **Redaction Mode**: Auto-redact MLS data before cloud upload
- [ ] **Legal Review Integration**:
  - [ ] Consult with NAR legal team on MLS data in transcripts
  - [ ] Document findings: "Transcripts OK if local AI used"
  - [ ] Update terms of service with MLS compliance guidelines
- [ ] **User Education**:
  - [ ] Onboarding tutorial: "MLS Data Compliance 101"
  - [ ] Explain difference: Local AI (compliant) vs. Cloud AI (check MLS rules)
  - [ ] Recommend local AI for agents discussing MLS listings

#### Definition of Done

- [ ] MLS data detection tested (price, sqft, DOM, listing agent mentions)
- [ ] Legal consultation completed with NAR/MLS attorney
- [ ] Compliance mode tested (local AI, cloud AI + warning, redaction)
- [ ] User education materials created (MLS compliance tutorial)
- [ ] Documentation updated with MLS best practices

---

### Story 8: Usage Tracking & Export Analytics
**Story Points**: 5
**Persona**: All users (feature usage insights)
**Priority**: MEDIUM (Product improvement, monetization insights)

#### User Story
```
As the product team
I want to track feature usage and export patterns
So that we can improve the product and identify premium features for pricing tiers
```

#### Acceptance Criteria
- [ ] **Usage Metrics Tracked** (Privacy-Preserving):
  - [ ] Number of recordings per week/month
  - [ ] Average recording duration
  - [ ] Transcription method (cloud AI vs. local AI)
  - [ ] CRM integrations enabled (Zillow, Salesforce, AppFolio)
  - [ ] Export format usage (PDF, DOCX, CSV, email template)
  - [ ] Feature usage (property comparison, investment memo, follow-up email)
  - [ ] Fair Housing alerts triggered (aggregate, not individual transcripts)
  - [ ] Speaker diarization usage (2-3 speakers vs. 6-8 speakers)
- [ ] **User Insights Dashboard** (Admin):
  - [ ] Top features by persona (Lisa uses comparison reports, David uses investment memos)
  - [ ] Adoption rate by feature (60% use property comparison, 30% use local AI)
  - [ ] Churn risk indicators (users with <2 recordings/month)
  - [ ] Upgrade opportunities (users hitting freemium limits)
- [ ] **Privacy Requirements**:
  - [ ] NO transcript content tracked (only metadata and feature usage)
  - [ ] Anonymized aggregate data only
  - [ ] User opt-out option (disable usage tracking)
  - [ ] GDPR/CCPA compliant (data deletion on request)

#### Insights for Product Development
- "70% of agents use property comparison reports → Prioritize improving this feature"
- "Only 15% use local AI → Improve onboarding tutorial, emphasize privacy benefits"
- "80% of commercial brokers export as PDF → Improve PDF formatting for investment memos"
- "Users with CRM integration have 3x retention rate → Prioritize more CRM integrations"

#### Definition of Done

- [ ] Usage tracking implemented (privacy-preserving)
- [ ] Admin dashboard created (feature usage, adoption rates)
- [ ] Privacy compliance verified (GDPR/CCPA)
- [ ] User opt-out option tested
- [ ] Documentation updated with privacy policy

---

### Story 9: Performance Benchmarking & Optimization
**Story Points**: 4
**Persona**: All users (app performance)
**Priority**: MEDIUM (User experience improvement)

#### User Story
```
As a user recording 60-90 minute sessions
I want fast transcription processing and low battery usage
So that the app doesn't slow down my workflow or drain my phone
```

#### Acceptance Criteria
- [ ] **Performance Benchmarks Measured**:
  - [ ] Recording battery usage: <5% per hour (iOS, Android)
  - [ ] Cloud transcription speed: <5 min for 60-min audio
  - [ ] Local AI transcription speed: <10 min for 60-min audio (Ollama)
  - [ ] Multi-speaker diarization: <10 min for 90-min closing
  - [ ] App startup time: <2 seconds
  - [ ] Transcript search: <500ms for 100 transcripts
- [ ] **Optimization Targets**:
  - [ ] Reduce cloud upload time (compress audio before upload)
  - [ ] Reduce local AI processing time (GPU acceleration)
  - [ ] Reduce battery drain (optimize recording codec)
  - [ ] Reduce app size (lazy load CRM integrations)
- [ ] **Monitoring & Alerts**:
  - [ ] Track performance metrics in production
  - [ ] Alert if processing time >10 min for 60-min audio
  - [ ] Alert if battery usage >8% per hour

#### Definition of Done

- [ ] Performance benchmarks measured (battery, speed, memory)
- [ ] Optimization implemented (compression, GPU, codec)
- [ ] Production monitoring enabled
- [ ] User satisfaction measured (80%+ say "app is fast")

---

## 📋 Sprint Planning Summary

### Total Story Points: 76

**Critical (Legal/Compliance)**: 34 points
- Story 1: Fair Housing AI Detection (21 points)
- Story 2: Multi-Speaker Diarization (13 points)

**High Priority (CRM Integration)**: 28 points
- Story 3: Zillow Integration (8 points)
- Story 4: Salesforce Integration (8 points)
- Story 5: AppFolio Integration (6 points)
- Story 6: HomeGauge/Spectora Integration (6 points)

**Medium Priority (Analytics & Compliance)**: 14 points
- Story 7: MLS Compliance Review (5 points)
- Story 8: Usage Tracking (5 points)
- Story 9: Performance Benchmarking (4 points)

### Team Allocation (6 engineers × 6 weeks)
- **Legal/Compliance**: 2 engineers (Fair Housing AI, multi-speaker diarization)
- **CRM Integration**: 2 engineers (4 CRM integrations in parallel)
- **Analytics & Performance**: 1 engineer (usage tracking, MLS compliance, performance)
- **QA & Testing**: 1 engineer (legal review, user testing, compliance validation)

### Success Metrics
- [ ] **Fair Housing**: Zero $16K-$65K violations in beta testing (100 agents × 3 months)
- [ ] **CRM Integration**: 3x adoption rate (60% use auto-sync vs. 20% manual export)
- [ ] **Wire Fraud Prevention**: $680K saved (1 prevented fraud = 10-year software ROI)
- [ ] **Time Savings**: 12 hrs/week per agent (Lisa), 64 hrs/month per property manager (Carmen)
- [ ] **Multi-Speaker Accuracy**: 90%+ for 6-8 speakers (validated with 20 real closings)

### Risks & Mitigations
- **Risk**: Fair Housing AI false positives annoy agents
  - **Mitigation**: Tune model for <10% false positive rate, user testing with 20 agents
- **Risk**: CRM API rate limits slow auto-sync
  - **Mitigation**: Queue syncs, batch API calls, respect rate limits
- **Risk**: Multi-speaker diarization accuracy <85% for 8 speakers
  - **Mitigation**: Fallback to manual speaker labeling, recommend external mic for large closings
- **Risk**: MLS legal review delays sprint
  - **Mitigation**: Start legal consultation in parallel with development, have fallback (local AI only mode)

---

## 🔗 Related Documents

- [Sprint 01 - Core Features](./Sprint%2001%20-%20Core%20Features.md)
- [Sprint 02 - Advanced Features](./Sprint%2002%20-%20Advanced%20Features.md)
- [Expert Feedback - Real Estate Industry](../expert-feedback/Expert%20Feedback%20-%20Real%20Estate%20Industry.md)
- [Expert Feedback - Legal/Compliance](../expert-feedback/Expert%20Feedback%20-%20Summary%20of%20All%20Reviews.md)
- [Epic 03 Completion Summary](../../EPIC-03-COMPLETION-SUMMARY.md)

---

**Created**: December 21, 2024
**Epic**: Epic 03 - Real Estate Module
**Total Story Points**: 76
**Sprint Duration**: 6 weeks
**Focus**: CRM integrations, Fair Housing compliance, multi-speaker diarization, market readiness
