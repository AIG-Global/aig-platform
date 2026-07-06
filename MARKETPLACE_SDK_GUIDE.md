# Marketplace SDK Guide

**Version:** 1.0  
**Status:** Constitutional Document  
**Date:** 2026-07-06  
**Purpose:** Complete guide for third-party developers to build apps, plugins, and skills  

---

## 📦 What You Can Build

The Marketplace SDK enables third-party developers to extend North Star ONE in three ways:

### 1. **Skills** (AI-Powered Capabilities)
Teach Diana a new skill by providing:
- System prompts and training
- Few-shot examples
- Output specifications
- Cost and performance parameters

**Examples:**
- Specialized summarization (legal documents, medical research)
- Domain-specific generation (SQL queries, code)
- Analysis (financial data, scientific papers)
- Multi-language expertise

**Time to Market:** 1-2 weeks  
**Revenue Model:** Per-call microtransactions

---

### 2. **Plugins** (Service Integrations)
Connect external services to Diana by:
- Implementing webhook handlers
- Defining authentication
- Specifying permissions
- Creating Diana-friendly interfaces

**Examples:**
- Slack integration
- GitHub integration
- Salesforce integration
- Zapier/Make integration
- Payment processor integration

**Time to Market:** 2-4 weeks  
**Revenue Model:** Subscription, freemium, or revenue share

---

### 3. **Apps** (Full Applications)
Build standalone applications that live in the ecosystem:
- Register with the App Registry
- Expose capabilities Diana can discover
- Integrate with shared services
- Optional marketplace distribution

**Examples:**
- CRM application
- Project management app
- Analytics dashboard
- E-learning platform
- Documentation system

**Time to Market:** 2-12 weeks (depends on scope)  
**Revenue Model:** Subscription, one-time purchase, freemium

---

## 🛠️ SDK Structure

### Installation

```bash
npm install @aig-global/marketplace-sdk
```

### SDK Components

```typescript
// Core SDK
import { SkillBuilder, PluginBuilder, AppBuilder } from '@aig-global/marketplace-sdk';

// Authentication
import { registerWithMarketplace, authenticate } from '@aig-global/marketplace-sdk';

// Types
import { 
  Skill, 
  Plugin, 
  App, 
  Capability, 
  IntentMatch 
} from '@aig-global/marketplace-sdk/types';

// Utilities
import { 
  logger, 
  metrics, 
  errors, 
  validation 
} from '@aig-global/marketplace-sdk/utils';
```

---

## 🧠 Building a Skill

### What is a Skill?

A Skill is a reusable AI capability that Diana can invoke.

**Structure:**
```
Skill
├─ Name & Description
├─ AI Model (OpenAI, Anthropic, etc.)
├─ System Prompt (instructions)
├─ Few-Shot Examples (demonstrations)
├─ Cost & Rate Limits
└─ Output Specification
```

### Step 1: Define Your Skill

```typescript
import { SkillBuilder } from '@aig-global/marketplace-sdk';

const mySkill = new SkillBuilder()
  .setName('Legal Document Summarizer')
  .setDescription('Summarize legal documents into plain English')
  .setCategory('analysis')
  .setVersion('1.0.0');

// Choose your AI model
mySkill.setModel('openai/gpt-4-turbo');

// Provide system instructions
mySkill.setSystemPrompt(`
You are an expert legal analyst. Your job is to:
1. Read legal documents
2. Extract key clauses and obligations
3. Explain in plain English
4. Highlight risks and opportunities

Always be accurate. If uncertain, say so.
`);

// Add examples (few-shot learning)
mySkill.addExample({
  input: 'Summarize this NDA clause...',
  output: 'This clause means...',
  explanation: 'We focus on the key obligation...'
});

mySkill.addExample({
  input: 'What are the risks in this contract?',
  output: 'The main risks are...',
  explanation: 'We identified risks because...'
});
```

### Step 2: Configure Performance

```typescript
// Cost per invocation
mySkill.setCostPerCall(0.02); // $0.02 per call

// Rate limiting
mySkill.setRateLimit({
  callsPerMinute: 10,
  callsPerDay: 1000
});

// Performance expectations
mySkill.setPerformanceTargets({
  avgResponseTime: 2000,      // 2 seconds
  accuracy: 0.95,              // 95% accuracy target
  maxTokens: 2000             // Max output tokens
});
```

