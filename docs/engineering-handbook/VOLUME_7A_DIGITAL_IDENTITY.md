# AIGINVEST Engineering Handbook
## Volume 7A: Digital Identity

**Volume:** 7A of 18  
**Section:** 4 (Business Platform)  
**Pages:** 80 (estimated)  
**Audience:** Product, Engineering, Operations  
**Last Updated:** July 7, 2026  
**Status:** 🟢 Complete & Locked  

---

## Table of Contents

1. Identity Philosophy
2. Identity Model (7 Core Objects)
3. Personal Profile
4. Organization Profile
5. Verified Identity
6. AI Profile
7. Connected Services & Integrations
8. Device Management

---

## 1. Identity Philosophy

### Identity is Everything

Every action in AIGINVEST is attributed to someone.

But "someone" is complex:

- **A person** (human user)
- **In an organization** (team context)
- **With a history** (reputation, trust)
- **Across devices** (phone, laptop, web)
- **With preferences** (how I like to work)
- **With a relationship to AI** (how Diana knows me)
- **With external connections** (GitHub, Slack, etc.)

Without proper identity, the system breaks.

---

### Seven Dimensions of Identity

```
┌─────────────────────────────────┐
│  Digital Identity (Complete)    │
├─────────────────────────────────┤
│ 1. Personal Profile             │ Who I am
│ 2. Organization Profile         │ Where I work
│ 3. Verified Identity            │ Proof I'm me
│ 4. AI Profile                   │ How Diana knows me
│ 5. Preferences                  │ How I like to work
│ 6. Connected Services           │ Where I belong
│ 7. Device Management            │ Where I connect
└─────────────────────────────────┘
```

Each dimension enables different capabilities.

---

## 2. Identity Model (7 Core Objects)

### The Core Objects

```
User
├─ PersonalProfile
├─ OrganizationMembership (1:many)
│  └─ OrganizationProfile
├─ VerifiedIdentity (optional)
├─ AIProfile
├─ Preferences
├─ ConnectedServices (1:many)
└─ Devices (1:many)
```

---

## 3. Personal Profile

### What It Includes

```
PersonalProfile {
  // Identity
  userId: string (unique, immutable)
  email: string (unique, verified)
  displayName: string
  avatar: string (upload or generate)
  
  // Contact
  phoneNumber?: string (optional, encrypted)
  timezone: string (e.g., "America/New_York")
  language: string (e.g., "en-US")
  
  // Public Info
  bio?: string (markdown)
  website?: string
  linkedIn?: string
  twitter?: string
  github?: string
  
  // Private Info
  dateOfBirth?: Date (private, not shared)
  address?: Address (private, encrypted)
  
  // Status
  status: 'active' | 'onboarding' | 'paused' | 'archived'
  createdAt: timestamp
  lastLoginAt: timestamp
  
  // Privacy Settings
  privacy: {
    profilePublic: boolean (discoverable)
    showEmail: boolean (in collaborations)
    showActivity: boolean (in team)
    allowDirectMessages: boolean
  }
}
```

---

## 4. Organization Profile

### What It Includes

```
OrganizationProfile {
  // Identity
  organizationId: string (unique)
  name: string
  slug: string (e.g., "acme-corp")
  avatar: string (company logo)
  
  // Contact
  website: string
  email: string
  phoneNumber: string
  
  // Details
  industry: string (e.g., "Software")
  size: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
  country: string
  
  // Settings
  timezone: string
  language: string
  currency: string
  
  // Admin
  owner: User
  members: User[] (with roles)
  
  // Privacy
  privacy: {
    discoverable: boolean
    marketplaceVisible: boolean
    membersVisible: boolean
  }
  
  // Branding
  branding?: {
    colors?: { primary, secondary }
    logo?: string
    customDomain?: string
  }
}
```

---

## 5. Verified Identity

### Optional: Proof That I'm Me

Some users want to prove their identity:

```
VerifiedIdentity {
  // Identity Proof
  verificationLevel: 'unverified' | 'email' | 'phone' | 'government' | 'professional'
  
  // Email Verification
  email: string
  emailVerifiedAt: timestamp
  
  // Phone Verification
  phoneNumber: string (encrypted)
  phoneVerifiedAt: timestamp
  
  // Government ID (optional)
  govIdentity?: {
    type: 'passport' | 'license' | 'national_id'
    country: string
    issuedAt: timestamp
    expiresAt: timestamp
    // Don't store actual ID, only verification
    verifiedBy: 'manual' | 'automated' | 'service'
    verificationAt: timestamp
  }
  
  // Professional Credentials (optional)
  credentials: {
    title?: string (e.g., "Senior Software Engineer")
    company?: string
    certifications?: [{name, issuer, verifiedAt}]
  }
  
  // Legal Agreements
  termsAgreed: timestamp
  privacyAgreed: timestamp
  
  // Status
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  expiresAt?: timestamp
}
```

