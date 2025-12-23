# Expert Feedback: Accessibility

**Sprint**: Sprint 01 - User Authentication & Basic Profiles
**Epic**: Epic 02 - User Profiles & Persona System
**Expert Role**: Accessibility Expert
**Expert Name**: Dr. Aisha Patel
**Date**: 2025-12-21
**Review Type**: Pre-Implementation Review

---

## Review Scope

Accessibility analysis covering:

- WCAG AA compliance (target: 100%)
- Keyboard navigation
- Screen reader support (NVDA, JAWS, VoiceOver)
- Color contrast ratios
- Focus management
- Form accessibility
- ARIA labels and roles
- Accessible onboarding wizard
- Testing strategy

---

## Expert Profile

**Name**: Dr. Aisha Patel

**Background**:
Accessibility specialist with 11 years of experience in inclusive design. Works with W3C Web Accessibility Initiative. Led accessibility initiatives at Microsoft, Apple, and Adobe. Expert in WCAG 2.1/2.2, ARIA, and assistive technology testing.

**Credentials**:

- Ph.D. Human-Computer Interaction, Carnegie Mellon
- IAAP Certified Professional in Accessibility Core Competencies (CPACC)
- W3C ARIA Working Group Member
- Author: "Inclusive Design for the Web" (A Book Apart)

---

## Strengths of Proposed Approach

### 1. WCAG AA Commitment

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

Explicit commitment to WCAG AA compliance is excellent.

**Why This Matters**:

- Legal requirement in many jurisdictions (ADA, Section 508, EN 301 549)
- Moral imperative (15% of global population has disabilities)
- Better UX for everyone (curb-cut effect)

**Success Criterion**: 100% WCAG AA is ambitious and appropriate.

---

### 2. Keyboard Navigation Awareness

**Rating**: ⭐⭐⭐⭐ (4/5)

FIGMA prompts mention keyboard navigation support.

**Good**: Awareness of keyboard-only users.

**Why Not 5/5**: No specifics on keyboard shortcuts, focus trapping, or skip links.

---

### 3. Screen Reader Consideration

**Rating**: ⭐⭐⭐⭐ (4/5)

Plan mentions screen reader compatibility and ARIA labels.

**Good**: Awareness of screen reader users.

**Missing**: No screen reader testing plan or ARIA implementation details.

---

### 4. High Contrast Commitment

**Rating**: ⭐⭐⭐⭐⭐ (5/5)

Color contrast ratios mentioned in FIGMA prompts.

**Why Excellent**: Color contrast is one of most common WCAG failures. Proactive attention prevents issues.

---

## Areas of Concern

### ⚠️ No Accessibility Testing Tools Specified

**Severity**: High
**Impact**: Cannot verify WCAG compliance without testing

**Concern**:
Plan commits to WCAG AA but doesn't specify testing tools.

**Recommended Tools**:

- **axe DevTools**: Browser extension for automated WCAG checks
- **WAVE**: Web accessibility evaluation tool
- **Pa11y**: Automated accessibility testing (CI/CD integration)
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (macOS/iOS)
- **Lighthouse**: Accessibility audit in Chrome DevTools

**Recommendation**:
Add axe and Lighthouse to CI/CD pipeline.

---

### ⚠️ Persona Selection May Confuse Screen Reader Users

**Severity**: High
**Impact**: Core UX decision point inaccessible

**Concern**:
Persona selection cards may not convey information clearly to screen readers.

**Problems**:

1. **Visual-only differentiation**: Color coding (blue for Real Estate, purple for Student) doesn't help screen readers
2. **Card layout**: Screen readers may read content in wrong order
3. **Multi-select**: Checkboxes vs. buttons confusion
4. **"Select" button state**: No indication if persona is already selected

**Example Bad Screen Reader Experience**:

> "Choose Your Path heading level 1. Select one or more personas. Button Real Estate Professional. Button Select. Description Make informed decisions about property buying, selling, and investing. Button Student. Button Select. Description Navigate academic and career decisions."

**User Confusion**: Which button does what? Is Real Estate selected?

**Recommendations**:

1. **Use proper ARIA roles**: `role="checkbox"` for multi-select personas
2. **Announce selection state**: `aria-pressed="true"` when selected
3. **Group related content**: `<fieldset>` and `<legend>` for persona groups
4. **Meaningful labels**: "Select Real Estate Professional persona"

