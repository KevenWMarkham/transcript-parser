# Sprint 01: Core Student Features - User Stories

**Epic**: Epic 09 - Student Module
**Sprint**: 01 of 3
**Duration**: 2 weeks
**Sprint Goal**: Deliver core AI-powered study tools that save students time and improve comprehension

---

## 📊 Sprint Overview

### Story Points Breakdown
- **Total Points**: 34
- **Must Have**: 26 points
- **Should Have**: 6 points
- **Could Have**: 2 points

### Priority Distribution
- 🔴 **High Priority (Must Have)**: 5 stories
- 🟡 **Medium Priority (Should Have)**: 2 stories
- 🟢 **Low Priority (Could Have)**: 1 story

---

## 🔴 High Priority Stories (Must Have)

### Story 1: Student Profile Extension
**Story Points**: 3
**Persona**: All students (Sarah, Marcus, Aisha, Jordan)

#### User Story
```
As a student using Transcript Parser
I want to create a student-specific profile
So that I can customize the app for my academic needs and get personalized AI recommendations
```

#### Acceptance Criteria
- [ ] Student can select "Student" persona type during profile setup
- [ ] Profile includes student-specific fields:
  - [ ] University/School name
  - [ ] Major/Field of study
  - [ ] Academic year (Freshman, Sophomore, Junior, Senior, Graduate)
  - [ ] Current courses (list, can add/remove)
  - [ ] Learning preferences (visual, auditory, kinesthetic, read/write)
  - [ ] Study goals (text field)
  - [ ] Accessibility needs (dropdown: Dyslexia, ADHD, Visual impairment, Hearing impairment, None)
- [ ] Profile data is saved to database
- [ ] Profile can be edited after initial setup
- [ ] Profile preferences affect AI recommendations (e.g., dyslexia mode auto-enables certain features)

#### Technical Notes
- Extends existing UserProfile type from @transcript-parser/types
- Add new StudentProfile interface with student-specific fields
- Database schema update (add student_profiles table)
- Form validation for required fields

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] Unit tests pass (profile creation, update, retrieval)
- [ ] Integration tests pass (database operations)
- [ ] UI/UX review approved
- [ ] Accessibility tested (WCAG AA)
- [ ] Documentation updated

---

### Story 2: AI Lecture Summarizer
**Story Points**: 8
**Persona**: Sarah, Aisha, Jordan (time-constrained, comprehension-focused)

#### User Story
```
As a student with limited study time
I want AI to automatically generate a concise summary of my lecture
So that I can quickly review key concepts without re-watching the entire recording
```

#### Acceptance Criteria
- [ ] "Generate Summary" button appears on transcript page
- [ ] Summary is generated within 30 seconds for 90-min lecture
- [ ] Summary includes:
  - [ ] Main topic (1 sentence)
  - [ ] Key concepts (3-5 bullet points)
  - [ ] Important definitions (if any)
  - [ ] Examples/case studies mentioned
  - [ ] Action items (if applicable, e.g., "Read Chapter 5 for next class")
- [ ] Summary length is configurable (brief/medium/detailed)
- [ ] Summary is saved with transcript
- [ ] Summary can be edited by user
- [ ] Summary can be exported (PDF, TXT, Markdown)
- [ ] Summary respects language preferences (simplified English for ESL students)

#### AI Prompt Engineering
```
Analyze this lecture transcript and create a study-focused summary:

Transcript: {transcript_text}
Student Level: {academic_year}
Subject: {course_subject}

Generate:
1. Main Topic (1 sentence)
2. Key Concepts (3-5 points, focus on exam-relevant material)
3. Important Definitions (term: definition format)
4. Examples/Case Studies (brief descriptions)
5. Action Items (homework, readings, exam dates)

Style: Clear, concise, student-friendly language
Length: {brief|medium|detailed}
```

#### Performance Requirements
- Summary generation: < 30 seconds for 90-min lecture
- API cost: < $0.05 per summary (optimize token usage)
- Success rate: 95%+ (handle errors gracefully)

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] AI prompts tested with 10+ lecture types (STEM, humanities, business)
- [ ] Performance benchmarks met
- [ ] Unit tests pass
- [ ] User testing with 5 students (80%+ satisfaction)
- [ ] Export functionality tested
- [ ] Documentation updated

