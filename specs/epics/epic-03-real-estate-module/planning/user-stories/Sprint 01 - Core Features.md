# Sprint 01: Core Features - Real Estate Module

**Sprint Duration**: 8 weeks
**Story Points**: 89 (Fibonacci scale)
**Priority**: MUST HAVE (MVP)
**Focus**: Mobile-first recording, local AI (Ollama), state recording consent, basic transcription

---

## 📊 Sprint Overview

### Story Points Breakdown
- **Must Have**: 55 points (recording, transcription, local AI, consent)
- **Should Have**: 21 points (property tagging, basic search)
- **Could Have**: 13 points (offline sync improvements, basic sharing)

### Success Criteria
✅ Lisa can record property showings on iPhone, get AI summary within 5 minutes
✅ David can process confidential meeting transcripts with local Ollama (zero cloud)
✅ Jennifer can record loan consultations with state-appropriate consent warnings
✅ All users see GPS-based recording consent alerts based on state law
✅ Michael can record inspection hands-free, transcribe when back online

---

## User Stories

---

### Story 1: Mobile Recording (iOS/Android)
**Story Points**: 13
**Persona**: Lisa, Michael, All mobile users (90%+ mobile workflow)
**Priority**: MUST HAVE

**User Story**:
As a real estate agent (Lisa),
I want to start/stop recording with one tap on my iPhone,
So that I can capture client conversations during property showings without fumbling with complex UI.

**Acceptance Criteria**:
- [ ] One-tap "Start Recording" button on mobile app home screen
- [ ] Recording indicator (red dot) visible but not intrusive
- [ ] One-tap "Stop Recording" button ends recording
- [ ] Audio quality: 16kHz minimum, 44.1kHz preferred (clear speech)
- [ ] Background recording: App continues recording when screen locks or user switches apps
- [ ] Battery usage: <5% battery drain per hour of recording
- [ ] Storage: Audio compressed to ~1MB/min (60-min showing = 60MB)
- [ ] Recording survives phone calls: Pauses during call, resumes after
- [ ] Airplane mode support: Recording continues without internet
- [ ] Works with Bluetooth headphones/earbuds for discrete recording

**Technical Notes**:
```swift
// iOS Implementation (SwiftUI + AVFoundation)
import AVFoundation

class AudioRecorder: ObservableObject {
    private var audioRecorder: AVAudioRecorder?
    private var audioSession: AVAudioSession = AVAudioSession.sharedInstance()

    @Published var isRecording = false
    @Published var recordingTime: TimeInterval = 0

    func startRecording(filename: String) {
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 44100,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]

        do {
            try audioSession.setCategory(.record, mode: .default)
            try audioSession.setActive(true)

            audioRecorder = try AVAudioRecorder(url: getFileURL(filename), settings: settings)
            audioRecorder?.record()
            isRecording = true

            // Start timer for recording duration
            startTimer()
        } catch {
            print("Recording failed: \(error.localizedDescription)")
        }
    }

    func stopRecording() -> URL? {
        audioRecorder?.stop()
        isRecording = false
        return audioRecorder?.url
    }
}
```

**Performance Requirements**:
- Recording start latency: <500ms from tap to recording active
- UI responsiveness: 60 FPS during recording
- No dropped audio frames (0% data loss)

**Accessibility**:
- VoiceOver support: "Recording button, double-tap to start"
- High contrast mode: Red recording indicator visible in all modes
- Haptic feedback: Vibration confirms start/stop

**Definition of Done**:
- [ ] iOS app can record 3-hour audio file without crashes
- [ ] Android app can record 3-hour audio file without crashes
- [ ] Battery usage measured: <5%/hour
- [ ] Audio quality verified: Clear speech at 2 meters distance
- [ ] Background recording tested: Survives phone lock, app switching, phone calls
- [ ] Unit tests: 95% code coverage for AudioRecorder class
- [ ] QA tested on iPhone 12+ and Android 11+ devices

---

### Story 2: State-Based Recording Consent System
**Story Points**: 21
**Persona**: All users (legal compliance)
**Priority**: CRITICAL (Legal liability)

