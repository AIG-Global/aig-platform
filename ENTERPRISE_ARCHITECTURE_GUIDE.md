# Enterprise Architecture Guide

**Version:** 1.0  
**Status:** Constitutional Document  
**Date:** 2026-07-06  
**Purpose:** Complete guide for North Star ONE enterprise deployments  

---

## 🏢 What is Enterprise?

Enterprise North Star ONE serves **organizations**, not just individuals.

**Key Differences:**
- **Multiple teams** within one organization
- **Hierarchy** (managers, department heads, admins)
- **Permissions** (who can see what)
- **Audit trails** (everything is logged)
- **Compliance** (HIPAA, SOC2, GDPR, industry-specific)
- **Analytics** (department usage, spend management)
- **Billing** (pay per user, per usage, or flat rate)
- **Integrations** (existing enterprise systems)

### Enterprise Tiers

**Tier 1: Business** (100-500 users)
- Multi-team support
- Basic RBAC
- Audit logging
- Standard support

**Tier 2: Enterprise** (500-5000 users)
- Advanced RBAC
- Custom branding
- Audit logging + analysis
- Priority support
- SLA guarantees

**Tier 3: Enterprise Plus** (5000+ users)
- Custom deployment options
- Advanced security
- Compliance consulting
- Dedicated account manager
- 24/7 support

---

## 🏗️ Multi-Tenant Architecture

### Tenant Isolation

```
Organization A
├─ User 1, User 2, User 3
├─ Team: Sales
├─ Team: Engineering
├─ Conversations (isolated)
├─ Documents (isolated)
└─ Data (encrypted, isolated)

Organization B
├─ User 4, User 5
├─ Team: Product
├─ Conversations (isolated)
├─ Documents (isolated)
└─ Data (encrypted, isolated)

Shared Infrastructure
├─ Authentication service
├─ AI models (isolated contexts)
├─ Search index (partitioned)
└─ Monitoring
```

### Data Isolation Levels

**Level 1: Logical (Standard)**
- All tenants share databases
- Row-level security in database
- Query filtering by organization_id
- Cost: $$$ (most efficient)
- Risk: Slightly higher (query bugs)

**Level 2: Schema (Enhanced)**
- Each tenant has separate database schema
- Shared database server
- Complete schema isolation
- Cost: $$ (moderate)
- Risk: Very low

**Level 3: Database (Maximum)**
- Each tenant has separate database
- Separate database server per tenant
- Complete isolation
- Cost: $ (most expensive)
- Risk: Nearly zero

**Implementation:**

Enterprise organizations use **Level 2** by default:
- Schema per organization
- All organizations on same servers (for efficiency)
- Complete isolation via database structure
- Can upgrade to Level 3 if needed

```typescript
interface TenantConfig {
  organizationId: string;
  isolationLevel: 'logical' | 'schema' | 'database';
  
  database: {
    server: string;           // Which database server
    schema: string;           // Organization-specific schema
    encryption: 'aes-256';
  };
  
  dataRetention: {
    conversationRetention: number;  // Days
    documentRetention: number;      // Days
    auditLogRetention: number;      // Years (usually 7)
  };
}
```

---

## 👥 Role-Based Access Control (RBAC)

### Built-in Roles

**Organization Admin**
- All permissions
- User management
- Billing
- Security settings
- Audit logs
- Organization settings

**Team Lead**
- See own team
- Manage team members
- Delegate tasks
- View team analytics
- Cannot access other teams

**Manager**
- See own team
- Assign work
- View team analytics
- Approve certifications (if applicable)
- Cannot manage users

**Member**
- Own workspace (conversations, documents)
- Collaborate with team (shared documents)
- Shared tools
- Own activity logs
- Cannot see other team members' work

**Viewer (Read-Only)**
- Access shared content
- Cannot create or modify
- Cannot download
- Useful for consultants, auditors

### Custom Roles

Organizations can define custom roles:

```typescript
interface CustomRole {
  name: string;
  description: string;
  permissions: {
    conversations: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      share: boolean;
    };
    documents: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      download: boolean;
      share: boolean;
    };
    team: {
      view: boolean;
      manage: boolean;
    };
    admin: {
      view_audit_logs: boolean;
      manage_users: boolean;
      manage_billing: boolean;
    };
  };
}
```