---

### Story 3: Flashcard Generator
**Story Points**: 8
**Persona**: Sarah (exam prep), Jordan (spelling accuracy), Aisha (language learning)

#### User Story
```
As a student preparing for exams
I want AI to automatically create flashcards from my lecture
So that I can study effectively without spending hours making flashcards manually
```

#### Acceptance Criteria
- [ ] "Generate Flashcards" button on transcript page
- [ ] Flashcards generated within 20 seconds for 90-min lecture
- [ ] AI extracts:
  - [ ] Terminology (term/definition pairs)
  - [ ] Concepts (question/explanation pairs)
  - [ ] Dates & events (for history, timeline-based courses)
  - [ ] Equations & formulas (for STEM courses)
  - [ ] People & their contributions
- [ ] Generates 20-30 cards per 90-min lecture (configurable)
- [ ] Flashcard interface shows:
  - [ ] Front (term/question)
  - [ ] Back (definition/answer)
  - [ ] Source (timestamp link to transcript)
- [ ] User can:
  - [ ] Review cards in-app (flip animation)
  - [ ] Edit cards (fix AI errors)
  - [ ] Delete cards
  - [ ] Add custom cards
  - [ ] Mark cards as "mastered"
- [ ] Export options:
  - [ ] Anki format (.apkg)
  - [ ] Quizlet format (.txt)
  - [ ] CSV
  - [ ] PDF (printable)

#### Accessibility Features
- [ ] **For Dyslexia (Jordan)**:
  - [ ] Dyslexia-friendly font option (OpenDyslexic)
  - [ ] Text-to-speech for cards
  - [ ] Large text mode
- [ ] **For International Students (Aisha)**:
  - [ ] Option to add translation on back of card
  - [ ] Bilingual flashcards (English term + native language definition)

#### AI Prompt Engineering
```
Extract study-worthy flashcard content from this lecture:

Transcript: {transcript_text}
Subject: {course_subject}
Student Level: {academic_year}

Create 20-30 flashcards with:
- Important terminology (term → definition)
- Key concepts (question → explanation)
- {if history: dates & events}
- {if STEM: formulas & their applications}
- {if any: people & contributions}

Format:
Front: Clear, concise question/term
Back: Complete but brief answer (2-3 sentences max)

Prioritize exam-relevant content over minor details.
```

#### Performance Requirements
- Generation time: < 20 seconds
- Accuracy: 90%+ cards are relevant and correct
- API cost: < $0.03 per flashcard set

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] AI tested across subjects (Biology, History, CS, Business)
- [ ] Export formats tested (Anki import successful)
- [ ] Spaced repetition algorithm implemented (optional for Sprint 01)
- [ ] Accessibility features tested with Jordan persona
- [ ] User testing with 5 students (85%+ find cards useful)
- [ ] Documentation updated

---

### Story 4: Practice Quiz Generator
**Story Points**: 5
**Persona**: Sarah (self-testing), Aisha (comprehension check)

#### User Story
```
As a student preparing for exams
I want AI to generate practice quiz questions from my lecture
So that I can test my understanding and identify knowledge gaps
```

#### Acceptance Criteria
- [ ] "Generate Quiz" button on transcript page
- [ ] Quiz generated within 30 seconds
- [ ] Question types:
  - [ ] Multiple choice (4 options, 1 correct)
  - [ ] True/False
  - [ ] Short answer (optional)
- [ ] Generates 15-20 questions per 90-min lecture
- [ ] Difficulty levels:
  - [ ] Easy (recall facts)
  - [ ] Medium (apply concepts)
  - [ ] Hard (analyze/synthesize)
- [ ] Quiz interface:
  - [ ] One question at a time
  - [ ] Submit answer → immediate feedback (correct/incorrect)
  - [ ] Explanation for wrong answers
  - [ ] Score at end (percentage + grade)
  - [ ] Review wrong answers
- [ ] Quiz results saved:
  - [ ] Score history
  - [ ] Weak topics identified
  - [ ] Recommendations for review
- [ ] Can retake quiz (questions randomized)