**User Story**:
As a mortgage loan officer (Jennifer) in Washington State,
I want the app to warn me that I'm in a two-party consent state,
So that I don't accidentally commit a crime by recording without borrower consent.

**Acceptance Criteria**:
- [ ] App detects user's current state via GPS on recording start
- [ ] One-party consent states (38 states): Show optional disclosure recommendation
- [ ] Two-party consent states (12 states): Show MANDATORY consent requirement
- [ ] Consent warning appears BEFORE recording starts (cannot be dismissed without acknowledgment)
- [ ] Suggested consent script provided: "I'm recording this conversation for accuracy. Is that okay with you?"
- [ ] User must tap "I have obtained consent" before recording begins in two-party states
- [ ] First 10 seconds of recording flagged for manual review (verbal consent should be here)
- [ ] State consent law database maintained and updated quarterly
- [ ] User can override state detection (for edge cases like near state borders)

**State Classification**:

**Two-Party Consent States** (ALL parties must consent):
- California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana, Nevada, New Hampshire, Pennsylvania, Washington

**One-Party Consent States** (Only recording party must consent):
- All other 38 states + DC

**Technical Notes**:
```typescript
// State Consent Detection System
interface ConsentRequirement {
  state: string;
  requiresAllPartyConsent: boolean;
  legalReference: string;
  suggestedScript: string;
  warningLevel: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
}

const CONSENT_DATABASE: Record<string, ConsentRequirement> = {
  'CA': {
    state: 'California',
    requiresAllPartyConsent: true,
    legalReference: 'Cal. Penal Code § 632',
    suggestedScript: "I'm recording this conversation for accuracy and compliance. Is that okay with you?",
    warningLevel: 'MANDATORY'
  },
  'TX': {
    state: 'Texas',
    requiresAllPartyConsent: false,
    legalReference: 'Tex. Penal Code § 16.02',
    suggestedScript: "I'm recording this for my notes. Hope that's okay!",
    warningLevel: 'RECOMMENDED'
  },
  // ... 48 more states
};

async function checkRecordingConsent(location: Geolocation): Promise<ConsentRequirement> {
  const state = await reverseGeocodeToState(location);
  const requirement = CONSENT_DATABASE[state];

  if (requirement.requiresAllPartyConsent) {
    // Show BLOCKING modal: Cannot record until consent acknowledged
    showConsentModal({
      title: `⚠️ ${state} Requires All-Party Consent`,
      message: `You are in ${state}, a two-party consent state. You MUST obtain consent from all parties before recording.`,
      legalReference: requirement.legalReference,
      suggestedScript: requirement.suggestedScript,
      dismissable: false,
      confirmButton: 'I have obtained consent',
      cancelButton: 'Cancel recording'
    });
  } else {
    // Show NON-BLOCKING info: Recording allowed, consent recommended
    showConsentInfo({
      title: `ℹ️ ${state} Recording Laws`,
      message: `${state} is a one-party consent state. You may record without notice, but disclosure is recommended for transparency.`,
      suggestedScript: requirement.suggestedScript,
      dismissable: true
    });
  }

  return requirement;
}
```

**UI Flow**:
```
1. User taps "Start Recording"
2. App detects GPS location → User is in California
3. BLOCKING MODAL appears:
   ---
   ⚠️ California Requires All-Party Consent

   You are in California, a two-party consent state.

   You MUST obtain consent from all parties before recording.
   Violation is a CRIMINAL OFFENSE (Cal. Penal Code § 632).

   Suggested script:
   "I'm recording this conversation for accuracy. Is that okay?"

   [ Cancel ]  [ I Have Obtained Consent ]
   ---
4. User taps "I Have Obtained Consent"
5. Recording starts
6. First 10 seconds flagged in transcript: "⚠️ VERIFY CONSENT in this segment"
```

**Database Maintenance**:
- Legal team reviews state laws quarterly (laws can change)
- Update OTA (over-the-air) without app update required
- Version tracking: "Consent database v2024.Q4"