### Permission Inheritance

```
Organization Admin
├─ Team Lead (inherits admin for their team)
│  ├─ Manager (inherits team permissions)
│  │  └─ Member (standard permissions)
│  └─ Member
└─ Department Lead
   ├─ Team Lead
   │  └─ Member
```

---

## 🔐 Security & Authentication

### Single Sign-On (SSO)

**Supported Protocols:**
- SAML 2.0
- OpenID Connect
- OAuth2
- LDAP (Active Directory)

**Setup Process:**

```
1. Organization provides SSO details
2. Admin configures in settings
3. Users authenticate via SSO
4. Diana automatically provisions user
5. Permissions assigned based on SSO groups
```

**Code Example:**

```typescript
const ssoConfig = {
  type: 'saml2',
  entryPoint: 'https://org.okta.com/app/123/sso/saml',
  issuer: 'https://northstarone.io/sp',
  cert: 'MIICf...BzqJ',
  identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress'
};

await organization.setupSSO(ssoConfig);

// Users now login with: "Login with SSO"
```

### Multi-Factor Authentication (MFA)

**Optional for Enterprise:**
- TOTP (Google Authenticator, Authy)
- SMS codes
- Hardware keys (Yubikey)
- Biometric (fingerprint, face)

**Enforcement Options:**
- Optional (user choice)
- Required for admins
- Required for all users
- Required for sensitive data access

```typescript
const mfaPolicy = {
  required: true,
  methods: ['totp', 'hardware-key'],
  gracePeriod: 30,    // Days to set up
  resetOnDeviceChange: true
};

await organization.setMFAPolicy(mfaPolicy);
```

### Data Encryption

**In Transit:**
- TLS 1.3 for all communication
- Certificate pinning supported
- Encrypted VPN tunnel supported

**At Rest:**
- AES-256 encryption
- Customer-managed keys (BYOK) available
- Key rotation policies
- Encryption per data type

**Encryption Categories:**
- Conversations (always encrypted)
- Documents (always encrypted)
- Metadata (encrypted at rest)
- Audit logs (encrypted at rest)

---

## 📋 Audit & Compliance

### Audit Logging

Every action is logged:

```typescript
interface AuditLog {
  timestamp: string;
  userId: string;
  action: string;           // 'created_document', 'shared_conversation'
  resourceType: string;     // 'document', 'conversation'
  resourceId: string;
  organizationId: string;
  details: {
    before?: object;        // Previous state
    after?: object;         // New state
  };
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}
```

**Audited Actions:**
- User login/logout
- User created/updated/deleted
- Document created/updated/deleted/shared
- Conversation created/deleted
- Permission changes
- Settings changes
- Integration activation
- Billing changes

**Access to Audit Logs:**
- Admin: Full access
- Audit/Compliance Role: Read-only, filtered by date
- Users: Cannot access (privacy)
- External auditors: Temporary role created

### Compliance Frameworks

**HIPAA (Healthcare)**
- Supported through BAA
- Encryption requirements
- Access controls
- Audit trails
- Data breach notification

**SOC2 Type II**
- Annual audit
- Controls over access, change management
- Monitoring and logging
- Incident response procedures

**GDPR (Data Protection)**
- Right to data portability
- Right to erasure ("right to be forgotten")
- Explicit consent tracking
- Data Processing Agreements (DPA)
- Data Protection Impact Assessments (DPIA)

**Industry-Specific:**
- **Finance:** SOX, PCI-DSS
- **Healthcare:** HIPAA, HITRUST
- **Government:** FedRAMP (in progress)
- **Education:** FERPA

---

## 📊 Analytics & Management

### Organization Dashboard

**Key Metrics:**
- Active users (daily, monthly)
- Documents created
- Conversations started
- Most-used features
- API usage
- Cost breakdown

**Department Analytics:**
- Which departments use Diana most
- Which features drive value
- Spending by department
- ROI analysis

### Usage Analytics

