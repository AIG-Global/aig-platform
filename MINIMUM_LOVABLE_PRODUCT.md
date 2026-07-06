# Minimum Lovable Product (MLP): Diana v0.1 Experience

**Version:** 1.0  
**Status:** Product Specification  
**Date:** 2026-07-06  
**Goal:** 10 core experiences that make Diana feel like one continuous assistant  

---

## 🎯 The Philosophy

Don't build dozens of features.

Build 10 core experiences so well that users feel they're interacting with one continuous, capable assistant.

Each experience should:
- ✅ Feel natural and intuitive
- ✅ Strengthen Diana's presence
- ✅ Create a seamless user journey
- ✅ Be technically achievable in 3-4 months
- ✅ Create value users will evaluate

---

## The 10 Core Experiences

### **1. Sign In & Welcome**
**User Goal:** Begin interacting with Diana  
**Experience:**

```
User opens app/browser
↓
"Welcome back, [Name]. I'm Diana."
↓
Diana recognizes returning user (optional: past conversation context)
↓
User ready to chat
```

**Requirements:**
- [ ] Authentication (via Identity module)
- [ ] Personalization (know user's name)
- [ ] Welcome message (warm, not robotic)
- [ ] Option to load recent conversation
- [ ] Session management

**Success Criteria:**
- Users feel recognized
- Onboarding takes < 30 seconds
- Returning users immediately know Diana remembers them

---

### **2. Ask a Question**
**User Goal:** Get useful information or assistance  
**Experience:**

```
User: "How do I implement JWT authentication?"
↓
[Streaming response - words appear as Diana thinks]
↓
Diana: "JWT authentication involves..."
[Full response with code examples]
↓
User: "Can you explain the claims section?"
↓
Diana: [Continues conversation contextually]
```

**Requirements:**
- [ ] Chat interface (clean, focused)
- [ ] Streaming responses (AI provider integration)
- [ ] Multi-turn conversation (context maintained)
- [ ] Reference previous messages
- [ ] Ability to ask follow-ups
- [ ] Rich text support (code, formatting)

**Success Criteria:**
- Responses feel intelligent and helpful
- Streaming feels natural (not robotic)
- Context is maintained across turns
- Users feel like they're talking to someone, not a system

---

### **3. Save Conversation**
**User Goal:** Preserve important discussions for later  
**Experience:**

```
User asks Diana several questions over 10 messages
↓
User: "Diana, save this conversation"
↓
Diana: "Done. I've saved our discussion about JWT. 
         You can find it under 'Authentication Deep Dive'"
↓
[Later]
↓
User opens app → "Recent conversations" shows saved chats
↓
User clicks conversation → Full history loads
↓
Diana: "Welcome back. We were discussing JWT claims..."
```

**Requirements:**
- [ ] Conversation persistence (database)
- [ ] Auto-save (each message saved)
- [ ] Named conversations (user can title them)
- [ ] Search conversations (by title, topic)
- [ ] Load previous conversation
- [ ] Continue from where you left off

**Success Criteria:**
- Saving feels automatic, not manual
- Users can find old conversations easily
- Re-opening conversation feels natural
- Diana remembers context from past

---

### **4. Generate a Document**
**User Goal:** Turn conversation into something useful  
**Experience:**

```
User asks Diana: "Based on our conversation, 
                  can you create a guide on JWT?"
↓
Diana: "I'll create a comprehensive guide from our 
        discussion. Generating now..."
↓
[Document generates with:
 - Conversation summary
 - Code examples
 - Step-by-step instructions
 - Links to resources]
↓
Diana: "Done! Your guide is ready. 
        Would you like me to:
        - Export as PDF?
        - Share with your team?
        - Save for later?"
```

**Requirements:**
- [ ] Document generation from conversation
- [ ] Multiple formats (Markdown, PDF, Word)
- [ ] Intelligent extraction (key points, code)
- [ ] Formatting and structure
- [ ] Export functionality
- [ ] Sharing options

**Success Criteria:**
- Document quality is high
- Generation is fast (< 5 seconds)
- User can immediately use document
- Document feels like it came from Diana

---

### **5. Search Conversations**
**User Goal:** Find specific information from past chats  
**Experience:**

```
User: "Diana, find when we discussed database optimization"
↓
Diana: "I found 3 conversations about that:
        1. 'Database Performance Tuning' (June 3)
        2. 'Query Optimization Tips' (May 28)
        3. 'Scaling Postgres' (May 15)"
↓
User clicks one
↓
Conversation loads with relevant section highlighted
↓
Diana: "Here's where we discussed index optimization.
        Want me to elaborate or take it in a new direction?"
```

**Requirements:**
- [ ] Full-text search of conversations
- [ ] Semantic search (understand intent)
- [ ] Search results ranking
- [ ] Quick preview of results
- [ ] Load specific conversation
- [ ] Highlight matching sections

**Success Criteria:**
- Search finds relevant conversations (not just exact match)
- Results are accurate and useful
- Users can quickly find what they need
- Search feels natural (not technical)

---

### **6. Invoke a Platform Tool**
**User Goal:** Accomplish something beyond conversation  
**Experience:**

```
User: "Diana, I need to save this code snippet to my documents"
↓
Diana understands the request involves Documents service
↓
Diana: "I'll save that for you. Creating a new document..."
↓
Diana creates document in Documents service
↓
Diana: "Done! I've saved it as 'JWT Implementation' 
        in your Documents."
↓
User later asks Diana: "Show me the documents I created today"
↓
Diana: "You created 3 documents today:
        1. JWT Implementation
        2. Database Optimization Notes
        3. Team Meeting Minutes"
```

**Requirements:**
- [ ] Document creation via Documents service
- [ ] File management (list, search)
- [ ] Integration with platform services
- [ ] Diana understands when to invoke tools
- [ ] Natural language tool invocation
- [ ] Feedback when tools succeed/fail

**Success Criteria:**
- Tool invocation feels natural in conversation
- Users don't think about "Document service", just ask Diana
- Users feel Diana has real capabilities
- Tools integrate seamlessly

---

### **7. Resume on Another Device**
**User Goal:** Continue conversation on phone or tablet  
**Experience:**

```
User chatting with Diana on desktop
↓
User: "I need to step away, but I'll continue on my phone"
↓
[Later: User opens Diana on phone]
↓
Diana: "Welcome back! We were discussing JWT authentication.
        You asked about implementing refresh tokens. 
        Where would you like to continue?"
↓
[Full conversation history visible]
↓
User continues conversation naturally
↓
[Later: Back on desktop]
↓
Diana: "Welcome back to your desktop. 
        Last message from your phone mentioned implementing 
        refresh tokens. Still want to explore that?"
```

**Requirements:**
- [ ] Conversation syncing across devices
- [ ] Real-time sync (or near real-time)
- [ ] Detect device changes
- [ ] Maintain context across devices
- [ ] Handle offline scenarios
- [ ] Resume from where you left off

**Success Criteria:**
- Users feel Diana is everywhere
- No friction switching devices
- Context is always maintained
- Users forget they're switching devices

---

### **8. Continuous Presence (Beam Me Up)**
**User Goal:** Keep Diana updated on what they're doing  
**Experience:**

```
User's phone dies during conversation
↓
User: "Diana, save my conversation history to Beam Me Up"
↓
Diana backs up everything to cloud via Beam Me Up service
↓
[Later: New device or restored device]
↓
Diana: "I found your conversation from earlier. 
        Restoring..."
↓
[Full conversation and state restored]
↓
Diana: "I've restored everything. Let's continue where 
        you left off. You were asking about..."
↓
[Can also sync with other devices automatically]
```

**Requirements:**
- [ ] Conversation backup to cloud
- [ ] Compression and encryption
- [ ] Device sync on startup
- [ ] Conflict resolution (multiple updates)
- [ ] Restore on new device
- [ ] Version history (undo/restore old versions)

**Success Criteria:**
- Backup happens seamlessly
- Restore is instant
- Users feel their data is safe
- Users can switch devices without loss

---

### **9. Feel Like One Assistant**
**User Goal:** Experience Diana as coherent, not fragmented  
**Experience:**

```
User: "Diana, what can you do?"
↓
Diana: "I can:
        • Answer questions and provide guidance
        • Help you generate documents
        • Access your saved conversations
        • Save important discussions
        • Work with you across any device
        • Help you accomplish things by connecting
          with documents and services"
↓
Everything Diana does feels like one system,
not disconnected features
↓
User: "Create a guide on JWT and save it"
↓
Diana: [Does this naturally, as one action]
↓
User never thinks "I'm in the Documents feature"
or "I'm using the Chat feature"
↓
Just: "Diana helped me"
```

**Requirements:**
- [ ] Unified interface (chat is the front-end for everything)
- [ ] Consistent language and tone
- [ ] Seamless transitions between capabilities
- [ ] No "feature switching" - just ask Diana
- [ ] One identity across all interactions
- [ ] Coherent mental model for user

**Success Criteria:**
- Users don't mention individual features
- Everything feels like talking to Diana
- No "app switching" mental load
- Users feel they're interacting with one assistant

---

### **10. Evaluate as a Product**
**User Goal:** Feel Diana is genuinely useful, not just a prototype  
**Experience:**

```
After using Diana for a week:
↓
User can point to:
• Conversations they've had
• Documents they've created
• Questions Diana answered
• Work Diana helped them accomplish
• Time Diana saved them
↓
User thinks: "This is actually useful. 
             I'd pay for this. I'd recommend this."
↓
User can identify Diana's personality
• What Diana is good at
• What Diana could improve
• How Diana differs from ChatGPT
• Why Diana is worth using
```

**Requirements:**
- [ ] Quality of responses
- [ ] Reliability and consistency
- [ ] Speed and performance
- [ ] Usefulness in real scenarios
- [ ] Personality and voice
- [ ] Genuine capabilities (not smoke and mirrors)

**Success Criteria:**
- Users feel Diana is professional
- Users see Diana as useful, not toy
- Users can articulate Diana's value
- Users would recommend Diana to others

---

## The User Journey (Typical Week)

### Day 1: Discovery
```
10:00 AM: User signs up, meets Diana
10:05 AM: Asks first question - gets great answer
10:15 AM: Asks follow-up - Diana remembers context
10:30 AM: First "wow" moment - Diana understood what I meant
```

### Day 2: Experimentation
```
2:00 PM: User returns - Diana remembers them
2:05 PM: Continues previous conversation
2:30 PM: Asks Diana to create a document
2:35 PM: Document is created, exported to PDF
```

### Day 3: Integration
```
9:00 AM: Opens Diana on phone during commute
9:30 AM: Continues conversation from yesterday
3:00 PM: Back on desktop, Diana seamless transition
3:15 PM: Searches for previous conversation about topic
3:30 PM: Finds it, context loads
```

### Day 5: Dependency
```
Morning: Diana has become part of workflow
Afternoon: Multiple conversations going
Evening: User thinks "I couldn't do my job as well without Diana"
```

### Day 7: Recommendation
```
User tells colleague: "You should try Diana"
Colleague tries it
First colleague acts as evangelist
```

---

## What NOT to Include in MLP

### ❌ Marketplace
(Diana learns to find skills - Phase 2)

### ❌ Academy
(Diana learns to teach - Phase 2)

### ❌ Advanced Voice
(Diana learns to speak - Phase 3)

### ❌ Organization Features
(Diana learns team dynamics - Phase 4)

### ❌ Complex Automations
(Diana learns your patterns - Phase 3)

### ❌ Enterprise Admin
(Diana serves multiple orgs - Phase 4)

### ✅ Focus
Core Diana experience only.

---

## Technical Requirements for MLP

### Backend
- [ ] Authentication (JWT via Identity)
- [ ] Chat endpoint (streaming responses)
- [ ] Conversation storage (PostgreSQL)
- [ ] Search capability (semantic)
- [ ] Document generation (basic)
- [ ] File management
- [ ] Basic Beam Me Up integration

### Frontend
- [ ] Chat interface
- [ ] Conversation list
- [ ] Document viewer
- [ ] Search interface
- [ ] Settings/profile
- [ ] Responsive design (desktop primary)

### AI
- [ ] OpenAI integration (primary)
- [ ] Anthropic integration (fallback)
- [ ] Streaming responses
- [ ] Context management
- [ ] Basic knowledge integration

### Infrastructure
- [ ] Database (PostgreSQL)
- [ ] File storage (S3 or local)
- [ ] Queue for background jobs (basic)
- [ ] Monitoring and logging

---

## Success Metrics for MLP

### Engagement
- Daily Active Users (DAU)
- Session duration (should be > 10 min)
- Return rate (should be > 50% day-over-day)

### Quality
- Response satisfaction (target: 4+ / 5)
- Error rate (target: < 0.1%)
- Response time (target: < 2s for streaming start)

### Retention
- Week 1 retention: > 30%
- Week 4 retention: > 15%
- Monthly active users

### Coherence
- Feature confusion (should be 0 - users don't mention features)
- Diana recognition (users clearly understand Diana as the assistant)

---

## Timeline for MLP

### Weeks 1-2: Foundation
- Auth flow
- Basic chat
- Streaming integration

### Weeks 3-4: Persistence
- Conversation database
- Save/load
- Search

### Weeks 5-6: Documents
- Generation from conversation
- Export to PDF
- File management

### Weeks 7-8: Multi-device
- Conversation syncing
- Beam Me Up integration
- Resume context

### Weeks 9-10: Polish
- Performance optimization
- Error handling
- UI refinement

### Weeks 11-12: Launch
- Final testing
- Documentation
- Rollout

---

## The Question During MLP Development

Every sprint, ask:

**"Does this make Diana feel more like one continuous assistant?"**

If yes → Ship it  
If no → Reconsider  
If unclear → Define connection more clearly  

---

## Success Definition

After 12 weeks, you should have:

✅ Users who sign in daily  
✅ Users who have saved 5+ conversations  
✅ Users who've generated documents  
✅ Users who use Diana on multiple devices  
✅ Users who say "Diana is useful"  
✅ Users who don't say "I used the chat feature" - they say "I talked to Diana"  
✅ A product you can put in front of customers and get real feedback  

**Most importantly:**

Users should feel they're interacting with **one continuous assistant who helps them**, not using a collection of features.

That's the minimum lovable product.

---

## From MLP to North Star

Once you have MLP (10 core experiences nailed):

**Phase 2:** Diana gains domain expertise (Marketplace, Academy, Payments)  
**Phase 3:** Diana becomes ambient (Desktop, Mobile, Voice, Automation)  
**Phase 4:** Diana goes enterprise (Multi-tenancy, Compliance, etc.)  

But none of that matters if Phase 1 isn't perfect.

Get these 10 experiences right, and everything else becomes natural.

---

*Generated by GitHub Copilot | Claude Haiku 4.5*  
*North Star ONE: Minimum Lovable Product*  
*Date: 2026-07-06*