**Legal Disclaimer** (Terms of Service):
```
User Responsibilities:
- User is solely responsible for complying with state and federal recording laws
- App provides guidance based on user's GPS location, but accuracy not guaranteed
- User must verify consent requirements if recording near state borders or in unfamiliar jurisdictions
- Developer is not liable for user's violation of recording laws
```

**Performance Requirements**:
- GPS location detection: <2 seconds
- Consent modal display: <1 second after location detected
- Offline fallback: If no GPS/internet, default to "two-party consent" (safest assumption)

**Definition of Done**:
- [ ] All 50 states + DC in consent database with legal references
- [ ] GPS detection tested in all two-party consent states (12 states)
- [ ] Modal blocking verified: Cannot start recording without consent acknowledgment
- [ ] Legal team review completed and approved
- [ ] Privacy policy updated to include recording consent responsibilities
- [ ] User onboarding includes "State Recording Laws" tutorial
- [ ] QA tested: Cross state border (TX→CA), verify consent requirement changes

---

### Story 3: Local AI Processing with Ollama
**Story Points**: 21
**Persona**: David, Jennifer, Amanda (high-privacy requirements)
**Priority**: CRITICAL (Privacy compliance, competitive advantage)

**User Story**:
As a commercial broker (David) with strict NDA requirements,
I want to process my confidential meeting transcripts with local AI on my MacBook,
So that no sensitive client data (financial terms, deal structure, product confidential info) is ever sent to cloud services.

**Acceptance Criteria**:
- [ ] User can choose "Local AI (Ollama)" or "Cloud AI (Fast)" at app setup
- [ ] Local AI mode: Audio uploaded to user's Ollama server via encrypted connection
- [ ] Ollama server auto-discovery: Detect Ollama running on local network (Mac/PC/NAS)
- [ ] Manual server config: User can enter IP address + port if auto-discovery fails
- [ ] Processing status: Real-time progress indicator (0%-100%)
- [ ] Model support: LLaMA 3 70B (preferred), LLaMA 3 8B (fallback for low-RAM devices)
- [ ] Privacy guarantee: Zero data sent to OpenAI, Google, or any cloud service
- [ ] Transcript quality: 95%+ accuracy for clear speech (matches cloud AI baseline)
- [ ] Processing time: 2-5 minutes for 60-minute audio (acceptable latency)
- [ ] Fallback: If Ollama unavailable, offer cloud AI with explicit consent

**Technical Notes**:
```python
# Ollama Integration (Server-Side)

from ollama import Client
import whisper

class OllamaTranscriber:
    def __init__(self, ollama_host='http://localhost:11434'):
        self.client = Client(host=ollama_host)
        self.whisper_model = whisper.load_model("large-v3")

    def transcribe_audio(self, audio_file_path):
        """
        Step 1: Transcribe audio to text (Whisper)
        Step 2: Process with Ollama for summary, speakers, key points
        """
        # Step 1: Whisper transcription (runs locally)
        result = self.whisper_model.transcribe(audio_file_path, language='en')
        transcript_text = result['text']
        segments = result['segments']  # Timestamped segments

        # Step 2: Ollama processing (LLaMA 3 70B)
        prompt = f"""You are analyzing a real estate conversation transcript.

Transcript:
{transcript_text}

Extract the following:
1. Summary (5-7 bullet points of key discussion topics)
2. Key Numbers (prices, square footage, dates, dollar amounts)
3. Action Items (what needs to be done, by whom)
4. Concerns or Objections (any issues raised by participants)
5. Decisions Made (agreements, commitments)

Format as JSON.
"""

        response = self.client.generate(
            model='llama3:70b',
            prompt=prompt,
            stream=False
        )

        analysis = json.loads(response['response'])

        return {
            'transcript': transcript_text,
            'segments': segments,
            'summary': analysis['summary'],
            'key_numbers': analysis['key_numbers'],
            'action_items': analysis['action_items'],
            'concerns': analysis['concerns'],
            'decisions': analysis['decisions'],
            'processed_by': 'Ollama (Local)',
            'privacy_level': 'ZERO_CLOUD'
        }
```