### Step 3: Define Output

```typescript
// Specify what Diana gets back
mySkill.setOutputSchema({
  type: 'object',
  properties: {
    summary: {
      type: 'string',
      description: 'Plain English summary'
    },
    keyTerms: {
      type: 'array',
      items: { type: 'string' },
      description: 'Key obligations and terms'
    },
    risks: {
      type: 'array',
      items: { type: 'string' },
      description: 'Identified risks'
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' },
      description: 'Recommended actions'
    }
  },
  required: ['summary', 'keyTerms']
});
```

### Step 4: Register with Marketplace

```typescript
// Test locally first
const result = await mySkill.test({
  input: 'Please summarize this NDA...'
});
console.log(result); // See output

// Register when ready
await mySkill.register({
  apiKey: process.env.MARKETPLACE_API_KEY,
  pricing: {
    model: 'per-call',
    pricePerCall: 0.02,
    currency: 'usd'
  },
  billing: {
    payoutTarget: 'stripe'
  }
});

// Get your Skill ID
const skillId = mySkill.id;
console.log(`Skill registered as ${skillId}`);
```

### Revenue Model for Skills

```
Per-Call Pricing:
├─ You set the price per call
├─ Marketplace takes 30% commission
├─ You receive 70% of revenue
├─ Minimum $0.01 per call
└─ Payouts via Stripe

Example:
├─ Your skill charges $0.10
├─ Marketplace takes $0.03
├─ You receive $0.07
├─ 1,000 calls = $70 revenue
```

---

## 🔌 Building a Plugin

### What is a Plugin?

A Plugin connects an external service to Diana by handling authentication, permissions, and Diana-friendly interfaces.

**Structure:**
```
Plugin
├─ Name & Description
├─ Target Service (Slack, GitHub, Salesforce)
├─ Authentication (OAuth2, API Key)
├─ Permissions (what access it needs)
├─ Actions (what it can do)
└─ Webhooks (how it integrates)
```

### Step 1: Define Your Plugin

```typescript
import { PluginBuilder } from '@aig-global/marketplace-sdk';

const slackPlugin = new PluginBuilder()
  .setName('Slack Integration')
  .setDescription('Let Diana read and post to Slack')
  .setVersion('1.0.0')
  .setPublisher('YourCompany');

// Link to external service
slackPlugin.setTarget('slack');
slackPlugin.setTargetUrl('https://slack.com');
```

### Step 2: Configure Authentication

```typescript
// OAuth2 Flow for Slack
slackPlugin.setAuthentication({
  type: 'oauth2',
  clientId: 'your-client-id',
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  authorizationUrl: 'https://slack.com/oauth_authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  
  // What permissions to request
  scopes: [
    'chat:write',              // Post messages
    'channels:read',           // Read channels
    'users:read',              // Read user info
    'conversations:read'       // Read conversations
  ]
});
```

### Step 3: Define Permissions

```typescript
// Ask user what they want to allow
slackPlugin.definePermissions([
  {
    resource: 'messages',
    access: 'read',
    justification: 'Diana needs to read Slack messages to provide context'
  },
  {
    resource: 'messages',
    access: 'write',
    justification: 'Diana can post responses to Slack on your behalf'
  },
  {
    resource: 'channels',
    access: 'read',
    justification: 'Diana needs to know which channels you're in'
  }
]);
```

### Step 4: Implement Actions

```typescript
// Action: Read recent messages
slackPlugin.defineAction({
  name: 'getRecentMessages',
  description: 'Get recent messages from a channel',
  parameters: {
    channelId: { type: 'string', required: true },
    limit: { type: 'number', required: false, default: 10 }
  },
  handler: async (params) => {
    const response = await slackAPI.conversations.history({
      channel: params.channelId,
      limit: params.limit
    });
    return response.messages;
  }
});

// Action: Post message
slackPlugin.defineAction({
  name: 'postMessage',
  description: 'Post a message to Slack',
  parameters: {
    channelId: { type: 'string', required: true },
    message: { type: 'string', required: true }
  },
  handler: async (params) => {
    return await slackAPI.chat.postMessage({
      channel: params.channelId,
      text: params.message
    });
  }
});

// Diana can now:
// "Check my recent Slack messages"
// "Post that summary to #products"
```

### Step 5: Setup Webhooks