**Accessible Code Example**:

```html
<fieldset>
  <legend>Choose Your Persona (select one or more)</legend>

  <div
    role="checkbox"
    aria-checked="false"
    aria-labelledby="real-estate-label"
    aria-describedby="real-estate-desc"
    tabindex="0"
  >
    <h3 id="real-estate-label">Real Estate Professional</h3>
    <p id="real-estate-desc">
      Make informed decisions about property buying, selling, and investing
    </p>
  </div>

  <div
    role="checkbox"
    aria-checked="true"
    aria-labelledby="student-label"
    aria-describedby="student-desc"
    tabindex="0"
  >
    <h3 id="student-label">Student</h3>
    <p id="student-desc">
      Navigate academic and career decisions with confidence
    </p>
    <span class="visually-hidden">Selected</span>
  </div>
</fieldset>
```

---

### ⚠️ No Focus Management for Onboarding Wizard

**Severity**: High
**Impact**: Confusing keyboard navigation

**Concern**:
Multi-step onboarding wizard requires careful focus management.

**Problems**:

1. **Focus loss**: After clicking "Continue", where does focus go?
2. **Back navigation**: Can keyboard users go back?
3. **Error announcement**: Do error messages announce to screen readers?
4. **Progress indicator**: Is progress announced?

**Recommendations**:

1. **Focus next heading** after "Continue": Move focus to "Welcome" heading on next screen
2. **Skip to content**: Add skip link to bypass repeated elements
3. **Live regions**: Use `aria-live="polite"` for error messages
4. **Progress announcements**: `aria-live="polite"` for "Step 2 of 4"

**Code Example**:

```javascript
function goToNextStep() {
  setCurrentStep(currentStep + 1)

  // Focus management
  setTimeout(() => {
    const nextHeading = document.querySelector('h1')
    nextHeading?.focus()
  }, 100)

  // Announce progress
  announceToScreenReader(`Step ${currentStep + 1} of 4: ${stepTitle}`)
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.textContent = message
  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000)
}
```

---

### ⚠️ Form Validation Accessibility Missing

**Severity**: High
**Impact**: Users can't understand errors

**Concern**:
Registration and profile forms need accessible error handling.

**Problems**:

1. **Errors not announced**: Screen readers miss "Password too weak"
2. **No error association**: Error messages not linked to input fields
3. **Color-only errors**: Red border doesn't help screen readers
4. **No error summary**: Multiple errors aren't summarized

**Recommendations**:

1. **Associate errors with inputs**: Use `aria-describedby`
2. **Announce errors**: Use `aria-live="assertive"` for critical errors
3. **Error summary**: Add error list at top of form
4. **Required fields**: Use `aria-required="true"`

**Code Example**:

```html
<label for="password"> Password <span aria-label="required">*</span> </label>
<input
  type="password"
  id="password"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="password-error password-requirements"
/>
<div id="password-error" role="alert" aria-live="assertive">
  Password must be at least 8 characters
</div>
<div id="password-requirements">
  Requirements: 8+ characters, uppercase, number
</div>
```

---

### ⚠️ Missing Skip Links

**Severity**: Medium
**Impact**: Keyboard users waste time navigating repeated content

**Concern**:
No mention of skip links for keyboard users.

**Why This Matters**:
Keyboard users must tab through navigation, header, etc. on every page. Skip links let them jump to main content.

**Recommendation**:
Add skip link as first focusable element:

```html
<a href="#main-content" class="skip-link"> Skip to main content </a>

<!-- ... header, nav, etc. ... -->

<main id="main-content">
  <!-- Content here -->
</main>
```

**CSS**:

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

### ⚠️ Color Contrast Not Verified

**Severity**: Medium
**Impact**: Low vision users can't read text

**Concern**:
FIGMA prompts mention contrast but no verification strategy.

**WCAG AA Requirements**:

- Normal text (< 24px): 4.5:1 contrast ratio
- Large text (>= 24px): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Concern**: Secondary text color `#6B7280` (gray) on white background is borderline:

- Ratio: ~4.6:1 (barely passes for normal text)
- Fails for UI components if used on buttons

**Recommendation**:
Test all color combinations with WebAIM Contrast Checker:

