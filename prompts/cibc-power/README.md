# 🏆 CIBC Power by KATH - Complete Implementation Kit

**International Business Model Canvas Competition Platform**

---

## 📋 Overview

**Competition Name:** CIBC Power by KATH  
**Type:** International BMC Competition  
**Categories:** Student, Startup, Corporate  
**Prize Pool:** $100,000+ USD  
**Duration:** 3-4 months  
**Target:** 500+ teams from 20+ countries  

---

## 🎯 Quick Start

### Step 1: Read Master Plan
Start with: `CIBC_COMPETITION_FLOW.md`
- Complete business flow
- Competition structure
- Timeline template
- Success metrics

### Step 2: Run Agents in Order

#### Phase 1: Competition Design (BMC Consultant)
```bash
qwen-agent --prompt prompts/cibc-power/bmc-consultant-prompt.md
```
**Output:** Complete competition framework, judging criteria, judge guidelines

#### Phase 2: Visual Design (UI/UX Consultant)
```bash
qwen-agent --prompt prompts/cibc-power/uiux-consultant-prompt.md
```
**Output:** Visual identity, website design, templates, design system

#### Phase 3: Technical Build (Frontend Engineer)
```bash
qwen-agent --prompt prompts/cibc-power/frontend-engineer-prompt.md
```
**Output:** Production-ready competition platform

---

## 📁 File Structure

```
prompts/cibc-power/
├── README.md                          # This file
├── bmc-consultant-prompt.md           # Competition design
├── uiux-consultant-prompt.md          # Visual design
└── frontend-engineer-prompt.md        # Technical implementation

Root:
├── CIBC_COMPETITION_FLOW.md           # Master business plan
├── IMPLEMENTATION_PLAN.md             # Previous implementation plan
├── IMPLEMENTATION_GUIDE.md            # Previous implementation guide
└── SCANNING_SUMMARY.md                # Previous scanning results
```

---

## 🚀 Agent Collaboration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. BMC Consultant                                               │
│     ├── Design competition structure                            │
│     ├── Create judging criteria                                 │
│     ├── Prepare judge guidelines                                │
│     └── Create participant resources                            │
│                                                                  │
│         ↓ (Hands off to UI/UX)                                   │
│                                                                  │
│  2. UI/UX Consultant                                             │
│     ├── Design visual identity                                  │
│     ├── Create website mockups                                  │
│     ├── Design templates (pitch deck, BMC, certificates)        │
│     └── Document design system                                  │
│                                                                  │
│         ↓ (Hands off to Frontend)                                │
│                                                                  │
│  3. Frontend Engineer                                            │
│     ├── Setup project architecture                              │
│     ├── Build registration system                               │
│     ├── Implement dashboard                                     │
│     ├── Create submission system                                │
│     └── Build judging portal                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 What Each Agent Does

### BMC Consultant 🎯

**Role:** Competition Design Expert

**Deliverables:**
1. **Competition Framework**
   - Structure (phases, timeline)
   - Categories & eligibility
   - Rules & regulations
   - Prize distribution

2. **Judging System**
   - Criteria & rubric
   - Scoring methodology
   - Judge guidelines
   - Question bank (100+ questions)

3. **Participant Resources**
   - BMC template & guide
   - Pitch deck template
   - Executive summary guide
   - Video pitch tips

4. **Workshop Curriculum**
   - BMC fundamentals
   - Customer validation
   - Financial projection
   - Pitching skills

**Timeline:** 2-3 days

---

### UI/UX Consultant 🎨

**Role:** Visual Design Expert

**Deliverables:**
1. **Visual Identity**
   - Logo design (primary, secondary, icon)
   - Color palette (accessible, international)
   - Typography system
   - Icon set

2. **Website Design**
   - Landing page (desktop + mobile)
   - Dashboard (all pages)
   - Component library
   - Interaction specifications

3. **Templates**
   - Pitch deck (10-12 slides)
   - BMC template (printable)
   - Certificates (winner, finalist, participant)
   - Social media templates

4. **Design System**
   - Design tokens
   - Component documentation
   - Usage guidelines
   - Asset package

**Timeline:** 2-3 days

---

### Frontend Engineer 💻

**Role:** Technical Implementation Expert

**Deliverables:**
1. **Project Setup**
   - Tech stack configuration
   - Project structure
   - TypeScript setup
   - Tailwind config

2. **Authentication**
   - Registration flow (5 steps)
   - Email verification
   - Login system
   - Session management

3. **Dashboard**
   - Overview page
   - Profile management
   - Team management
   - Submission tracking

4. **Submission System**
   - File upload (BMC, pitch deck, video)
   - Progress tracking
   - Validation
   - Status updates

5. **Judging Portal**
   - Secure login
   - Scoring interface
   - Comment system
   - Results calculation

6. **Accessibility & Performance**
   - WCAG 2.1 AA compliance
   - Performance optimization
   - Bundle size optimization
   - Cross-browser testing

**Timeline:** 5-7 days

---

## ⏰ Total Timeline

| Phase | Agent | Duration | Output |
|-------|-------|----------|--------|
| 1 | BMC Consultant | 2-3 days | Competition framework |
| 2 | UI/UX Consultant | 2-3 days | Visual design |
| 3 | Frontend Engineer | 5-7 days | Platform built |
| **Total** | **All** | **9-13 days** | **Complete platform** |