```typescript
// Listen for Slack events
slackPlugin.setupWebhook({
  url: 'https://your-domain.com/webhooks/slack',
  events: ['message', 'app_mention'],
  
  handler: async (event) => {
    if (event.type === 'app_mention') {
      // Someone mentioned Diana in Slack
      const userMessage = event.text.replace(/<@.*?>/g, ''); // Remove mention
      
      // Send to Diana
      const response = await dianaAPI.chat({
        message: userMessage,
        context: { 
          source: 'slack',
          channel: event.channel,
          user: event.user
        }
      });
      
      // Post response back to Slack
      await slackAPI.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: response
      });
    }
  }
});
```

### Step 6: Register Plugin

```typescript
await slackPlugin.register({
  apiKey: process.env.MARKETPLACE_API_KEY,
  
  // Provide redirect URL for OAuth
  installUrl: 'https://your-domain.com/slack/install',
  
  // Support contact
  support: {
    email: 'support@yourcompany.com',
    website: 'https://yourcompany.com'
  }
});

console.log('Plugin registered! Users can install from Marketplace.');
```

### Revenue Model for Plugins

```
Subscription Model:
├─ Free tier: Basic features
├─ Pro tier: $10/month
├─ Enterprise tier: Custom pricing
├─ Marketplace takes 30% commission
└─ You receive 70%

Example (Pro tier):
├─ User pays $10/month
├─ Marketplace takes $3
├─ You receive $7
├─ 100 users = $700/month revenue

Freemium Model:
├─ Core features free
├─ Premium features $5/month
├─ Optional "pay what you want"
└─ Revenue share as above
```

---

## 📱 Building an App

### What is an App?

An App is a standalone application registered with North Star ONE that:
- Exposes capabilities Diana can discover
- Uses shared services (auth, documents, etc.)
- Appears in the App Registry
- Optional marketplace distribution

**Examples:**
- Project management app
- Analytics dashboard
- CRM system
- E-learning platform

### Step 1: Create App Structure

```typescript
import { AppBuilder } from '@aig-global/marketplace-sdk';

const myApp = new AppBuilder()
  .setName('Project Management')
  .setDescription('Manage projects and collaborate with your team')
  .setCategory('productivity')
  .setVersion('1.0.0');
```

### Step 2: Expose Capabilities

```typescript
// Capability 1: Create Project
myApp.defineCapability({
  id: 'create-project',
  name: 'Create Project',
  description: 'Create a new project',
  userIntents: [
    'Create a new project',
    'Start a project',
    'New project'
  ],
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Project name'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Project description'
    }
  ],
  execute: async (context) => {
    // Diana will call this when user wants to create a project
    return await createProject(context.parameters);
  }
});

// Capability 2: List Projects
myApp.defineCapability({
  id: 'list-projects',
  name: 'List Projects',
  description: 'Show user their projects',
  userIntents: [
    'What projects do I have?',
    'Show my projects',
    'List my work'
  ],
  execute: async (context) => {
    return await listUserProjects(context.userId);
  }
});

// Capability 3: Add Task
myApp.defineCapability({
  id: 'add-task',
  name: 'Add Task to Project',
  description: 'Add a task to a project',
  userIntents: [
    'Add a task',
    'Create task in X project',
    'I need to do X'
  ],
  parameters: [
    { name: 'projectId', type: 'string', required: true },
    { name: 'title', type: 'string', required: true },
    { name: 'priority', type: 'string', enum: ['low', 'medium', 'high'] }
  ],
  execute: async (context) => {
    return await addTask(context.parameters);
  }
});
```

### Step 3: Integrate Shared Services

```typescript
// Use authentication from North Star ONE
const user = await app.getCurrentUser();

// Use document service
const document = await app.services.documents.create({
  title: 'Project Plan',
  content: 'Plan for ' + projectName
});

// Use search service
const results = await app.services.search.semantic({
  query: 'previous projects similar to this',
  userId: user.id
});

// Store data with North Star storage
await app.storage.save('projects', {
  projectId: projectData
});
```

### Step 4: Register App

```typescript
await myApp.register({
  apiKey: process.env.MARKETPLACE_API_KEY,
  
  // Where Diana can access your app
  apiEndpoint: 'https://api.myapp.com',
  
  // Frontend URL (if web-based)
  webUrl: 'https://app.myapp.com',
  
  // Required services
  requires: {
    authentication: true,
    storage: true,
    search: false
  }
});
```