---

## 6. AI Profile

### How Diana Knows Me

```
AIProfile {
  // Communication Style
  communicationStyle: {
    formality: 'casual' | 'professional' | 'formal'
    verbosity: 'concise' | 'balanced' | 'detailed'
    tone: 'friendly' | 'neutral' | 'authoritative'
  }
  
  // Learning Preferences
  learningStyle: {
    visualLearner: number (0-1)
    auditoryLearner: number (0-1)
    kinestheticLearner: number (0-1)
  }
  
  // Work Patterns
  workPatterns: {
    timezone: string
    peakProductivityHours: [start, end]
    preferredWorkDays: string[] (e.g., ['Mon', 'Tue'])
    breakDuration: number (minutes)
  }
  
  // Goals & Interests
  goals: string[] (what I want to achieve)
  interests: string[] (AI can leverage)
  industry: string (domain expertise)
  skills: string[] (what I'm good at)
  
  // Diana Personality
  dianaPersonality: {
    warmth: number (0-1) // How friendly Diana should be
    patience: number (0-1) // How patient Diana should be
    boldness: number (0-1) // How bold Diana should be
    humor: number (0-1) // How funny Diana should be
  }
  
  // Communication Preferences
  preferences: {
    explainDecisions: boolean (always show reasoning)
    suggestAlternatives: boolean (offer options)
    proactiveReminders: boolean (Diana initiates)
    notificationFrequency: 'never' | 'daily' | 'weekly' | 'real-time'
  }
  
  // History & Trust
  history: {
    totalInteractions: number
    successfulRecommendations: number (Diana was right)
    rejectedRecommendations: number (Diana was wrong)
    avgTrustScore: number (0-1)
    lastUpdated: timestamp
  }
}
```

---

## 7. Preferences

### How I Like to Work

```
Preferences {
  // UI Preferences
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'normal' | 'large' | 'xl'
  compactMode: boolean
  sidebarCollapsed: boolean
  
  // Notification Preferences
  notifications: {
    desktop: boolean
    email: boolean
    slack: boolean
    sms: boolean
    frequency: 'real-time' | 'daily-digest' | 'weekly-digest'
  }
  
  // Email Preferences
  email: {
    newsletter: boolean (marketing)
    weeklyDigest: boolean (activity summary)
    productUpdates: boolean (new features)
    communityDigest: boolean (marketplace)
  }
  
  // Privacy Preferences
  privacy: {
    shareActivity: boolean (teammates see what I'm doing)
    shareProfile: boolean (profile visible to others)
    allowAnalytics: boolean (usage tracking)
    allowAI: boolean (Diana learns from me)
  }
  
  // Integration Defaults
  integrations: {
    defaultSlackChannel?: string
    defaultEmailAddress?: string
    defaultCalendar?: string
  }
  
  // Accessibility
  accessibility: {
    highContrast: boolean
    reduceMotion: boolean
    screenReader: boolean
    captions: boolean
  }
}
```

---

## 8. Connected Services & Integrations

### I Am More Than Just This System

```
ConnectedService {
  // Service Info
  serviceId: string
  service: 'slack' | 'github' | 'linear' | 'figma' | 'notion' | 'google' | 'microsoft' | 'stripe'
  
  // Authorization
  status: 'connected' | 'disconnected' | 'error'
  accessToken: string (encrypted)
  refreshToken?: string (encrypted)
  expiresAt?: timestamp
  scopes: string[] (requested permissions)
  
  // User's Service Account
  serviceUserId: string
  serviceUsername: string
  serviceEmail?: string
  
  // Usage
  connectedAt: timestamp
  lastUsedAt: timestamp
  lastSyncAt?: timestamp
  
  // Sync Settings
  autoSync: boolean
  syncFrequency: 'real-time' | 'hourly' | 'daily'
  
  // Capabilities (what can Diana do)
  capabilities: {
    read: boolean
    write: boolean
    execute: boolean
    sync: boolean
  }
}
```

