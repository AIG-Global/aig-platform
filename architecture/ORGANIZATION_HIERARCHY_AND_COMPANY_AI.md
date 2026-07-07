# AIOS Organization Hierarchy & Company-Specific AI
## Multi-Tenant Organizational Structure Design

**Location:** `/architecture/ORGANIZATION_HIERARCHY_AND_COMPANY_AI.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  
**Date:** 2026-07-07  
**Scope:** Organization memberships, hierarchies, company-specific AI instances

---

## Executive Summary

AIOS transforms from individual-only membership to **organization-first architecture**. Organizations (companies) are primary members, with their own:

- Hierarchical structure (Organization → Departments → Teams → Employees)
- Company-specific AI instance trained on company data
- Independent budget, permissions, and data
- Ability to recruit other organizations (B2B2B network)
- Namespace isolation (all data per organization)

---

## Part 1: Organization Membership Model

### 1.1 Member Types

```
Individual Member
├─ Email-based identity
├─ Personal tier (Free/Starter/Professional/Business/Platinum/Vendor)
├─ Single user account
├─ Personal AI (Diana with personal memory)
├─ Can be employee of Organization
└─ Commission through MLM network

Organization Member (NEW)
├─ Legal entity (company, NGO, government, startup)
├─ Organization tier (matching individual tiers, plus Enterprise)
├─ Multiple users/employees (delegation)
├─ Company-specific AI (ABC AI trained on company data)
├─ Department structure (Finance, Sales, HR, Operations, etc)
├─ Budget allocation per department
├─ Can recruit other organizations (B2B network)
└─ Commission through organizational MLM
```

### 1.2 Organization Hierarchy

```
ORGANIZATION (Top Level)
│
├─ Legal Entity
│  ├─ Company name (e.g., "ABC Ltd")
│  ├─ Registration number
│  ├─ VAT number
│  ├─ Address
│  ├─ Industry classification
│  ├─ Employee count
│  ├─ Annual revenue
│  └─ Ownership structure
│
├─ AIOS Membership
│  ├─ Organization ID (unique)
│  ├─ Tier (Free/Starter/Professional/Business/Platinum/Enterprise)
│  ├─ Billing cycle
│  ├─ Sponsoring organization (optional)
│  ├─ Commission percentage (10-70% if member of network)
│  ├─ Created date
│  └─ Account manager (AIG)
│
├─ DEPARTMENTS
│  │
│  ├─ Finance Department
│  │  ├─ Department ID
│  │  ├─ Manager (employee)
│  │  ├─ Budget allocated: €50,000/month
│  │  ├─ Modules enabled:
│  │  │  ├─ Accounting (full access)
│  │  │  ├─ Finance (full access)
│  │  │  ├─ Investment (read-only)
│  │  │  └─ Reports (custom reports)
│  │  ├─ Employees (4)
│  │  │  ├─ CFO (admin)
│  │  │  ├─ Accountant 1
│  │  │  ├─ Accountant 2
│  │  │  └─ Finance Analyst
│  │  ├─ AI Employees (0)
│  │  └─ Permissions matrix
│  │
│  ├─ Sales Department
│  │  ├─ Department ID
│  │  ├─ Manager (employee)
│  │  ├─ Budget allocated: €80,000/month
│  │  ├─ Modules enabled:
│  │  │  ├─ CRM (full access)
│  │  │  ├─ Marketplace (full access to sell)
│  │  │  ├─ Competition (full access)
│  │  │  └─ Reports (sales reports)
│  │  ├─ Employees (8)
│  │  │  ├─ Sales Manager
│  │  │  ├─ Sales Reps (6)
│  │  │  └─ Sales Admin
│  │  ├─ AI Employees (2)
│  │  │  ├─ Sales Bot (prospecting, lead scoring)
│  │  │  └─ Customer Support Bot (handling inquiries)
│  │  └─ Permissions matrix
│  │
│  ├─ HR Department
│  │  ├─ Department ID
│  │  ├─ Manager (employee)
│  │  ├─ Budget allocated: €20,000/month
│  │  ├─ Modules enabled:
│  │  │  ├─ Team (full access)
│  │  │  ├─ Health (full access)
│  │  │  └─ Learning (full access)
│  │  ├─ Employees (2)
│  │  │  ├─ HR Manager
│  │  │  └─ HR Coordinator
│  │  ├─ AI Employees (1)
│  │  │  └─ Onboarding Bot
│  │  └─ Permissions matrix
│  │
│  └─ Operations Department
│     ├─ Department ID
│     ├─ Manager (employee)
│     ├─ Budget allocated: €60,000/month
│     ├─ Modules enabled:
│     │  ├─ Projects (full access)
│     │  ├─ Travel (full access)
│     │  ├─ Accounting (read-only)
│     │  └─ Reports (operational reports)
│     ├─ Employees (5)
│     ├─ AI Employees (1)
│     │  └─ Process Automation Bot
│     └─ Permissions matrix
│
├─ TEAMS (within departments)
│  │
│  └─ Customer Success Team (within Sales)
│     ├─ Team ID
│     ├─ Lead (employee)
│     ├─ Employees (3)
│     ├─ Assigned projects
│     └─ KPIs
│
├─ EMPLOYEES (all roles)
│  │
│  ├─ Human Employees (25 total)
│  │  ├─ CEO (super admin, all modules, all permissions)
│  │  ├─ CFO (Finance dept admin)
│  │  ├─ Sales Manager (Sales dept admin)
│  │  ├─ Individual contributors (21)
│  │  └─ Contractors/Consultants
│  │
│  ├─ AI Employees (4 total)
│  │  ├─ Sales Bot (AI instance in Sales)
│  │  ├─ Customer Support Bot (AI instance in Sales)
│  │  ├─ Onboarding Bot (AI instance in HR)
│  │  └─ Process Automation Bot (AI instance in Ops)
│  │
│  └─ External Users (Contractors)
│     ├─ Limited access roles
│     ├─ Time-limited permissions
│     └─ Audit trail
│
├─ AI INSTANCES (Company-Specific)
│  │
│  ├─ Organization AI (Master - ABC AI)
│  │  ├─ Trained on all company data
│  │  ├─ Access to all modules
│  │  ├─ CEO uses for strategic queries
│  │  └─ Governance: Company controls training data
│  │
│  ├─ Department-Specific AIs
│  │  ├─ Finance AI (Accounting, Finance modules only)
│  │  ├─ Sales AI (CRM, Marketplace, Competition only)
│  │  ├─ HR AI (Team, Health, Learning only)
│  │  └─ Operations AI (Projects, Travel only)
│  │
│  └─ Conversational Bots (Employee-Grade)
│     ├─ Sales Bot (autonomous prospecting, lead scoring)
│     ├─ Support Bot (customer service interactions)
│     ├─ Onboarding Bot (new hire training, document prep)
│     └─ Process Bot (workflow automation, data entry)
│
├─ BUDGET ALLOCATION
│  ├─ Total organization budget: €250,000/month
│  ├─ Distributed across departments:
│  │  ├─ Finance: €50k/month (20%)
│  │  ├─ Sales: €80k/month (32%)
│  │  ├─ HR: €20k/month (8%)
│  │  ├─ Operations: €60k/month (24%)
│  │  └─ Contingency: €40k/month (16%)
│  └─ Department heads approve spending within budget
│
├─ CUSTOMERS (External)
│  ├─ Customer records (CRM data)
│  ├─ Contact history
│  ├─ Order history (through Marketplace)
│  └─ Support interactions
│
├─ SUPPLIERS (External)
│  ├─ Vendor records
│  ├─ Contract terms
│  ├─ Performance metrics
│  └─ Payment history
│
└─ INTEGRATION POINTS
   ├─ Network membership (if org recruiting others)
   ├─ Sponsor organization (if recruited member)
   ├─ Partner organizations (affiliate, integrations)
   └─ Third-party connections (APIs, webhooks)