---

## 📊 Monetization Models

### Model 1: Freemium
```
Free Tier:
├─ Core functionality
├─ Limited features
└─ No payment required

Premium Tier ($5-20/month):
├─ Advanced features
├─ Priority support
├─ Higher limits
└─ Revenue share (70% to you)
```

### Model 2: Usage-Based
```
Pay as you go:
├─ $0.01 per API call
├─ $1 per advanced operation
├─ $0.50 per generated document
└─ Revenue split (70% to you, 30% to marketplace)
```

### Model 3: Subscription
```
Fixed monthly subscription:
├─ Starter: $10/month
├─ Professional: $25/month
├─ Enterprise: Custom
└─ Revenue to you after marketplace cut
```

### Model 4: Enterprise Licensing
```
Direct licensing:
├─ Your app + Enterprise term
├─ 90% revenue to you
├─ Direct billing relationship
└─ Marketplace gets 10% facilitation fee
```

---

## ✅ Submission Checklist

Before submitting to Marketplace:

### Code Quality
- [ ] Code reviewed and tested
- [ ] Error handling comprehensive
- [ ] Logging implemented
- [ ] Performance targets met
- [ ] Security audit passed

### Documentation
- [ ] README.md with clear instructions
- [ ] API documentation complete
- [ ] Examples provided
- [ ] Troubleshooting guide included

### Compliance
- [ ] Terms of service created
- [ ] Privacy policy drafted
- [ ] GDPR compliance verified
- [ ] Rate limiting implemented

### User Experience
- [ ] Error messages are helpful
- [ ] Permissions clearly explained
- [ ] Installation is simple
- [ ] Uninstallation is clean

### Testing
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests passed
- [ ] User acceptance testing done
- [ ] Edge cases handled

---

## 🚀 Distribution & Discovery

### How Diana Discovers Your Skill/Plugin/App

1. **User Search** - "Find skills that can translate documents"
2. **Recommendations** - "Based on your usage, try X"
3. **Featured** - Marketplace highlights popular skills
4. **Categories** - Browse by type
5. **Direct URL** - User installs from your website

### Marketing Your Offering

**In Marketplace:**
- Compelling description
- Clear icon/screenshot
- Demo video (recommended)
- User reviews and ratings

**Outside Marketplace:**
- Blog post about your skill
- Integration guide for users
- Social media promotion
- Email to existing users

**Pricing Strategy:**
- Start competitive
- Show value clearly
- Offer trial or freemium
- Gather reviews and testimonials

---

## 🐛 Debugging & Support

### Local Development

```typescript
// Run locally before submitting
const dev = new SkillBuilder()
  .enableLocalDebug()
  .setDebugLogging(true);

const result = await dev.test({
  input: 'Test input',
  verbose: true
});
```

### Production Monitoring

```typescript
// Track performance
const metrics = {
  callsPerDay: 0,
  averageResponseTime: 0,
  errorRate: 0,
  userSatisfaction: 0
};

// Alert on issues
if (errorRate > 0.05) {
  await notifyDeveloper('Error rate above threshold');
}
```

### Support Channels

- **Documentation** - Clear, up-to-date docs
- **Email** - Direct support channel
- **Slack Community** - Developer channel
- **GitHub Issues** - Bug reporting

---

## 📈 Analytics & Revenue

### Track Your Performance

```typescript
const analytics = await app.getAnalytics({
  period: 'this-month',
  metrics: [
    'total-calls',
    'unique-users',
    'average-rating',
    'revenue'
  ]
});

console.log(analytics);
// {
//   totalCalls: 15000,
//   uniqueUsers: 500,
//   averageRating: 4.7,
//   revenue: 1500
// }
```

### View Revenue Dashboard

- Daily revenue
- Active users
- Trending capabilities
- Support tickets
- User feedback

---

## 🔗 Related Documents

For more information:
- **NORTH_STAR_ONE_MASTER_ARCHITECTURE.md** - Platform architecture
- **DIANA_DESIGN_BIBLE.md** - How to integrate with Diana's voice/design
- **AIOS_TECHNICAL_SPECIFICATION.md** - Cross-device considerations
- **ENTERPRISE_ARCHITECTURE_GUIDE.md** - Enterprise features your app can leverage

---

*Marketplace SDK Guide*  
*Constitutional Document for Third-Party Development*  
*Date: 2026-07-06*