**Client-Server Communication** (Encrypted):
```typescript
// Mobile App → Ollama Server (User's Home Network)

import { encrypt, decrypt } from './encryption';

async function uploadToOllamaServer(audioBlob: Blob, serverURL: string) {
  // Encrypt audio before transmission (even on local network)
  const encryptedAudio = await encrypt(audioBlob, userPrivateKey);

  const formData = new FormData();
  formData.append('audio', encryptedAudio);
  formData.append('user_id', userId);
  formData.append('recording_id', recordingId);

  const response = await fetch(`${serverURL}/api/transcribe`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userAuthToken}`,
      'X-Encryption': 'AES-256-GCM'
    },
    body: formData
  });

  const encryptedResult = await response.json();
  const decryptedTranscript = await decrypt(encryptedResult, userPrivateKey);

  return decryptedTranscript;
}

// Progress tracking (WebSocket)
const ws = new WebSocket(`wss://${serverURL}/ws/transcription/${recordingId}`);
ws.onmessage = (event) => {
  const progress = JSON.parse(event.data);
  // Update UI: "Processing: 47% - Analyzing key points..."
  updateProgressIndicator(progress.percent, progress.status);
};
```

**Ollama Server Setup** (User Documentation):
```markdown
# Setting Up Your Private Ollama Server

## Option 1: Mac Mini (Recommended for Jennifer, David, Amanda)
1. Purchase Mac Mini M2 Pro (32GB RAM) - $1,299
2. Install Ollama: `brew install ollama`
3. Download LLaMA 3 70B: `ollama pull llama3:70b`
4. Start server: `ollama serve`
5. In app: Settings → Local AI → Auto-Discover → Select "Mac Mini (192.168.1.100)"

## Option 2: Linux Server (Advanced)
1. Ubuntu 22.04 LTS server
2. Install Ollama: `curl -fsSL https://ollama.com/install.sh | sh`
3. Download model: `ollama pull llama3:70b`
4. Configure firewall: Allow port 11434
5. In app: Settings → Local AI → Manual Config → Enter IP:Port

## Option 3: Desktop/Laptop (David's Current Setup)
1. Install Ollama on MacBook Pro / Windows PC
2. Model runs when laptop is on and connected to power
3. Mobile app syncs when on same Wi-Fi network
4. Processing happens overnight if laptop is sleeping during the day
```

**Performance Benchmarks**:
| Hardware | Model | 60-min Audio | RAM Usage |
|----------|-------|--------------|-----------|
| Mac Mini M2 Pro (32GB) | LLaMA 3 70B | 2-3 min | 28GB |
| Mac Mini M2 (16GB) | LLaMA 3 8B | 5-7 min | 12GB |
| MacBook Pro M1 (16GB) | LLaMA 3 8B | 6-8 min | 12GB |
| Linux Server (64GB) | LLaMA 3 70B | 2-4 min | 42GB |

**Privacy Guarantees** (Marketing Copy):
```
🔒 ZERO-CLOUD GUARANTEE

With Local AI (Ollama), your data NEVER leaves your network:
✅ Audio processed on YOUR Mac/PC
✅ Transcripts stored on YOUR device
✅ NO data sent to OpenAI, Google, Microsoft
✅ Perfect for NDAs, TILA compliance, ITAR confidentiality

Your clients' financial info, deal terms, and personal data stay 100% private.