```

### 1.3 Organization Types

```
Startup (1-10 employees)
├─ Tier options: Free, Starter
├─ Typical modules: Identity, Wallet, CRM, Marketplace, Learning
├─ AI instances: 1 (master organization AI)
├─ Budget: €5,000-50,000/month
└─ Commission: 50-70% (incentive to grow)

Small Business (11-50 employees)
├─ Tier options: Starter, Professional
├─ Typical modules: All core + Accounting, Finance, Team, Projects
├─ AI instances: 2-3 (org + 1-2 department-specific)
├─ Budget: €50,000-250,000/month
└─ Commission: 40-70% (based on tier & performance)

Growing Company (51-500 employees)
├─ Tier options: Professional, Business
├─ Typical modules: All modules enabled
├─ AI instances: 5-8 (org + department + specialized bots)
├─ Budget: €250,000-1,000,000/month
├─ Custom integrations needed
└─ Commission: 30-50% (structure more complex)

Enterprise (500+ employees)
├─ Tier options: Business, Platinum, Enterprise (custom)
├─ Typical modules: All modules + custom development
├─ AI instances: 10+ (org + all departments + specialized)
├─ Budget: €1,000,000+/month
├─ Dedicated infrastructure (optional)
├─ Commission: 10-30% (negotiated per org)
└─ White-label options available
```

---

## Part 2: Company-Specific AI

### 2.1 AI Instance Architecture

```
Organization AI Instance (ABC AI)