---

### Connected Service Examples

**GitHub Integration:**
- Read repositories
- Create issues/PRs
- Update pull requests
- Sync commits to timeline

**Slack Integration:**
- Send notifications
- Post summaries
- Create channels
- Sync conversations

**Linear Integration:**
- Sync issues
- Create tickets from Diana
- Update status
- Link to missions

**Google Integration:**
- Read/write calendar
- Read Gmail
- Access Google Drive
- Sync documents

**Notion Integration:**
- Sync databases
- Create pages
- Update content
- Backup knowledge

---

## 9. Device Management

### I Connect From Multiple Devices

```
Device {
  // Device Identity
  deviceId: string (unique, generated)
  name: string (e.g., "MacBook Pro")
  type: 'web' | 'ios' | 'android' | 'desktop' | 'tablet' | 'watch'
  os: string (e.g., "macOS 14.0")
  
  // Technical Details
  userAgent: string
  ipAddress: string (last known)
  browser?: string (e.g., "Chrome 120")
  
  // Status
  status: 'active' | 'inactive' | 'suspended'
  lastActivityAt: timestamp
  createdAt: timestamp
  
  // Trust
  isTrusted: boolean (user confirmed this is their device)
  trustedAt?: timestamp
  
  // Capabilities
  capabilities: {
    webPush: boolean
    biometric: boolean (fingerprint, face)
    offline: boolean
    sync: boolean
  }
  
  // Encryption
  encryptionKey: string (encrypted)
  publicKey: string (for device-to-device)
}
```

---

### Device Trust Flow

1. **First Login** → Device created, marked "untrusted"
2. **Confirmation Email** → User confirms device
3. **Device Trusted** → Can access sensitive data
4. **Biometric Optional** → Add fingerprint/Face ID
5. **Suspicious Activity** → Prompt re-verification
6. **Manual Untrust** → User can untrust a device

---

## Complete Identity Data Model

```typescript
interface DigitalIdentity {
  // Core
  userId: string;
  createdAt: timestamp;
  updatedAt: timestamp;
  
  // 1. Personal
  personalProfile: PersonalProfile;
  
  // 2. Organization (multiple)
  organizationMemberships: {
    organizationId: string;
    role: 'owner' | 'admin' | 'member' | 'guest';
    permissions: Permission[];
  }[];
  
  // 3. Verified (optional)
  verifiedIdentity?: VerifiedIdentity;
  
  // 4. AI Relationship
  aiProfile: AIProfile;
  
  // 5. How I Work
  preferences: Preferences;
  
  // 6. Connected Services
  connectedServices: ConnectedService[];
  
  // 7. My Devices
  devices: Device[];
}
```

---

## Privacy & Security

### What's Encrypted

- ✅ Phone numbers
- ✅ Addresses
- ✅ Government IDs (encrypted separately)
- ✅ OAuth tokens
- ✅ Device encryption keys
- ✅ Email (in transit)

### What's Public (If Enabled)

- ✅ Display name
- ✅ Avatar
- ✅ Bio
- ✅ Professional credentials
- ✅ Social media handles

### What's Private (Never Shared)

- ✅ Email address (unless explicitly shared)
- ✅ Phone number
- ✅ Address
- ✅ Government ID details
- ✅ OAuth tokens
- ✅ Device list
- ✅ Location data

---

## Implementation Roadmap

### Week 1-2
- ✅ Personal Profile (login MVP)
- ✅ Organization Profile (basic)
- ✅ Basic Preferences

### Week 3-4
- ✅ AI Profile (Diana learns)
- ✅ Device Management
- ✅ OAuth integrations (GitHub, Google)

### Week 5-6
- ✅ Verified Identity (email, phone)
- ✅ More Connected Services
- ✅ Privacy controls

### Week 7-8
- ✅ Advanced AI Profile
- ✅ Government ID verification
- ✅ Professional credentials

---

## Success Metrics

By Week 6:
- ✅ All users have complete personal profile
- ✅ >90% organization profiles complete
- ✅ >75% have connected service
- ✅ Device sync working

By Week 12:
- ✅ >50% verified users
- ✅ >80% AI profile trained
- ✅ >90% cross-device sync
- ✅ >60% with connected services

---

**Published:** July 7, 2026  
**Status:** 🟢 Complete & Locked  
**Next:** Implementation (Week 2)  

Identity is the foundation.  
Everything else is built on trust.
