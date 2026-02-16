# Computing Program for Rorschach Structural Summary ??Roadmap

> Last updated: 2026-02-16 (night)

## Vision

This web app is not just a Rorschach calculator ??it is a **Rorschach AI Wrapper Platform**.
We provide the domain-specific knowledge layer on top of general-purpose LLMs (Gemini, GPT, Claude),
enabling clinical/counseling psychologists to get AI-assisted Rorschach interpretation.

The long-term goal is to become a **platform** where users create, share, and trade
their own interpretation "Skill Books" ??similar to GPTs Store or Gems, but specialized for Rorschach.

---

## Current State (as of Feb 2026)

### Implemented
- [x] Rorschach Structural Summary calculator (legacy GAS logic, 1:1 match ??v1?봵2 cross-verified)
- [x] Multi-language support (5 languages: KO, EN, JA, ES, PT)
- [x] Google OAuth login (NextAuth + Prisma)
- [x] BYOK (Bring Your Own Key) ??users provide their own API keys
- [x] AES-256-CBC encrypted API key storage (OpenAI, Google, Anthropic)
- [x] AI Chat with streaming (3 providers: GPT-4o, Gemini Flash, Claude Sonnet)
- [x] Chat session persistence (PostgreSQL)
- [x] Knowledge base system (built-in docs + user-uploaded sources)
- [x] Relevance-based document selection (token overlap scoring)
- [x] Google AdSense (non-logged-in users only)
- [x] Inkblot canvas background, rainbow-colored input table
- [x] Auto-injection of Structural Summary results into chat context (CSV bootstrap prompt)
- [x] Reference page (`/ref`) with sub-tab layout: Document Search / Skill Book Store
- [x] Skill Book foundation: Prisma model + CRUD API + active Skill Book selection
- [x] Skill Book management UI in Account (create/edit/delete/activate/import/export)
- [x] Skill Book Store public browse + preview + import (+ activate)
- [x] Skill Book Builder API + Account-side draft generation flow
- [x] Rorschach base system prompt injected before active Skill Book prompt

### Not Yet Implemented
- [ ] Skill Book paid marketplace (credits, transactions, payout logic)
- [ ] Builder conversational mode + platform-key/credit-based billing
- [ ] Credit system & payment integration

---

## Architecture: How It All Fits Together

```
User (Clinical Psychologist)
  ??
  ?쒋? Inputs Rorschach responses ??Calculator ??Structural Summary
  ??
  ?쒋? Opens AI Chat
  ??    ??
  ??    ?쒋? Base System Prompt (our core, hidden from users)
  ??    ?쒋? + Active Skill Book (instructions + documents)
  ??    ?쒋? + Structural Summary results (auto-injected)
  ??    ?쒋? + User's question
  ??    ??
  ??    ?붴? ??LLM API (user's own key) ??Streaming response
  ??
  ?쒋? Skill Book Store
  ??    ?쒋? Browse & purchase Skill Books (credits)
  ??    ?쒋? Publish own Skill Books (listing fee)
  ??    ?붴? Earn credits from sales (minus commission)
  ??
  ?붴? Skill Book Builder
        ?쒋? Upload raw materials (textbooks, notes as PDF/TXT)
        ?쒋? AI converts to structured Skill Book format
        ?붴? Costs credits (uses platform's API key, not user's)
```

---

## Phase 1: Launch MVP (Target: Feb 2026)

**Goal:** Ship the core experience ??calculator + AI chat that actually understands Rorschach.

### 1.1 Rorschach System Prompt
- [x] Write comprehensive base system prompt for Rorschach interpretation
- [x] Include: interpretation principles, cluster analysis rules, index calculations
- [x] Store in `/lib/systemPrompts/` (not user-accessible, but version-controlled)
- [x] Multi-language awareness in prompt (handle 5 supported languages)
- [ ] Reference materials available in `docs/ref/` folder (textbook excerpts)
- **Note:** Current bootstrap prompt is minimal ??just "You are assisting with interpretation..."
  The system prompt needs to encode Rorschach domain expertise so AI gives clinically meaningful responses.

### 1.2 Structural Summary ??Chat Integration ??DONE
- [x] When user opens chat from results page, auto-include computed results as context
- [x] Format results as structured data the LLM can reference (Raw Data CSV + Summary CSV)
- [x] "Interpret my results" one-click flow (button ??login/API key check ??chat widget opens)
- [x] Loading UX: "寃??寃곌낵瑜??쎈뒗 以묒엯?덈떎..." ??AI processes ??"寃곌낵 以鍮꾨맖"

### 1.3 Skill Book Foundation (Data Model Only)
- [x] Define Prisma schema for SkillBook model
- [x] Basic CRUD API routes
- [x] Ship 1 default built-in Skill Book (our own Rorschach interpretation guide)
- [x] Allow users to select active Skill Book in chat

### 1.4 Polish & Ship
- [ ] Clean up existing Knowledge Source ??migrate concept to Skill Book
- [ ] Ensure chat UX is smooth for non-technical psychologists
- [ ] Mobile responsiveness finalization
- [ ] Deploy to production