```typescript
interface UsageAnalytics {
  period: 'day' | 'week' | 'month';
  
  activeUsers: {
    total: number;
    byDepartment: Record<string, number>;
    newThisMonth: number;
    churnThisMonth: number;
  };
  
  features: {
    conversationsStarted: number;
    documentsGenerated: number;
    searchQueries: number;
    toolsInvoked: number;
  };
  
  usage: {
    averageSessionLength: number;      // minutes
    averageMessagesPerSession: number;
    peakUsageTime: string;
  };
  
  costs: {
    apiCallCost: number;
    storageUsed: number;
    totalCost: number;
  };
}
```

### User Management Dashboard

**Admin can:**
- View all users
- Add/remove users
- Assign roles
- Set permissions
- View activity
- Send announcements
- Force password reset
- Disable/enable users
- View cost per user

---

## 💰 Billing & Licensing

### Licensing Models

**Model 1: Per-User Seat**
```
Users × Seat Price = Monthly Cost

Example:
├─ 50 users × $20/user = $1,000/month
├─ 100 users × $20/user = $2,000/month
└─ Volume discounts available at 500+ users
```

**Model 2: Usage-Based**
```
(API Calls + Storage + Generated Documents) × Unit Price

Example:
├─ 100,000 API calls × $0.0001 = $10
├─ 1 TB storage × $0.50 = $500
├─ 1,000 documents × $0.10 = $100
└─ Total = $610/month
```

**Model 3: Flat Rate (Unlimited)**
```
Organization pays flat monthly fee

Example:
├─ Startup: $500/month (up to 50 users)
├─ Business: $2,000/month (up to 500 users)
└─ Enterprise: Custom pricing (1000+ users)
```

**Model 4: Hybrid**
```
Base fee + Usage overage

Example:
├─ Base: $1,000/month (includes 50 users, 1M API calls)
├─ Each additional user: $15
├─ Each additional 100K API calls: $10
└─ Storage over 10GB: $50/TB
```

### Billing Portal

Organizations see:
- Current month usage/cost
- Previous month invoices
- Cost forecasts
- Budget alerts
- Department breakdowns
- Usage trends

### Cost Optimization

Organizations can:
- Set spending limits
- Alert when approaching limit
- Restrict features by department
- Analyze cost per feature
- Plan capacity
- Negotiate custom rates

---

## 🔧 Administration Console

### Admin Features

```
Organization > Administration
├─ Users & Roles
│  ├─ Add/remove users
│  ├─ Manage roles and permissions
│  ├─ View user activity
│  └─ Reset passwords
├─ Settings
│  ├─ Organization name/logo
│  ├─ SSO configuration
│  ├─ MFA policy
│  ├─ Data retention
│  └─ Region/compliance
├─ Security
│  ├─ Active sessions
│  ├─ Audit logs
│  ├─ Suspicious activity alerts
│  └─ Security policies
├─ Integrations
│  ├─ Connected systems (Slack, GitHub, etc)
│  ├─ Manage API keys
│  ├─ Webhooks
│  └─ Custom integrations
├─ Analytics
│  ├─ Usage reports
│  ├─ Department analytics
│  ├─ Feature adoption
│  └─ ROI analysis
└─ Billing
   ├─ Invoices
   ├─ Payment methods
   ├─ Usage & costs
   └─ Spending limits
```

---

## 🌍 Deployment Options

### Option 1: Cloud (Shared)
- Diana operates Diana's infrastructure
- Multi-tenant environment
- Automatic updates
- No maintenance required
- Fastest deployment
- Most cost-effective

**Ideal for:** Most enterprises

### Option 2: Cloud (Private Tenant)
- Diana's infrastructure, dedicated to you
- Your own database, separate from others
- Private VPC
- Custom domain
- Private integrations
- Automatic updates

**Ideal for:** Very security-conscious organizations

**Cost:** +40% over shared

### Option 3: On-Premises
- Your servers, your control
- Complete data residency
- Air-gapped option (no internet required)
- Custom integrations
- Manual updates
- Full control

**Ideal for:** Government, highly regulated industries