Purpose: Every organization gets custom AI trained on their data

Training Data Sources:
├─ Documents (policies, procedures, guides)
├─ Contracts (with terms, conditions, obligations)
├─ Meeting recordings & transcripts
├─ Email conversations (opt-in)
├─ CRM data (customers, interactions)
├─ Financial data (invoices, receipts, reports)
├─ Travel data (past bookings, preferences)
├─ Product catalogs (if company sells)
├─ Internal wiki/knowledge base
└─ Historical business decisions & rationales

Model Selection:
├─ Small orgs: GPT-4 (via OpenAI API)
├─ Growing orgs: Claude + GPT-4 (multi-model)
├─ Enterprise: Custom fine-tuned models (optional)
└─ Offline: Ollama for on-premise (private enterprise)

Capabilities Unlocked by Training:
├─ Answer questions about company policies
├─ Summarize contracts & obligations
├─ Suggest decisions based on company precedent
├─ Generate company-branded content
├─ Analyze company-specific data
├─ Predict customer churn (from CRM data)
├─ Forecast cash flow (from financial data)
├─ Recommend hiring (from HR data)
└─ Personalized recommendations per employee

Governance & Control:
├─ Company admin chooses training data sources
├─ Company retains all raw data (AIG doesn't copy)
├─ Company can request retraining anytime
├─ Company can disable AI anytime
├─ All AI decisions logged & auditable
├─ Company owns all AI outputs
└─ Compliance: GDPR, SOC2, ISO27001 verified
```

### 2.2 AI Instance Types

```
MASTER ORGANIZATION AI (ABC AI - Main)
├─ Purpose: Strategic decisions, cross-functional
├─ Training: All organizational data
├─ Users: CEO, Executive team
├─ Capabilities: Big-picture analysis, strategy
├─ Example: "What's our competitive advantage?"
├─ Example: "Analyze last quarter's performance"
└─ Retention: 6 months of context

DEPARTMENT AIs (Specialized)
├─ Finance AI
│  ├─ Training: Accounting, invoices, budgets, tax records
│  ├─ Users: CFO, Accountants, Finance team
│  ├─ Example: "Create Q3 financial forecast"
│  └─ Example: "Identify cost-saving opportunities"
│
├─ Sales AI
│  ├─ Training: CRM, customer interactions, deals, sales history
│  ├─ Users: Sales team, Sales manager
│  ├─ Example: "Recommend next steps for warm prospects"
│  └─ Example: "Analyze customer churn patterns"
│
├─ HR AI
│  ├─ Training: Employee records, training history, performance
│  ├─ Users: HR team, Managers
│  ├─ Example: "Identify training needs for team"
│  └─ Example: "Generate competitive compensation analysis"
│
└─ Operations AI
   ├─ Training: Projects, timelines, expenses, processes
   ├─ Users: Operations team, Project managers
   ├─ Example: "Forecast project completion"
   └─ Example: "Optimize supply chain"

CONVERSATIONAL BOTS (Autonomous Employee-Grade)
├─ Sales Bot (AUTONOMOUS)
│  ├─ Training: Sales playbooks, successful deals, competitor intel
│  ├─ Operates: Semi-autonomous (human review before sending)
│  ├─ Capabilities:
│  │  ├─ Qualify prospects from CRM
│  │  ├─ Score leads based on company criteria
│  │  ├─ Draft personalized emails
│  │  ├─ Schedule follow-ups
│  │  └─ Update CRM with interactions
│  └─ Result: Sales team 2x more productive
│
├─ Customer Support Bot (SEMI-AUTONOMOUS)
│  ├─ Training: Common questions, company products, support guidelines
│  ├─ Operates: First-line, escalates when needed
│  ├─ Capabilities:
│  │  ├─ Answer common questions
│  │  ├─ Route complex issues to humans
│  │  ├─ Schedule support calls
│  │  └─ Update support tickets
│  └─ Result: 70% of questions resolved by AI
│
├─ Onboarding Bot (SEMI-AUTONOMOUS)
│  ├─ Training: Company policies, onboarding checklist, role requirements
│  ├─ Operates: Guides new hires through onboarding
│  ├─ Capabilities:
│  │  ├─ Answer new hire questions
│  │  ├─ Assign training modules
│  │  ├─ Schedule orientation meetings
│  │  ├─ Send policy documents
│  │  └─ Collect acknowledgments
│  └─ Result: New hires productive 2 weeks faster
│
└─ Process Automation Bot (AUTONOMOUS)
   ├─ Training: Company processes, exception rules
   ├─ Operates: Runs scheduled tasks + event-triggered
   ├─ Capabilities:
   │  ├─ Generate invoices from purchase orders
   │  ├─ Match expenses to budgets
   │  ├─ Flag exceptions for review
   │  ├─ Update project timelines
   │  └─ Route approvals to right people
   └─ Result: 90% of routine tasks automated
```

### 2.3 AI Memory Layers (Organization-Level)

```
ORGANIZATION MEMORY LAYERS

Layer 1: PERSONAL (Individual Employee)
├─ Retention: Until employee leaves company
├─ Permissions: Employee + their manager
├─ Contents:
│  ├─ Preferences (language, timezone, notification style)
│  ├─ Goals (this quarter, this year, career)
│  ├─ Favorites (frequently used, bookmarks)
│  ├─ Communication style (formal/casual, length preference)
│  ├─ Recent work (projects, customers, meetings)
│  └─ Skills & certifications
├─ Example: "Show me my Q3 goals and progress"
└─ Example: "Remind me about my customer Jane's preferences"

Layer 2: COMPANY (Organization-Wide)
├─ Retention: As long as company is member
├─ Permissions: Department level (employees see own dept data)
├─ Contents:
│  ├─ Policies (conduct, compensation, time off)
│  ├─ Organizational chart (structure, reporting)
│  ├─ Product catalog (what company sells)
│  ├─ Processes (standard operating procedures)
│  ├─ Budget allocation (per department, per quarter)
│  ├─ Key customers (major accounts, history)
│  ├─ Key suppliers (contracts, performance)
│  ├─ Financial metrics (revenue, margins, burn rate)
│  ├─ Strategic goals (company 5-year vision)
│  └─ Historical decisions (why we did X in 2024)
├─ Example: "What's our policy on remote work?"
└─ Example: "Who are our top 10 customers?"

Layer 3: PLATFORM (AIOS-Wide)
├─ Retention: Always available
├─ Permissions: All users (public knowledge)
├─ Contents:
│  ├─ General help (how to use AIOS features)
│  ├─ Module documentation (API, best practices)
│  ├─ Marketplace catalog (products available, reviews)
│  ├─ Community knowledge (Q&A, forums, best practices)
│  ├─ News & updates (new features, security alerts)
│  ├─ Compliance requirements (GDPR, SOC2, etc)
│  └─ Integration guides (connecting third-party tools)
├─ Example: "How do I export my data?"
└─ Example: "What's new in AIOS this month?"

Layer 4: AI (Conversation & Reasoning)
├─ Retention: Current conversation + 30 days in archive
├─ Permissions: Employee + their department head
├─ Contents:
│  ├─ Conversation history (context for follow-ups)
│  ├─ Current tasks (what AI is working on)
│  ├─ Recommendations (AI suggestions for review)
│  ├─ Reasoning (why AI made specific suggestions)
│  ├─ Temporary facts (derived during conversation)
│  └─ Quality metrics (confidence scores, uncertainties)
├─ Example: "What did we discuss about Project X last week?"
└─ Example: "Show me how you calculated that forecast"
```

---

## Part 3: Organizational Network (B2B2B)

### 3.1 Organization Recruitment Model

```
Individual MLM Model:
Alice (Sponsor)
├─ Recruits Bob (Member 1)
│  └─ Bob recruits Charlie (Member 2)
│     └─ Charlie recruits Diana (Member 3)
│        ├─ Alice gets commission from Bob
│        ├─ Alice gets commission from Charlie (level 2)
│        ├─ Alice gets commission from Diana (level 3)
│        └─ Commissions: 30% / 20% / 15% / 10% / 3% / 2% / 1%

ORGANIZATIONAL MLM MODEL (NEW):
Mega Corp (Sponsor Organization)
├─ Recruits Tech Startup (Member Org 1)
│  ├─ Gets organization fee €250/month (80% = €200 comm)
│  ├─ Gets product sales commission (if Startup sells)
│  └─ Tech Startup can recruit more organizations
│     └─ Mega Corp gets commission from sub-recruits too
│
├─ Recruits Service Agency (Member Org 2)
│  ├─ Gets organization fee €250/month
│  └─ Service Agency recruits 3 other agencies
│     └─ Mega Corp gets commission 2 levels deep
│
└─ Recruits Consulting Firm (Member Org 3)
   ├─ Gets organization fee €250/month
   └─ Consulting Firm becomes Top 100 vendor
      └─ Mega Corp benefits from vendor fee commissions

Result: Mega Corp's network grows GEOMETRICALLY
├─ Individual MLM: 6 direct + 36 L2 + 216 L3 = 258 members
└─ Organizational MLM: 6 orgs × 25 employees each = 150 people (but unlimited sub-orgs)
```

### 3.2 Commission Flow in Organizations

```
Scenario: Tech Startup (30 employees) joins under Mega Corp

MONTHLY RECURRING (Membership Fee):
Tech Startup pays: €399/month (Starter tier)
├─ Mega Corp (Sponsor) gets: €319.20 (80% of fee)
├─ Mega Corp's sponsor gets: €53.20 (20% level 2 share)
└─ Management fund gets: €79.80

PRODUCT SALES (Tech Startup sells €1,000):
Tech Startup generates: €1,000 in product sales
├─ Tech Startup's commission: €300 (30% - member selected)
├─ Tech Startup receives: €240 EUR + €60 AIG$ (80/20 split)
│  ├─ Mega Corp gets: €240 (sponsor commission on L1)
│  └─ Management gets: €60
└─ But Tech Startup employees may earn more
   ├─ If employee is Vendor: they keep commission
   ├─ If employee is Platinum: they get affiliate commission
   └─ Mega Corp may get secondary commission

VENDOR TIER (Tech Startup pays €7,500 joining):
Tech Startup becomes Vendor
├─ Network commission: €6,000 (to Mega Corp)
├─ Management fund: €1,500
├─ Tech Startup can now:
│  ├─ List unlimited products in marketplace
│  ├─ Receive commissions from their own sales
│  ├─ Recruit their own Vendor sub-tier orgs
│  └─ Build platform within platform
└─ Mega Corp's passive income grows with Tech Startup success
```

---

## Part 4: Database Models

```prisma
// Organization Models
model Organization {
  id                String   @id @default(cuid())
  
  // Organization Identity
  name              String   @unique
  type              String   // "individual", "startup", "smb", "enterprise"
  description       String?
  logo              String?
  website           String?
  industry          String?
  
  // Legal Entity
  registrationNumber String?
  vatNumber         String?
  address           String?
  country           String?
  
  // AIOS Membership
  tier              String   // free, starter, professional, business, platinum, enterprise
  status            String   // active, suspended, archived
  sponsorOrgId      String?  // if recruited by another organization
  sponsorOrg        Organization? @relation("OrgRecruiter", fields: [sponsorOrgId], references: [id])
  recruitedOrgs     Organization[] @relation("OrgRecruiter")
  
  // Commission Structure
  commissionPercent Int      // 10-70%
  managementFeePercent Int   @default(20) // Always 20%
  
  // AI Instance
  aiInstance        AIInstance?
  
  // Structure
  departments       Department[]
  employees         Employee[]
  teams             Team[]
  
  // Data
  customers         Customer[]
  suppliers         Supplier[]
  
  // Settings
  modules           ModuleConfig[]
  budget            Json     // per department allocation
  settings          Json     // organization-specific settings
  
  // Events
  events            Event[]
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tier, status])
  @@index([sponsorOrgId])
}