- Primary text: #111827 on #FFFFFF = 16.1:1 ✅
- Secondary text: #6B7280 on #FFFFFF = 4.6:1 ✅ (normal text only)
- Links: #3B82F6 on #FFFFFF = 4.5:1 ✅

Add to design system documentation.

---

## Recommendations

### Must Do (Critical - P0)

#### 1. Implement Accessible Persona Selection

**Priority**: P0
**Estimated Effort**: 6 hours

**Implementation**:

- Use `role="checkbox"` or `role="radio"` (if single-select)
- Add `aria-checked`, `aria-pressed` states
- Use `fieldset` and `legend` for grouping
- Test with NVDA and VoiceOver

---

#### 2. Add Focus Management to Onboarding Wizard

**Priority**: P0
**Estimated Effort**: 4 hours

**Implementation**:

- Focus heading on step change
- Add `aria-live` regions for progress
- Implement keyboard shortcuts (optional: Esc to cancel)
- Test full keyboard flow

---

#### 3. Implement Accessible Form Validation

**Priority**: P0
**Estimated Effort**: 4 hours

**Implementation**:

- Add `aria-invalid`, `aria-describedby`
- Use `aria-live="assertive"` for errors
- Create error summary component
- Test with screen readers

---

#### 4. Add Automated Accessibility Testing

**Priority**: P0
**Estimated Effort**: 3 hours

**Implementation**:

```javascript
// Vitest + jest-axe
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('PersonaSelection is accessible', async () => {
  const { container } = render(<PersonaSelection />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

Add Lighthouse CI to GitHub Actions.

---

### Should Do (High Priority - P1)

#### 5. Add Skip Links

**Priority**: P1
**Estimated Effort**: 1 hour

**Implementation**: See code example above.

---

#### 6. Screen Reader Testing with Real Users

**Priority**: P1
**Estimated Effort**: 8 hours

**Recommendation**:
Recruit 2-3 screen reader users for user testing.

**Test Scenarios**:

- Complete onboarding flow
- Select persona
- Install module
- Edit profile

**Pay participants** for their time and expertise.

---

#### 7. Document Keyboard Shortcuts

**Priority**: P1
**Estimated Effort**: 2 hours

**Recommended Shortcuts**:

- `Tab`: Navigate forward
- `Shift+Tab`: Navigate backward
- `Enter/Space`: Activate buttons/checkboxes
- `Esc`: Close modals
- `?`: Show keyboard shortcuts help

Create keyboard shortcuts help modal (triggered by `?` key).

---

### Could Do (Nice to Have - P2)

#### 8. Add Focus Visible Indicators

**Priority**: P2
**Estimated Effort**: 2 hours

**Recommendation**:
Use `:focus-visible` instead of `:focus` to show focus only for keyboard users:

```css
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

---

#### 9. Add Reduced Motion Support

**Priority**: P2
**Estimated Effort**: 2 hours

**Recommendation**:
Respect `prefers-reduced-motion` for users with vestibular disorders:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Approval Status

### Overall Assessment

Accessibility awareness is **good** with WCAG AA commitment, but critical implementation details are missing.

### Recommendation

- [x] **Approved with Conditions** ✅

**Conditions**:

1. ✅ **Accessible Persona Selection** (6 hours)
2. ✅ **Focus Management** (4 hours)
3. ✅ **Form Validation Accessibility** (4 hours)
4. ✅ **Automated Testing** (3 hours)

**Total**: ~17 hours (2 days)

### Confidence Level

**Confidence in WCAG AA Compliance**: **Medium** (65%)

**After Conditions**: **90%**

### Risk Level

**Overall Accessibility Risk**: **High → Low** (after conditions)

**Primary Risks**:

1. Persona selection inaccessible → High impact
2. Form validation not announced → Medium impact
3. Focus management missing → Medium impact

All risks mitigated by Must Do items.

---

## Additional Notes

### Accessibility Testing Checklist

- [ ] Automated testing (axe, Lighthouse)
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Color contrast verification
- [ ] Focus indicators visible
- [ ] Forms properly labeled
- [ ] Error messages announced
- [ ] Skip links functional

---

**Document Version**: 1.0
**Last Updated**: 2025-12-21
**Status**: Accessibility Review Complete
