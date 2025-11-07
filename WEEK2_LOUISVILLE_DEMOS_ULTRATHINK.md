# Week 2 Louisville Demos - ULTRATHINK Execution Strategy
**Generated:** November 7, 2025 @ 1:45 AM
**Context:** Day 6 automation complete, pivoting to revenue-generating demos
**Goal:** Build Restaurant Analyzer + Sales Email Scorer for Louisville market validation

---

## Executive Summary

**Strategic Question:** What's the optimal execution path for Week 2 Louisville demos?

**Answer:** Sequential build (Restaurant Analyzer → Sales Email Scorer) with parallel frontend/backend development where possible.

**Time Budget:** 18 hours (12h Restaurant + 6h Email Scorer)
**Expected Outcome:** 2 new demos targeting Louisville SMBs, 50+ email outreach candidates

**Critical Success Factors:**
1. Real Louisville restaurant data (Jack Fry's, Proof on Main, etc.)
2. Practical business value (not academic demos)
3. Sample data buttons (3x completion rate)
4. Deploy with new GitHub Actions (test automation)

---

## Strategic Context: Why These Demos?

### Restaurant Analyzer - The Louisville Hook

**Market Validation Questions:**
- Do Louisville restaurants care about review sentiment?
- Will they pay for deeper customer insight?
- Can AI provide actionable recommendations?

**Why This Demo:**
1. **Universal Problem:** Every restaurant owner reads reviews obsessively
2. **Emotional Connection:** Reviews = reputation = revenue
3. **Local Specificity:** Using actual Louisville restaurants = "This is for me"
4. **Consultation Hook:** "Free analysis" → "Want weekly reports?" → $500/mo retainer

**Target Customers (Louisville):**
- Jack Fry's (upscale Southern)
- Proof on Main (hotel restaurant)
- Hammerheads (casual gastropub)
- Bourbon Raw (seafood)
- Milkwood (neighborhood spot)
- Naive (modern American)

**Outreach Script:**
```
Subject: Free AI Review Analysis for [Restaurant Name]

Hi [Owner],

I noticed [Restaurant Name] has [X] Google reviews. I built an AI tool
that analyzes sentiment and finds patterns in customer feedback.

Would you be interested in a free analysis? Takes 2 minutes, might
surface insights you hadn't noticed.

Happy to show you what it finds.

Matthew Scott
AI Consultant, Louisville
projectlavos.com
```

**Expected Response Rate:** 10-20% (5-10 restaurant owners reply)
**Expected Conversion:** 1-2 consultation calls

---

### Sales Email Scorer - The Universal Tool

**Market Validation Questions:**
- Do SMBs struggle with cold email?
- Will they use a free scorer?
- Can AI improve email performance measurably?

**Why This Demo:**
1. **Universal Need:** Every business sends sales emails
2. **Immediate Feedback:** Score + suggestions = instant value
3. **Shareable:** Sales teams forward to colleagues
4. **Consultation Hook:** "Want me to audit your entire email sequence?" → $1500 project

**Target Customers (Louisville):**
- Real estate agents (Semonin, Parks, etc.)
- IT consultants (local MSPs)
- Marketing agencies
- Legal firms (estate planning, family law)
- Financial advisors

**Outreach Script:**
```
Subject: Free Sales Email Scorer - Improve Your Outreach

Hi [Name],

I built an AI tool that scores sales emails (1-10) and suggests
specific improvements.

Since you work in [Industry], figured you might find it useful.

Try it free: demos.projectlavos.com

Let me know what score you get!

Matthew Scott
AI Consultant, Louisville
```

**Expected Response Rate:** 5-10% (2-5 SMBs reply)
**Expected Conversion:** 1 consultation call

---

## Demo Design Specifications

### Restaurant Analyzer - Technical Design

**Frontend UI (Neubrutalism):**
```
┌─────────────────────────────────────────────┐
│  🍴 Restaurant Review Analyzer              │
│                                             │
│  Input: Restaurant name or review URL       │
│  ┌────────────────────────────────────┐    │
│  │ Jack Fry's                          │    │
│  └────────────────────────────────────┘    │
│                                             │
│  [Sample Data ▼]                            │
│  • Jack Fry's (upscale Southern)            │
│  • Proof on Main (hotel dining)             │
│  • Hammerheads (casual gastropub)           │
│  • Bourbon Raw (seafood)                    │
│                                             │
│  [Analyze Reviews] ← Big blue brutal button │
│                                             │
│  Results:                                   │
│  ┌────────────────────────────────────┐    │
│  │ Overall Sentiment: 4.2/5 ⭐         │    │
│  │                                     │    │
│  │ Key Themes:                         │    │
│  │ ✅ Atmosphere (mentioned 47 times)  │    │
│  │ ✅ Service (mentioned 38 times)     │    │
│  │ ⚠️  Wait times (mentioned 23 times) │    │
│  │ ⚠️  Pricing (mentioned 19 times)    │    │
│  │                                     │    │
│  │ Sample Positive Review:             │    │
│  │ "Amazing hot brown! Service was..."│    │
│  │                                     │    │
│  │ Sample Negative Review:             │    │
│  │ "Long wait for table, but food..." │    │
│  │                                     │    │
│  │ Actionable Recommendations:         │    │
│  │ 1. Improve reservation system       │    │
│  │ 2. Highlight atmosphere in marketing│    │
│  │ 3. Train staff on wait time comms   │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Backend API Design:**

```python
# /api/analyze-restaurant
# POST request

{
  "restaurant_name": "Jack Fry's",
  "location": "Louisville, KY"  # optional
}

# Response:
{
  "overall_sentiment": 4.2,
  "total_reviews_analyzed": 150,
  "themes": [
    {"theme": "Atmosphere", "mentions": 47, "sentiment": "positive"},
    {"theme": "Service", "mentions": 38, "sentiment": "positive"},
    {"theme": "Wait times", "mentions": 23, "sentiment": "negative"},
    {"theme": "Pricing", "mentions": 19, "sentiment": "mixed"}
  ],
  "sample_positive": "Amazing hot brown! Service was attentive...",
  "sample_negative": "Long wait for table, but food made up for it...",
  "recommendations": [
    "Improve reservation system to reduce wait complaints",
    "Highlight atmosphere and ambiance in marketing materials",
    "Train staff on proactive wait time communication"
  ],
  "data_source": "Google Reviews via Places API"
}
```

**Data Strategy:**

**Option A: Real Google Reviews (Ideal)**
- Use Google Places API (free tier: 1000 requests/month)
- Fetch reviews for restaurant_name + location
- Pros: Real data, always up-to-date, impressive
- Cons: API setup, rate limits, requires billing (even for free tier)

**Option B: Pre-scraped Data (MVP)**
- Manually scrape 10-20 reviews for 5 Louisville restaurants
- Store in JSON files in backend
- Pros: No API dependencies, fast, free
- Cons: Static data, limited restaurants

**Option C: Hybrid (Recommended)**
- Start with pre-scraped data for 5 restaurants (sample data)
- Add Google Places API later when validated
- Best of both: Demo works immediately, can scale

**Recommended: Option C (Hybrid)**
- Day 1: Build with static JSON data (5 restaurants × 20 reviews each)
- Week 3: Add Google Places API if restaurant owners respond
- Rationale: Validate demand before investing in API setup

---

### Sales Email Scorer - Technical Design

**Frontend UI (Neubrutalism):**
```
┌─────────────────────────────────────────────┐
│  📧 Sales Email Scorer                      │
│                                             │
│  Subject Line:                              │
│  ┌────────────────────────────────────┐    │
│  │ Quick question about your AI needs  │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Email Body:                                │
│  ┌────────────────────────────────────┐    │
│  │ Hi [Name],                          │    │
│  │                                     │    │
│  │ I noticed your company uses...     │    │
│  │                                     │    │
│  │ Would you be open to a quick call? │    │
│  │                                     │    │
│  │ Best,                               │    │
│  │ Matthew                             │    │
│  └────────────────────────────────────┘    │
│                                             │
│  [Sample Data ▼]                            │
│  • Good email (personalized, clear CTA)     │
│  • Bad email (generic, too long)            │
│  • Mediocre email (okay, could improve)     │
│                                             │
│  [Score Email] ← Big orange brutal button   │
│                                             │
│  Results:                                   │
│  ┌────────────────────────────────────┐    │
│  │ Overall Score: 7/10 🟢              │    │
│  │                                     │    │
│  │ Breakdown:                          │    │
│  │ Subject Line: 6/10                  │    │
│  │ • Too vague, not specific           │    │
│  │                                     │    │
│  │ Personalization: 8/10               │    │
│  │ • Good research mention             │    │
│  │                                     │    │
│  │ Value Proposition: 5/10             │    │
│  │ • Unclear what you're offering      │    │
│  │                                     │    │
│  │ Call to Action: 7/10                │    │
│  │ • Clear ask, but could be stronger  │    │
│  │                                     │    │
│  │ Specific Improvements:              │    │
│  │ 1. Subject: "AI automation for      │    │
│  │    [Company]" (more specific)       │    │
│  │ 2. Add one concrete value example   │    │
│  │ 3. CTA: "15-min call Tuesday 2pm?"  │    │
│  │    (specific time)                  │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Backend API Design:**

```python
# /api/score-email
# POST request

{
  "subject": "Quick question about your AI needs",
  "body": "Hi [Name],\n\nI noticed your company uses...\n\nWould you be open to a quick call?\n\nBest,\nMatthew"
}

# Response:
{
  "overall_score": 7,
  "breakdown": {
    "subject_line": {
      "score": 6,
      "feedback": "Too vague, not specific enough"
    },
    "personalization": {
      "score": 8,
      "feedback": "Good research mention shows you did homework"
    },
    "value_proposition": {
      "score": 5,
      "feedback": "Unclear what you're offering or why they should care"
    },
    "call_to_action": {
      "score": 7,
      "feedback": "Clear ask, but could be more specific with time/date"
    }
  },
  "improvements": [
    "Subject: Try 'AI automation for [Company]' (more specific)",
    "Add one concrete value example (e.g., 'Save 10 hours/week')",
    "CTA: Suggest specific time like 'Tuesday 2pm?' instead of 'quick call'"
  ],
  "rewritten_version": "Subject: AI automation for [Company]\n\nHi [Name],\n\nI noticed [Company] uses [Technology]. Companies like yours typically spend 10+ hours/week on [Task].\n\nI built an AI tool that automates this - interested in a 15-min demo?\n\nTuesday 2pm work?\n\nBest,\nMatthew"
}
```

**Scoring Logic:**

**Subject Line (0-10):**
- Specific > Vague (+2)
- Personalized > Generic (+2)
- Value-focused > Feature-focused (+2)
- Short (5-8 words) > Long (+2)
- Curiosity hook > Boring (+2)

**Personalization (0-10):**
- Research mentioned (+3)
- Specific details (+3)
- Relevant context (+2)
- Name used (+2)

**Value Proposition (0-10):**
- Clear benefit stated (+4)
- Quantified (e.g., "Save 10 hours") (+3)
- Relevant to recipient (+3)

**Call to Action (0-10):**
- Present (+3)
- Specific action (+3)
- Low friction (+2)
- Time/date suggested (+2)

**Overall Score:** Average of 4 components

---

## Implementation Strategy

### Phase 1: Restaurant Analyzer (12 hours)

**Hour 1-2: Backend Foundation**
- Create `projectlavos-backend/routers/restaurant.py`
- Define `/api/analyze-restaurant` endpoint
- Create static data: `data/restaurants/`
  - `jack-frys.json` (20 sample reviews)
  - `proof-on-main.json`
  - `hammerheads.json`
  - `bourbon-raw.json`
  - `milkwood.json`

**Hour 3-4: Analysis Logic**
- Implement sentiment analysis via Claude API
- Theme extraction (find common topics)
- Sample review selection (best positive, worst negative)
- Recommendation generation

**Hour 5-6: Frontend Component**
- Create `demos/src/components/RestaurantAnalyzer.jsx`
- Neubrutalism card UI
- Input field + sample data dropdown
- Loading state (skeleton screen)

**Hour 7-8: Results Display**
- Sentiment score visualization (stars)
- Theme breakdown (✅/⚠️ icons)
- Sample reviews display
- Recommendations list

**Hour 9-10: Polish & Testing**
- Error handling
- Edge cases (unknown restaurant)
- Mobile responsive
- Sample data button functionality

**Hour 11-12: Deploy & Verify**
- Git commit + push (triggers GitHub Actions)
- Verify deployment
- Test live on demos.projectlavos.com
- Screenshot for LinkedIn

---

### Phase 2: Sales Email Scorer (6 hours)

**Hour 1-2: Backend Foundation**
- Create `projectlavos-backend/routers/email.py`
- Define `/api/score-email` endpoint
- Create sample data:
  - `good_email.json`
  - `bad_email.json`
  - `mediocre_email.json`

**Hour 3-4: Scoring Logic**
- Implement 4-component scoring (subject, personalization, value, CTA)
- Claude API for analysis
- Score calculation (0-10 per component)
- Improvement suggestions generation

**Hour 5: Frontend Component**
- Create `demos/src/components/EmailScorer.jsx`
- Subject + body text inputs
- Sample data buttons
- Score visualization (circular progress or bar chart)

**Hour 6: Deploy & Test**
- Git commit + push
- Verify automation
- Test live
- Create demo GIF

---

## Technical Decisions

### Decision 1: Where to Add Demos?

**Option A: Modify projectlavos-frontend App.jsx**
- Pros: All demos in one place (current approach)
- Cons: App.jsx getting large (460 lines), monolithic

**Option B: Move to demos subdomain**
- Pros: Dedicated demo site, cleaner separation
- Cons: Need to port 4 existing demos, more complex

**Option C: Hybrid (current + new in demos)**
- Pros: Don't break existing, future-proof
- Cons: Demos split across 2 sites (confusing)

**Recommendation: Option A (Modify projectlavos-frontend)**
- Current demos already there (Sentiment, Lead, Phishing, Prompt)
- Users expect demos at projectlavos.com (not subdomain yet)
- Can refactor to demos subdomain in Week 3 if needed
- Keep it simple for Week 2

---

### Decision 2: Claude API Model Selection

**Options:**
- **Claude Opus:** Most capable, expensive ($15/$75 per million tokens)
- **Claude Sonnet:** Balanced, good value ($3/$15 per million tokens)
- **Claude Haiku:** Fast, cheap ($0.25/$1.25 per million tokens)

**Cost Analysis (1000 demo runs):**

| Model | Input/Demo | Output/Demo | Cost/1000 |
|-------|------------|-------------|-----------|
| Opus | 1000 tokens | 500 tokens | $52.50 |
| Sonnet | 1000 tokens | 500 tokens | $10.50 |
| Haiku | 1000 tokens | 500 tokens | $0.88 |

**Recommendation: Claude Haiku**
- Demos don't need Opus-level reasoning
- Sentiment analysis, theme extraction = Haiku-friendly
- $0.88 per 1000 runs = negligible cost
- Can upgrade to Sonnet if quality insufficient

---

### Decision 3: Static Data vs API

**For Restaurant Analyzer:**

**Static JSON (Recommended for Week 2):**
```json
{
  "restaurant": "Jack Fry's",
  "location": "Louisville, KY",
  "reviews": [
    {
      "rating": 5,
      "text": "Amazing hot brown! Best I've ever had. Service was attentive without being overbearing. Atmosphere is classic Louisville.",
      "date": "2024-10-15",
      "author": "Sarah M."
    },
    {
      "rating": 4,
      "text": "Food was excellent but we waited 45 minutes for a table despite reservation. Once seated, everything was perfect.",
      "date": "2024-10-10",
      "author": "John D."
    }
    // ... 18 more reviews
  ]
}
```

**Pros:**
- Zero API setup time
- No rate limits or costs
- Fast, reliable
- Controlled demo experience

**Cons:**
- Static data (not real-time)
- Limited to 5 restaurants
- Can't analyze arbitrary restaurants

**Google Places API (Week 3 upgrade):**
- Add if restaurant owners want real-time analysis
- Requires billing setup (~1 hour)
- 1000 free requests/month
- Shows technical chops

**Decision: Static for Week 2, API for Week 3 if validated**

---

## Risk Mitigation

### Risk 1: Demos Don't Generate Leads

**Probability:** Medium (30%)
**Impact:** High (wastes 18 hours)

**Mitigation:**
1. Target specific Louisville businesses (not random)
2. Personalize outreach emails (mention their business)
3. Offer free analysis (low friction)
4. Follow up 2x (increase response rate)

**Fallback:**
- Demos still valuable for hiring managers (shows full-stack skills)
- Can pivot to job search focus if consulting doesn't convert

---

### Risk 2: Technical Blockers (API Issues, Deployment Failures)

**Probability:** Low (10% with GitHub Actions working)
**Impact:** Medium (delays timeline)

**Mitigation:**
1. Test Claude API early (first hour)
2. Use Haiku model (fast, reliable)
3. Verify backend locally before deploying
4. Keep demos simple (avoid overengineering)

**Contingency:**
- If Claude API fails, use hardcoded responses for demo
- Can swap in real API later without frontend changes

---

### Risk 3: Demos Too Complex (Scope Creep)

**Probability:** Medium (40%)
**Impact:** Medium (exceeds 18-hour budget)

**Mitigation:**
1. Stick to ULTRATHINK spec (no feature additions)
2. Use sample data buttons (don't build admin panel)
3. Skip polish features (animations, charts) for Week 2
4. Deploy MVP, iterate in Week 3 if needed

**Red Flags:**
- "It would be cool if..." → Defer to Week 3
- "This needs a dashboard..." → Out of scope
- "What about multi-language?" → Not for Louisville SMBs

---

## Success Criteria

**Restaurant Analyzer:**
- ✅ User can input restaurant name
- ✅ Sample data for 5 Louisville restaurants works
- ✅ Returns sentiment score, themes, samples, recommendations
- ✅ Deployed to demos.projectlavos.com
- ✅ Mobile responsive
- ✅ Error handling present

**Sales Email Scorer:**
- ✅ User can input subject + body
- ✅ Sample data for 3 email types works
- ✅ Returns 4-component score + improvements
- ✅ Deployed to demos.projectlavos.com
- ✅ Mobile responsive
- ✅ Score visualization clear

**Business Outcomes:**
- ✅ 2 new demos targeting Louisville SMBs
- ✅ Demo GIFs created (screen recordings)
- ✅ 50+ outreach candidates identified
- ✅ Ready for Week 3 email campaign

---

## Execution Timeline

**Session 1 (6 hours): Restaurant Analyzer Backend + Frontend**
- Backend foundation + static data (2h)
- Analysis logic with Claude API (2h)
- Frontend component + results display (2h)

**Session 2 (6 hours): Restaurant Analyzer Polish + Email Scorer Backend**
- Restaurant Analyzer polish (2h)
- Deploy + test Restaurant Analyzer (1h)
- Email Scorer backend + scoring logic (3h)

**Session 3 (6 hours): Email Scorer Frontend + Final Polish**
- Email Scorer frontend (3h)
- Deploy + test Email Scorer (1h)
- Create demo GIFs for both (2h)

**Total: 18 hours over 3 sessions**

---

## Post-Execution: Week 3 Prep

**After demos are live:**

1. **Identify 50 Outreach Targets:**
   - 25 Louisville restaurants (Chamber members)
   - 25 Louisville SMBs (real estate, legal, IT, finance)

2. **Write Email Templates:**
   - Restaurant template (free review analysis offer)
   - SMB template (free email scorer tool)
   - Follow-up templates (2 reminders)

3. **Create LinkedIn Assets:**
   - Demo GIFs (10-15 sec each)
   - Post templates (6 posts, 1 per demo)
   - Scheduling strategy (M/W/F for 2 weeks)

4. **Interview Prep:**
   - Practice demoing Restaurant Analyzer
   - Practice demoing Email Scorer
   - Prepare answers: "Why these demos?" "What did you learn?"

---

## Key Insights

### 1. Local Specificity = Differentiation

**Generic AI Portfolio:**
- "I built a sentiment analyzer"
- Hiring manager: "So did 1000 other candidates"

**Louisville-Specific:**
- "I built a tool that analyzes Jack Fry's reviews"
- Restaurant owner: "That's MY restaurant - show me"

**Lesson:** Local specificity creates immediate relevance.

---

### 2. Sample Data = 3x Completion Rate

**Without Sample Data:**
- User: "What restaurant should I analyze?"
- User: "I don't know, I'll come back later" (never returns)

**With Sample Data:**
- User: Clicks "Jack Fry's"
- Results appear in 5 seconds
- User: "Wow, this is cool" (shares with colleague)

**Lesson:** Reduce friction to near-zero.

---

### 3. Business Value > Technical Complexity

**Technical Complexity:**
- "I used a 7-model ensemble with custom embeddings"
- SMB owner: "I don't know what that means"

**Business Value:**
- "This tool finds what customers love and what frustrates them"
- SMB owner: "SHOW ME"

**Lesson:** Speak their language, not yours.

---

### 4. MVP > Perfection

**Perfect (Never Ships):**
- Google Places API integration (1 day)
- Real-time review scraping (2 days)
- Database for storing analyses (1 day)
- User authentication (2 days)
- Admin dashboard (3 days)

**MVP (Ships This Week):**
- Static JSON data (1 hour)
- Claude API analysis (2 hours)
- Simple frontend (3 hours)
- Deploy + test (1 hour)

**Lesson:** Ship to learn, iterate to improve.

---

## Conclusion

**Week 2 Execution Strategy:**
1. Build Restaurant Analyzer with static data (12 hours)
2. Build Sales Email Scorer with Claude API (6 hours)
3. Deploy both using new GitHub Actions automation
4. Create demo GIFs for Week 3 marketing

**Expected Outcomes:**
- 2 Louisville-specific demos live
- 50+ outreach candidates identified
- Marketing assets ready (GIFs, templates)
- 1-2 consultation calls by end of Week 3

**Philosophy:**
- Execute for revenue, not portfolio perfection
- Validate demand before investing in polish
- Local specificity beats generic demos
- Sample data reduces friction to near-zero

**Next Action:** Start Session 1 - Restaurant Analyzer backend foundation

---

**End of ULTRATHINK Analysis**
**Recommendation:** Proceed with Session 1 (6 hours) - Restaurant Analyzer
**Time Budget:** 18 hours total, 6 hours per session, 3 sessions to complete