---

## Phase 2: Skill Book Builder

**Goal:** Let non-technical users create their own Skill Books with AI assistance.

### 2.1 Builder Chat Interface
- [ ] Dedicated chat mode: "Create a Skill Book"
- [ ] AI guides user through the process conversationally
- [ ] Accept document uploads (PDF, TXT, MD, CSV ??max 500KB each)
- [ ] AI extracts and structures: instructions + knowledge documents

### 2.2 Builder System Prompt (Meta Skill Book)
- [ ] Design the "Skill Book that makes Skill Books" ??specialized prompts for:
  - Extracting interpretation principles from raw academic text
  - Identifying cultural-specific norms and considerations
  - Structuring output as valid Skill Book JSON
- [ ] Psychology-domain awareness (not generic document summarization)

### 2.3 Builder API Key Strategy
- [ ] Builder uses **platform's API key** (not user's)
- [ ] This justifies credit charges for builder usage
- [ ] Track token usage per session for cost analysis

### 2.4 My Skill Books Management
- [x] Create/edit/delete own Skill Books
- [x] Preview how a Skill Book affects AI behavior
- [x] Import/export Skill Book as JSON

---

## Phase 3: Credit System & Store

**Goal:** Enable a creator economy around Rorschach interpretation knowledge.

### 3.1 Credit System
- [ ] `creditBalance` field on User model
- [ ] `CreditTransaction` model for full audit trail
- [ ] Transaction types: purchase, sale, listing_fee, sale_commission, builder_usage
- [ ] Payment integration (Toss Payments for KRW, Stripe for international)

### 3.2 Credit Economics (Initial Estimates)
| Item | Cost |
|------|------|
| 1 credit | ~$0.01 (~15 KRW) |
| Builder: 1 session | 5-10 credits |
| Store: listing fee | 10-20 credits |
| Store: sale commission | 10-20% of price |
| Skill Book prices | 50-500 credits (seller sets) |
| Daily free tier | 3-5 builder messages |

> These numbers need real-world calibration after launch.

### 3.3 Skill Book Store (Marketplace)
- [ ] Browse Skill Books (search, filter by language/category/rating)
- [ ] Sort by: downloads, rating, newest, price
- [ ] Purchase flow (credit deduction + transaction log)
- [ ] Seller dashboard (earnings, download stats)
- [ ] Skill Book detail page (description, preview, reviews)

### 3.4 Anti-Abuse
- [ ] Listing fee prevents spam submissions
- [ ] Report/flag system for low-quality or plagiarized content
- [ ] Admin review queue (optional)

---

## Phase 4: Community & Growth

**Goal:** Build a self-sustaining community of Rorschach practitioners.

### 4.1 Social Features
- [ ] Ratings & text reviews for Skill Books
- [ ] Author profiles (credentials, specialization, published books)
- [ ] "Featured" and "Trending" sections on store
- [ ] Language-specific rankings

### 4.2 Cultural Adaptation
- [ ] Encourage Skill Books for underserved cultures/languages
- [ ] Highlight that different norms exist (KR, US, JP, CN, ES/LATAM)
- [ ] Platform-level guidance on cultural considerations

### 4.3 Advanced Features (Future)
- [ ] Vector embedding-based RAG (upgrade from token overlap)
- [ ] Skill Book versioning (v1, v2, ...)
- [ ] Subscription tier (unlimited builder usage, early access)
- [ ] Collaborative Skill Book editing
- [ ] API for third-party integrations

---

## Business Model Summary

```
Revenue Streams:
  1. Credit sales (primary)       ??Users buy credits with real money
  2. Builder usage fees            ??Credits spent on AI-assisted Skill Book creation
  3. Store commissions             ??% cut from every Skill Book sale
  4. Store listing fees            ??Small fee to publish (spam prevention + revenue)
  5. AdSense (secondary)          ??Non-logged-in calculator users

Credit Sinks (to prevent inflation):
  - Builder usage
  - Listing fees
  - Sale commissions
  - (Future) Premium features

Key Advantage:
  - Zero API cost for general chat (BYOK model)
  - API cost only for Builder (platform key, offset by credits)
  - Knowledge is the product, not compute
```

---

## Tech Stack (No Changes Needed)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + Headless UI |
| Auth | NextAuth (Google OAuth) |
| Database | PostgreSQL + Prisma ORM |
| LLM | OpenAI / Google / Anthropic SDKs |
| Payments | Toss Payments (KRW) / Stripe (International) |
| Hosting | Vercel |

Everything described in this roadmap is achievable with the current stack.
No new infrastructure or technology is required except payment provider integration.

---

## Design Principles

1. **Legacy calculation logic is sacred** ??never modify `gas/` computation rules
2. **BYOK for general chat** ??we don't pay for user conversations
3. **Platform key for Builder only** ??justified by credit charges
4. **Skill Book = Instructions + Documents** ??not just documents (that's just RAG)
5. **Simple for psychologists** ??they are domain experts, not tech experts
6. **Cultural sensitivity** ??Rorschach interpretation varies by culture; the platform embraces this