model Department {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  name              String
  description       String?
  manager           Employee?
  managerId         String?
  budget            Int      // monthly budget in cents
  
  teams             Team[]
  employees         Employee[]
  aiInstances       AIInstance[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([organizationId, name])
}

model Team {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  departmentId      String
  department        Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  
  name              String
  description       String?
  lead              Employee?
  leadId            String?
  
  employees         Employee[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([organizationId, name])
}

model Employee {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  departmentId      String
  department        Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  teamId            String?
  team              Team? @relation(fields: [teamId], references: [id], onDelete: SetNull)
  
  userId            String?  // Link to User if human
  user              User?
  
  type              String   // "human", "ai_employee", "contractor"
  email             String
  name              String
  role              String   // "ceo", "manager", "contributor", "contractor"
  
  status            String   // "active", "inactive", "on_leave", "terminated"
  
  permissions       Permission[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([organizationId, email])
}

model AIInstance {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  departmentId      String?
  department        Department? @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  
  name              String   // "ABC AI", "Finance AI", "Sales Bot"
  type              String   // "master", "department", "bot"
  model             String   // "gpt4", "claude", "ollama"
  
  trainingDataSources Json // which systems provided training data
  trainedAt         DateTime?
  trainingStatus    String   // "idle", "training", "ready", "error"
  
  memory            AIMemory[]
  conversations     AIConversation[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model AIMemory {
  id                String   @id @default(cuid())
  aiInstanceId      String
  aiInstance        AIInstance @relation(fields: [aiInstanceId], references: [id], onDelete: Cascade)
  
  layer             String   // "personal", "company", "platform", "ai"
  key               String
  value             String
  valueType         String   // "text", "json", "url"
  
  ttl               DateTime? // when to expire
  permissions       Json     // who can access
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([aiInstanceId, layer])
}

model AIConversation {
  id                String   @id @default(cuid())
  aiInstanceId      String
  aiInstance        AIInstance @relation(fields: [aiInstanceId], references: [id], onDelete: Cascade)
  userId            String
  user              User @relation(fields: [userId], references: [id])
  
  title             String?
  messages          AIMessage[]
  context           Json
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model AIMessage {
  id                String   @id @default(cuid())
  conversationId    String
  conversation      AIConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  role              String   // "user", "assistant", "system"
  content           String
  toolCalls         Json?    // if AI called a tool
  
  createdAt         DateTime @default(now())
}

model Customer {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  name              String
  email             String
  phone             String?
  company           String?
  
  interactions      Json[]
  orderHistory      String[] // order IDs
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Supplier {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  name              String
  email             String
  phone             String?
  
  contractTerms     String?
  performanceMetrics Json?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## Part 5: Security & Compliance

### 5.1 Data Isolation

```
Organization Data Isolation (Multi-Tenant):

Database Level:
├─ Every table has organization_id foreign key
├─ Row-level security (RLS) per organization
├─ Queries always filtered: WHERE org_id = current_org_id
└─ No cross-org data leakage possible

API Level:
├─ All endpoints require org context
├─ Authentication verifies user is org member
├─ Authorization checks org_id + permissions
├─ Responses filtered per organization
└─ Audit log includes org_id

AI Training:
├─ Each org's AI trained ONLY on their data
├─ No mixing of training data between orgs
├─ Org can request data deletion
├─ Model serves multiple orgs but logically isolated
└─ Weights not shared (separate model instances optional)

Compliance:
├─ GDPR: Org can request deletion of all data
├─ CCPA: Org can export all data
├─ HIPAA: Optional extra isolation for healthcare
└─ SOC2: Audit trail per organization
```

### 5.2 Permission Model

```
Organization Hierarchy Permissions:

CEO (Owner):
├─ Can view/edit all organization data
├─ Can manage all employees
├─ Can enable/disable/upgrade modules
├─ Can manage budget
├─ Can view all department data
└─ Can access all AI instances

Department Manager:
├─ Can view/edit department data only
├─ Can manage department employees
├─ Can view department budget
├─ Can access department AI instances
├─ Cannot view other departments
└─ Cannot manage organization settings

Individual Employee:
├─ Can view own data only
├─ Can update own profile
├─ Can access assigned modules
├─ Can interact with assigned AI
├─ Cannot view coworker data (unless granted)
└─ Cannot manage organization

Contractor:
├─ Limited access to specific data
├─ Time-limited permissions
├─ Cannot invite others
└─ Full audit trail
```

**Status:** 🔒 LOCKED for Phase 1 Implementation