**Cost:** +200%, plus maintenance staff

### Option 4: Hybrid
- Some data on-premises
- Some features in cloud
- Best of both worlds
- Complex architecture

**Ideal for:** Very large organizations with legacy systems

---

## 🤝 Integration & APIs

### Enterprise Integration Points

**Incoming Integrations:**
- Slack (sync Diana responses)
- Teams (same)
- Email (Diana in every email)
- Jira (Diana understands tickets)
- Salesforce (Diana knows customers)
- SAP (Diana understands processes)

**Outgoing Integrations:**
- Diana can create tickets in Jira
- Diana can update Salesforce records
- Diana can send email
- Diana can post to Slack
- Diana can create calendar events

### Custom API Access

Organizations can:
- Get API keys
- Build custom integrations
- Access all Diana capabilities
- Implement webhooks
- Build workflows

```typescript
// Enterprise API example
const diane = new DianaAPI({
  organizationId: 'org-123',
  apiKey: process.env.DIANA_API_KEY,
  environment: 'production'
});

// Create a conversation
const conversation = await diane.conversations.create({
  userId: 'user-456',
  title: 'Q3 Planning'
});

// Add a message
const message = await diane.conversations.messages.create(
  conversation.id,
  { role: 'user', content: 'What are our key priorities?' }
);

// Get response
const response = await diane.conversations.messages.stream(
  conversation.id,
  message.id
);

response.on('data', (chunk) => {
  console.log(chunk); // Streaming response
});
```

---

## 📈 Scaling & Performance

### Performance Targets for Enterprise

**Concurrency:**
- Support 10,000+ concurrent users
- Support 1,000+ streaming conversations
- API endpoints serve 100,000+ requests/sec

**Response Times:**
- Chat response start: <500ms
- Search: <1s
- Document generation: <3s
- API calls: <200ms (p95)

**Availability:**
- 99.99% uptime SLA
- Redundant systems
- Failover in seconds
- Geographic redundancy

### Auto-Scaling

```
Usage increases
↓
System detects load
↓
More API instances spin up
↓
Load distributed
↓
Response times maintained
↓
Auto-scales back down when demand decreases
```

---

## 🆘 Support & SLA

### Support Tiers

**Standard (Included)**
- Email support
- Community forum
- Documentation
- Response time: 24 hours

**Premium ($1K/month)**
- Priority email & phone
- Dedicated support channel
- Quarterly business review
- Response time: 4 hours

**Enterprise 24/7 ($5K+/month)**
- Phone, email, chat
- Dedicated account manager
- On-site consulting available
- Response time: 1 hour (critical)
- SLA: 99.99% uptime

### Service Level Agreement (SLA)

```
Uptime Target: 99.99%
├─ Downtime permitted: 52 minutes/year
├─ If we miss target: Service credit (10% monthly fee)
└─ Maximum 2 service credits per quarter

Performance Target: <200ms response (p95)
├─ If we miss target: Investigating and reporting
└─ Severe issues trigger incident response

Security Target: Zero unauthorized access
├─ All access logged
├─ Regular security audits
└─ Breach response: <24 hour notification
```

---

## 📚 Enterprise Onboarding

### Week 1: Setup
- Organization created
- Admin account setup
- SSO configured
- Initial user bulk import

### Week 2: Configuration
- Roles and permissions configured
- Audit logging enabled
- Integrations configured
- Security settings reviewed

### Week 3: Training
- Admin training
- User training
- Best practices review
- Q&A session

### Week 4: Launch
- Soft launch (test with subset)
- Feedback collection
- Adjustments
- Full organization launch

---

## 🔗 Related Documents

For more context:
- **NORTH_STAR_ONE_MASTER_ARCHITECTURE.md** - Platform technical foundation
- **AIOS_TECHNICAL_SPECIFICATION.md** - Cross-device capabilities
- **MARKETPLACE_SDK_GUIDE.md** - How integrations work
- **DIANA_DESIGN_BIBLE.md** - User experience standards

---

*Enterprise Architecture Guide*  
*Constitutional Document for Multi-Tenant, Compliant Deployments*  
*Date: 2026-07-06*