---

## ✅ Success Criteria

### Competition Design
- [ ] Clear competition structure
- [ ] Fair judging criteria
- [ ] Comprehensive judge guidelines
- [ ] Helpful participant resources
- [ ] Realistic timeline

### Visual Design
- [ ] Professional visual identity
- [ ] Accessible color palette (WCAG AA)
- [ ] Responsive website design
- [ ] Easy-to-use templates
- [ ] Comprehensive design system

### Technical Build
- [ ] All features functional
- [ ] TypeScript compiles (0 errors)
- [ ] Accessibility passes (WCAG AA)
- [ ] Performance metrics met
- [ ] Production-ready code

---

## 🎯 How to Use Prompts

### For Best Results:

1. **Run Agents Sequentially**
   - Don't skip phases
   - Review output before next phase
   - Provide feedback to each agent

2. **Provide Context**
   - Answer clarification questions
   - Share examples you like
   - Specify constraints early

3. **Review Thoroughly**
   - Check all deliverables
   - Test functionality
   - Validate accessibility

4. **Iterate**
   - Request revisions if needed
   - Ask for alternatives
   - Refine based on feedback

---

## 📝 Example Agent Interactions

### Example 1: BMC Consultant

**You:** "Create judging rubric for innovation category"

**BMC Consultant:**
```markdown
## Innovation & Creativity (25 points)

### Novelty of Approach (8 points)
**8-7 points - Exceptional:**
- Breakthrough innovation
- First-to-market
- Patent-worthy

**6-5 points - Strong:**
- Significant improvement
- Clear differentiation

...
```

### Example 2: UI/UX Consultant

**You:** "Design color palette for international competition"

**UI/UX Consultant:**
```markdown
## Color Palette

### Primary Colors
**Power Blue #2563EB**
- Trust, professional
- Universal appeal
- WCAG contrast: 4.5:1 ✅

**Innovation Purple #7C3AED**
- Creativity, forward-thinking
- Complements blue

**Excellence Gold #F59E0B**
- Achievement, premium
- Use sparingly for emphasis
```

### Example 3: Frontend Engineer

**You:** "Build registration form with validation"

**Frontend Engineer:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // ...
});

export function RegisterForm() {
  // Implementation
}
```

---

## 🆘 Troubleshooting

### Issue: Agent Output Too Generic

**Solution:**
- Provide more specific context
- Share examples you like
- Ask for more detail
- Request iteration

### Issue: Design Not What You Expected

**Solution:**
- Share reference designs
- Specify style preferences
- Ask for alternatives
- Provide color/typography preferences

### Issue: Code Not Working

**Solution:**
- Share error messages
- Provide environment details
- Ask for debugging help
- Request simpler solution

---

## 📞 Support Resources

### Documentation
- `CIBC_COMPETITION_FLOW.md` - Business overview
- Individual agent prompts - Detailed tasks
- Previous docs - Technical reference

### Commands
```bash
# Run specific agent
qwen-agent --prompt prompts/cibc-power/[agent]-prompt.md

# Test build
npm run build

# Test accessibility
npm run lint
```

---

## 🎉 Getting Started

### Right Now:

1. **Read Master Plan**
   ```bash
   cat CIBC_COMPETITION_FLOW.md
   ```

2. **Start with BMC Consultant**
   ```bash
   qwen-agent --prompt prompts/cibc-power/bmc-consultant-prompt.md
   ```

3. **Review Output**
   - Check competition framework
   - Validate judging criteria
   - Review timeline

4. **Move to Next Agent**
   - After BMC Consultant complete
   - Run UI/UX Consultant
   - Then Frontend Engineer

---

## 📊 Progress Tracking

### Phase 1: Competition Design
- [ ] Competition framework created
- [ ] Judging criteria defined
- [ ] Judge guidelines written
- [ ] Participant resources prepared
- [ ] Workshop curriculum designed

### Phase 2: Visual Design
- [ ] Logo designed
- [ ] Color palette created
- [ ] Typography system defined
- [ ] Landing page designed
- [ ] Dashboard designed
- [ ] Templates created
- [ ] Design system documented

### Phase 3: Technical Build
- [ ] Project setup complete
- [ ] Registration flow built
- [ ] Dashboard implemented
- [ ] Submission system working
- [ ] Judging portal functional
- [ ] Accessibility passes
- [ ] Performance optimized

---

## 🏁 Final Deliverables

After completing all phases, you'll have:

1. **Competition Framework Document** (20-30 pages)
2. **Judge Handbook** (10-15 pages)
3. **Participant Guide** (10-15 pages)
4. **Visual Identity Guide** (15-20 pages)
5. **Design Mockups** (Figma/Sketch files)
6. **Templates** (Pitch deck, BMC, certificates)
7. **Complete Web Platform** (Production-ready code)
8. **Design System Documentation** (Comprehensive guide)

---

**Ready to build a world-class international competition? Start with Phase 1!** 🚀

---

**Last Updated:** March 17, 2026  
**Version:** 1.0.0  
**Status:** Ready for Implementation