Used by loan officers, commercial brokers, and title companies who can't risk cloud breaches.
```

**Fallback to Cloud AI**:
```
If Ollama server unavailable:
1. Show warning: "Local AI server not found. Use Cloud AI?"
2. Explain trade-off: "Cloud AI is faster but sends data to OpenAI"
3. Require explicit consent: "I understand this recording contains [NO/SOME/HIGHLY] sensitive information"
4. If HIGHLY sensitive: Block cloud AI, require local processing
5. If NO/SOME sensitive: Allow cloud AI with disclaimer
```

**Definition of Done**:
- [ ] Ollama integration tested with LLaMA 3 70B and 8B models
- [ ] Encryption verified: AES-256-GCM for audio upload/download
- [ ] Auto-discovery works on home Wi-Fi networks
- [ ] Manual server config tested (IP + port entry)
- [ ] Progress indicator updates in real-time (WebSocket)
- [ ] Privacy policy updated: "Local AI never sends data to cloud"
- [ ] User documentation created: "Setting Up Your Ollama Server"
- [ ] QA tested: 10 users with Mac Mini, MacBook Pro, Linux servers
- [ ] Performance benchmarks measured and documented
- [ ] Legal team approved marketing claim: "Zero-Cloud Guarantee"

---

### Story 4: Basic Cloud Transcription (Fast Mode)
**Story Points**: 8
**Persona**: Lisa, Sarah, Robert (low-privacy needs, speed preferred)
**Priority**: MUST HAVE

**User Story**:
As a residential agent (Lisa) showing generic properties with no confidential info,
I want fast cloud-based transcription (<5 minutes),
So that I can review AI summaries between showings and send follow-ups quickly.

**Acceptance Criteria**:
- [ ] Audio uploaded to cloud API (OpenAI Whisper or Google Speech-to-Text)
- [ ] Transcription speed: <5 minutes for 60-minute audio
- [ ] Accuracy: 95%+ for clear speech in quiet environments
- [ ] Accuracy: 85%+ for noisy environments (HVAC, traffic, outdoor)
- [ ] Language support: English (US, UK, AU accents)
- [ ] Speaker diarization: Identify 2-3 speakers (Lisa + client + partner)
- [ ] Timestamped segments: Each sentence has start/end timestamp
- [ ] User toggle: "Fast Mode (Cloud)" vs. "Privacy Mode (Local)"
- [ ] Cost tracking: Show user estimated cost per transcript ($0.20-$0.50)
- [ ] Freemium limit: 10 cloud transcripts/month free, then paid subscription

**API Selection** (Cost Comparison):

| Provider | Cost | Speed | Accuracy | Speaker ID |
|----------|------|-------|----------|------------|
| OpenAI Whisper API | $0.006/min ($0.36/hr) | 2-3 min | 96% | No |
| Google Speech-to-Text | $0.016/min ($0.96/hr) | 1-2 min | 95% | Yes (extra $0.01/min) |
| AssemblyAI | $0.00025/sec ($0.90/hr) | 3-4 min | 94% | Yes (included) |

**Recommendation**: OpenAI Whisper (cheapest) + AssemblyAI for speaker diarization

**Technical Implementation**:
```typescript
// Cloud Transcription Service

import OpenAI from 'openai';
import AssemblyAI from 'assemblyai';

class CloudTranscriber {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private assemblyai = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

  async transcribeWithSpeakers(audioURL: string): Promise<Transcript> {
    // Step 1: Upload audio to AssemblyAI
    const uploadResponse = await this.assemblyai.files.upload(audioURL);

    // Step 2: Request transcription with speaker diarization
    const transcript = await this.assemblyai.transcripts.create({
      audio_url: uploadResponse.upload_url,
      speaker_labels: true,  // Enable speaker diarization
      language_code: 'en_us'
    });

    // Step 3: Poll for completion
    const result = await this.assemblyai.transcripts.waitUntilReady(transcript.id);

    // Step 4: Format for app
    return {
      text: result.text,
      segments: result.utterances.map(u => ({
        speaker: `Speaker ${u.speaker}`,  // "Speaker A", "Speaker B"
        text: u.text,
        start: u.start,
        end: u.end
      })),
      summary: await this.generateSummary(result.text),  // OpenAI GPT-4
      processed_by: 'Cloud AI (AssemblyAI + OpenAI)',
      cost: (result.audio_duration / 1000 / 60) * 0.00025  // $0.00025/second
    };
  }