#### AI Prompt Engineering
```
Generate a practice quiz from this lecture transcript:

Transcript: {transcript_text}
Subject: {course_subject}
Student Level: {academic_year}

Create 15-20 questions:
- 10 multiple choice (4 options each)
- 5 true/false
- (optional) 5 short answer

Difficulty distribution:
- 40% Easy (recall facts, definitions)
- 40% Medium (apply concepts, identify examples)
- 20% Hard (analyze relationships, synthesize ideas)

For each question, provide:
1. Question text
2. Correct answer
3. Explanation (why correct answer is right, why others are wrong)
4. Timestamp in lecture (for review)
```

#### Performance Requirements
- Generation time: < 30 seconds
- Question quality: 90%+ are answerable from lecture
- No duplicate questions in same quiz

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] AI tested (questions are clear, answers are correct)
- [ ] Quiz UI implemented (responsive, accessible)
- [ ] Score tracking works
- [ ] Weak topic identification accurate
- [ ] User testing (students find quizzes helpful)
- [ ] Documentation updated

---

### Story 5: Key Concept Highlighter
**Story Points**: 2
**Persona**: Aisha (needs guidance on importance), Jordan (reduces reading load)

#### User Story
```
As a student who doesn't know what's important
I want AI to automatically highlight key concepts in my transcript
So that I can focus on exam-relevant material instead of reading everything
```

#### Acceptance Criteria
- [ ] AI automatically highlights key concepts in transcript
- [ ] Highlighting categories:
  - [ ] 🔴 Critical (definitions, formulas, main arguments)
  - [ ] 🟡 Important (supporting concepts, examples)
  - [ ] 🟢 Useful (additional context, details)
- [ ] Visual indicators:
  - [ ] Background color highlighting
  - [ ] Sidebar icons
  - [ ] Hover tooltips ("Why is this important?")
- [ ] Filter view:
  - [ ] Show only critical highlights
  - [ ] Show critical + important
  - [ ] Show all
- [ ] Exportable:
  - [ ] "Export Highlights Only" option
  - [ ] Creates study guide from highlighted sections
- [ ] User can:
  - [ ] Toggle highlights on/off
  - [ ] Manually add highlights
  - [ ] Adjust AI highlight importance

#### AI Prompt Engineering
```
Identify key concepts in this lecture for highlighting:

Transcript: {transcript_text}
Subject: {course_subject}

Categorize each important statement as:
- CRITICAL: Definitions, formulas, thesis statements, main arguments
- IMPORTANT: Supporting concepts, examples that illustrate main ideas
- USEFUL: Context, background, interesting but not exam-critical

Return:
{
  critical: [{ text: "...", start_time: "00:15:30", reason: "..." }],
  important: [{ text: "...", start_time: "00:20:15", reason: "..." }],
  useful: [{ text: "...", start_time: "00:35:00", reason: "..." }]
}
```

#### Performance Requirements
- Highlighting: < 10 seconds after transcript completes
- Accuracy: 85%+ of highlights are relevant

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] Highlighting visually clear (color-blind friendly)
- [ ] Performance benchmarks met
- [ ] Accessibility tested (screen reader announces highlights)
- [ ] User testing (students agree with importance categorization)
- [ ] Documentation updated

---

## 🟡 Medium Priority Stories (Should Have)

### Story 6: Course Organization
**Story Points**: 3
**Persona**: Sarah, Marcus (organize by class)

#### User Story
```
As a student taking multiple courses
I want to organize my transcripts by course
So that I can easily find lectures for specific classes
```

#### Acceptance Criteria
- [ ] Create "Courses" section in app
- [ ] User can:
  - [ ] Create new course (name, code, semester, professor)
  - [ ] Assign transcripts to courses
  - [ ] View all transcripts in a course
  - [ ] Archive courses (completed semesters)
- [ ] Course dashboard shows:
  - [ ] Number of lectures recorded
  - [ ] Total study time
  - [ ] Flashcard sets created
  - [ ] Quiz scores average
- [ ] Bulk operations:
  - [ ] Tag multiple transcripts to course
  - [ ] Export all course materials
  - [ ] Generate course-wide study guide

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] UI/UX tested
- [ ] Database schema supports courses
- [ ] Works with existing transcripts (can retroactively assign)
- [ ] Documentation updated

---