  async generateSummary(transcript: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are analyzing a real estate showing. Extract 5-7 key bullet points.' },
        { role: 'user', content: transcript }
      ],
      max_tokens: 300
    });

    const summary = response.choices[0].message.content;
    return summary.split('\n').filter(line => line.trim().startsWith('-'));
  }
}
```

**Cost Management**:
- Track user's monthly cloud API spending
- Alert at 80% of budget: "You've used $8 of your $10 monthly cloud transcription budget"
- Suggest local AI: "Upgrade to Local AI (Ollama) for unlimited transcripts at no extra cost"

**Performance Requirements**:
- Upload speed: <30 seconds for 60MB audio file (depends on user's internet)
- Transcription processing: <5 minutes for 60-minute audio
- Download transcript: <5 seconds

**Definition of Done**:
- [ ] OpenAI Whisper API integrated and tested
- [ ] AssemblyAI speaker diarization tested with 2-3 speakers
- [ ] Cost tracking implemented and displayed to user
- [ ] Freemium limit enforced: 10 transcripts/month
- [ ] Error handling: API failures, timeout handling, retry logic
- [ ] QA tested: 100 real estate recordings (various accents, noise levels)
- [ ] Accuracy measured: 95%+ for clear speech, 85%+ for noisy environments

---

### Story 5: Property/Recording Tagging System
**Story Points**: 8
**Persona**: Lisa, Robert, Michael (organize recordings by property/project)
**Priority**: SHOULD HAVE

**User Story**:
As a real estate investor (Robert) viewing 3 properties in one day,
I want to tag each recording with the property address,
So that I can easily find and compare recordings later by property.

**Acceptance Criteria**:
- [ ] Auto-detect property address via GPS when recording starts
- [ ] Manual address entry: User can type/edit address
- [ ] Address autocomplete: Use Google Places API for suggestions
- [ ] Tags: #PropertyShowing, #ContractorBid, #ClientConsultation, #Inspection
- [ ] Custom tags: User can create custom tags like #TopPick, #Pass, #NeedSecondLook
- [ ] Search by tag: Find all recordings with #PropertyShowing tag
- [ ] Search by address: Find all recordings at "1423 Elm St"
- [ ] Bulk tagging: Select multiple recordings, apply same tag

**UI Flow**:
```
1. User taps "Start Recording"
2. GPS detects location → "You are at 1423 Elm St, Austin TX"
3. App suggests: "Recording at 1423 Elm St?"
   [ Yes, that's correct ]  [ No, enter manually ]
4. If YES → Auto-tag recording with address
5. User adds custom tags: #PropertyShowing #TopPick
6. Recording starts with metadata:
   - Address: 1423 Elm St
   - Tags: #PropertyShowing #TopPick
   - Date: Dec 21, 2024 10:00 AM
   - Duration: TBD
```

**Definition of Done**:
- [ ] GPS address detection implemented
- [ ] Google Places API integrated for autocomplete
- [ ] Tag system implemented (preset + custom tags)
- [ ] Search by tag and address tested
- [ ] QA: 50 recordings tagged and searched

---

## Sprint 01 Summary

**Total Story Points**: 89
**Duration**: 8 weeks
**Team**: 6 engineers (2 backend, 2 mobile, 1 AI/ML, 1 QA)

**Deliverables**:
✅ Mobile recording app (iOS + Android)
✅ State-based recording consent system (50 states)
✅ Local AI processing with Ollama
✅ Cloud transcription (OpenAI/AssemblyAI)
✅ Basic property tagging and search

**Success Metrics**:
- 100 beta users onboarded
- 95%+ transcription accuracy
- <5% battery usage per hour of recording
- Zero cloud uploads for Local AI users
- 100% compliance with state recording laws (verified by legal team)

**Risks & Mitigations**:
- **Risk**: Ollama processing too slow on low-end hardware
  - **Mitigation**: Offer cloud AI fallback, recommend Mac Mini ($1,299)
- **Risk**: GPS fails in buildings (can't detect state)
  - **Mitigation**: Default to two-party consent (safest), allow manual override
- **Risk**: AssemblyAI costs exceed budget
  - **Mitigation**: Cap freemium at 10 transcripts/month, enforce paid subscription

**Next Sprint**: Sprint 02 - Advanced Features (CRM integration, Fair Housing detection, multi-speaker ID)