### Story 7: Search Across Lectures
**Story Points**: 3
**Persona**: Marcus (research), Jordan (spell-tolerant needed)

#### User Story
```
As a student reviewing for exams
I want to search for concepts across all my lectures
So that I can find where topics were discussed without manually reviewing each lecture
```

#### Acceptance Criteria
- [ ] Global search bar accessible from dashboard
- [ ] Search features:
  - [ ] Keyword search (finds in all transcripts)
  - [ ] Filter by course, date range, speaker
  - [ ] Semantic search (find concepts, not just exact words)
  - [ ] **Spell-tolerant search** (for Jordan - dyslexia support)
- [ ] Search results show:
  - [ ] Transcript title & course
  - [ ] Matching text snippet (highlighted)
  - [ ] Timestamp
  - [ ] Relevance score
- [ ] Click result → jumps to exact location in transcript
- [ ] Save searches (frequent searches remembered)

#### Accessibility Features
- [ ] **Spell-tolerant search** for dyslexia:
  - "Missuri Compromise" → finds "Missouri Compromise"
  - Handles common transpositions (b/d, p/q, etc.)

#### Performance Requirements
- Search across 50 transcripts: < 2 seconds
- Relevance accuracy: 90%+

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] Search algorithm tested (keyword + semantic)
- [ ] Spell tolerance tested with dyslexic patterns
- [ ] Performance benchmarks met
- [ ] User testing (students find results relevant)
- [ ] Documentation updated

---

## 🟢 Low Priority Stories (Could Have)

### Story 8: Spaced Repetition Reminders
**Story Points**: 2
**Persona**: Sarah (wants better retention)

#### User Story
```
As a student who forgets material over time
I want reminders to review flashcards at optimal intervals
So that I retain information long-term using spaced repetition
```

#### Acceptance Criteria
- [ ] Spaced repetition algorithm implemented
- [ ] Review intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month
- [ ] Notifications:
  - [ ] In-app notification badge
  - [ ] Email reminder (optional)
  - [ ] Push notification (optional)
- [ ] User can:
  - [ ] Snooze reminder
  - [ ] Mark as reviewed
  - [ ] Adjust review frequency
- [ ] Tracks:
  - [ ] Cards due for review
  - [ ] Mastery level per card
  - [ ] Review completion rate

#### Technical Notes
- Use proven spaced repetition algorithm (SM-2 or similar)
- Store review history per flashcard
- Calculate next review date based on performance

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] Algorithm tested (intervals are appropriate)
- [ ] Notifications work (in-app, email)
- [ ] User can customize settings
- [ ] Documentation updated

---

## 📋 Sprint Planning Notes

### Dependencies
- All stories depend on existing transcript functionality
- Story 2-5 require AI integration (Gemini API)
- Story 6 requires database schema updates
- Story 7 requires search infrastructure

### Risks
- **AI Cost**: Multiple AI calls per lecture (summary + flashcards + quiz + highlights)
  - Mitigation: Optimize prompts, batch processing, caching
- **AI Accuracy**: Generated content may have errors
  - Mitigation: User can edit, confidence scores, testing across subjects
- **Performance**: AI processing time may exceed targets
  - Mitigation: Background processing, progress indicators

### Success Metrics
- [ ] 80%+ of users generate summaries/flashcards/quizzes
- [ ] Time savings: 60+ minutes per lecture (vs. manual methods)
- [ ] User satisfaction: 8+/10
- [ ] AI accuracy: 90%+ for flashcards/quizzes
- [ ] Performance: All AI operations complete within specified times

---

## 🔗 Related Documents

- [Sarah's Persona](../personas/Sarah%20-%20Diligent%20Undergrad.md)
- [Marcus's Persona](../personas/Marcus%20-%20Graduate%20Student.md)
- [Aisha's Persona](../personas/Aisha%20-%20International%20Student.md)
- [Jordan's Persona](../personas/Jordan%20-%20Student%20with%20Dyslexia.md)
- [Epic 09 Overview](../../Epic%2009%20-%20Student%20Module%20-%20Overview.md)
- [Sprint 02 - Advanced Features](./Sprint%2002%20-%20Advanced%20Features.md)

---

**Created**: December 21, 2024
**Sprint Start**: TBD
**Sprint End**: TBD
