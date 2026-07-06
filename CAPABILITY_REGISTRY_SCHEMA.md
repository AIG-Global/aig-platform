# Capability Registry Schema & Design

**Version:** 0.2.0  
**Status:** Specification for v0.2 Implementation  
**Date:** 2026-07-06  

---

## 📖 Overview

The **Capability Registry** is the bridge between user intent and application implementation. Instead of asking "Open Academy," users say "I want to learn Kubernetes" and the system finds the right capability.

This document defines:
1. Capability schema and structure
2. How apps publish capabilities
3. How Diana queries capabilities
4. Example implementations

---

## 🎯 Core Concept

```
Traditional:     User → "Open Academy" → App loads
                 (User must know app name)

Capability-Based: User → "Learn Kubernetes" → Diana finds "learning" capability
                        → Academy app provides it → App loads transparently
                 (User focuses on goal, not implementation)
```

---

## 📋 Capability Registry Schema

### Root Structure
```json
{
  "capabilities": [
    { "id": "learning", ... },
    { "id": "payment:process", ... },
    { "id": "backup", ... }
  ],
  "metadata": {
    "version": "0.2.0",
    "generated_at": "2026-07-06T12:00:00Z",
    "total_capabilities": 24,
    "providers": 8
  }
}
```

### Single Capability Object

```typescript
interface Capability {
  // Identity
  id: string;                          // Unique ID: "learning", "payment:process"
  name: string;                        // Display name: "Learning"
  version: string;                     // Capability version: "1.0.0"
  type: "core" | "extended" | "beta";  // Stability level
  
  // Provider Info
  provider: {
    app_id: string;                   // Which app provides this: "academy"
    service_id?: string;              // Optional service: "learning-service"
    endpoint: string;                 // Where to find it: "/api/learning"
    method: "rest" | "graphql" | "grpc";
  };
  
  // Description
  description: string;                // What it does
  summary: string;                    // One-liner
  keywords: string[];                 // Search terms: ["education", "courses"]
  
  // Sub-capabilities (breaking down into operations)
  sub_capabilities?: SubCapability[];
  
  // Requirements
  requirements: {
    permissions: string[];            // Required: ["identity:read", "payments:read"]
    dependencies: string[];           // Dependencies: ["identity", "documents"]
    authentication: "public" | "bearer" | "oauth";
    rate_limits?: {
      requests_per_minute: number;
      requests_per_day: number;
    };
  };
  
  // Diana Integration
  diana: {
    prompts: string[];                // Example user queries
    responses: string[];              // Diana's example responses
    conversation_flow: string;        // Multi-turn conversation template
    context_variables: string[];      // What Diana passes: ["user_skill_level"]
  };
  
  // Operations
  operations: {
    [operation_name: string]: CapabilityOperation;
  };
  
  // Metadata
  metadata: {
    created_at: string;
    updated_at: string;
    maintained_by: string;
    support_url: string;
    documentation_url: string;
    status: "active" | "deprecated" | "experimental";
    adoption_rate?: number;           // % of users utilizing
  };
}

interface SubCapability {
  id: string;                         // "courses", "certifications"
  name: string;
  description: string;
  endpoint?: string;
  operations: string[];               // ["list", "get", "enroll", "search"]
}

interface CapabilityOperation {
  description: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  input?: {
    [param: string]: {
      type: string;
      required: boolean;
      description: string;
    };
  };
  output?: {
    type: string;
    description: string;
  };
  examples?: {
    request?: object;
    response?: object;
  };
}
```

---

## 💾 Capability Registry JSON Structure

```json
{
  "id": "learning",
  "name": "Learning",
  "version": "1.0.0",
  "type": "core",
  
  "provider": {
    "app_id": "academy",
    "service_id": "learning-service",
    "endpoint": "/api/learning",
    "method": "rest"
  },
  
  "description": "Access and manage learning content, courses, and certifications. Includes course enrollment, progress tracking, quizzes, and certificate management.",
  "summary": "Learn from structured courses and earn certifications",
  
  "keywords": [
    "education",
    "learning",
    "courses",
    "certifications",
    "training",
    "skills",
    "knowledge"
  ],
  
  "sub_capabilities": [
    {
      "id": "courses",
      "name": "Courses",
      "description": "Browse, search, and enroll in courses",
      "endpoint": "/courses",
      "operations": ["list", "search", "get", "enroll", "view-progress"]
    },
    {
      "id": "certifications",
      "name": "Certifications",
      "description": "Earn and manage certifications",
      "endpoint": "/certificates",
      "operations": ["list", "get", "claim", "view-transcript"]
    },
    {
      "id": "learning-paths",
      "name": "Learning Paths",
      "description": "Follow structured learning journeys",
      "endpoint": "/learning-paths",
      "operations": ["browse", "enroll", "get-progress", "get-recommendations"]
    },
    {
      "id": "quizzes",
      "name": "Quizzes & Assessments",
      "description": "Take assessments and quizzes",
      "endpoint": "/quizzes",
      "operations": ["list", "take", "review-results"]
    },
    {
      "id": "progress",
      "name": "Progress Tracking",
      "description": "Track learning progress and achievements",
      "endpoint": "/progress",
      "operations": ["get-summary", "get-detailed", "get-recommendations"]
    }
  ],
  
  "requirements": {
    "permissions": [
      "identity:read",
      "academy:read",
      "academy:write",
      "documents:read",
      "payments:read"
    ],
    "dependencies": [
      "identity",
      "documents",
      "payments"
    ],
    "authentication": "bearer",
    "rate_limits": {
      "requests_per_minute": 100,
      "requests_per_day": 10000
    }
  },
  
  "diana": {
    "prompts": [
      "I want to learn {topic}",
      "Show me available courses",
      "What's my learning progress?",
      "I want to earn a certificate in {subject}",
      "Recommend me a course",
      "What's the best course for {skill}?",
      "Help me find a learning path for {goal}",
      "Take a quiz",
      "Show me my completed courses"
    ],
    
    "responses": [
      "I found {count} courses for {topic}. The top-rated is '{course}' with {rating} stars.",
      "You've completed {completed} courses and are {percent}% through your current learning path.",
      "Based on your interests, I recommend the '{course}' course.",
      "You're eligible to claim a certificate in {subject}. Shall I help you?"
    ],
    
    "conversation_flow": "Learning Intent → Course Search → Enrollment → Progress Tracking",
    
    "context_variables": [
      "user_skill_level",
      "user_interests",
      "user_completed_courses",
      "user_current_goals",
      "available_time_per_week"
    ]
  },
  
  "operations": {
    "search": {
      "description": "Search for courses by topic, level, or keyword",
      "endpoint": "/courses/search",
      "method": "GET",
      "input": {
        "q": {
          "type": "string",
          "required": true,
          "description": "Search query"
        },
        "level": {
          "type": "enum[beginner|intermediate|advanced]",
          "required": false,
          "description": "Course difficulty level"
        },
        "category": {
          "type": "string",
          "required": false,
          "description": "Course category"
        },
        "limit": {
          "type": "integer",
          "required": false,
          "description": "Results limit (default: 10)"
        }
      },
      "output": {
        "type": "array[Course]",
        "description": "Matching courses with metadata"
      },
      "examples": {
        "request": {
          "q": "Kubernetes",
          "level": "beginner",
          "limit": 5
        },
        "response": {
          "courses": [
            {
              "id": "k8s-101",
              "title": "Kubernetes for Beginners",
              "instructor": "Jane Doe",
              "level": "beginner",
              "rating": 4.9,
              "students": 2300,
              "duration_hours": 8,
              "price": 49.99
            }
          ]
        }
      }
    },
    
    "enroll": {
      "description": "Enroll the current user in a course",
      "endpoint": "/courses/{courseId}/enroll",
      "method": "POST",
      "input": {
        "courseId": {
          "type": "string",
          "required": true,
          "description": "Course ID to enroll in"
        }
      },
      "output": {
        "type": "Enrollment",
        "description": "Enrollment confirmation with enrollment ID"
      },
      "examples": {
        "request": {
          "courseId": "k8s-101"
        },
        "response": {
          "enrollment_id": "enr_12345",
          "course_id": "k8s-101",
          "user_id": "usr_abc123",
          "enrolled_at": "2026-07-06T12:00:00Z",
          "status": "active"
        }
      }
    },
    
    "get_progress": {
      "description": "Get user's progress in a course",
      "endpoint": "/courses/{enrollmentId}/progress",
      "method": "GET",
      "input": {
        "enrollmentId": {
          "type": "string",
          "required": true,
          "description": "Enrollment ID"
        }
      },
      "output": {
        "type": "Progress",
        "description": "Detailed progress information"
      },
      "examples": {
        "request": {
          "enrollmentId": "enr_12345"
        },
        "response": {
          "enrollment_id": "enr_12345",
          "course_title": "Kubernetes for Beginners",
          "completion_percent": 35,
          "lessons_completed": 7,
          "lessons_total": 20,
          "current_lesson": "Introduction to Pods",
          "time_spent_hours": 2.5,
          "last_accessed": "2026-07-06T10:30:00Z"
        }
      }
    },
    
    "get_recommendation": {
      "description": "Get personalized course recommendations",
      "endpoint": "/recommendations",
      "method": "GET",
      "input": {
        "interest": {
          "type": "string",
          "required": false,
          "description": "Topic of interest"
        },
        "level": {
          "type": "enum[beginner|intermediate|advanced]",
          "required": false,
          "description": "Desired difficulty"
        }
      },
      "output": {
        "type": "array[Course]",
        "description": "Recommended courses"
      }
    }
  },
  
  "metadata": {
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-07-06T12:00:00Z",
    "maintained_by": "engineering@aig.com",
    "support_url": "https://github.com/AIG-Global/aig-platform/issues?label=academy",
    "documentation_url": "https://docs.aig.com/learning",
    "status": "active",
    "adoption_rate": 0.87,
    "version_history": [
      {
        "version": "1.0.0",
        "released": "2026-01-01",
        "changes": "Initial release"
      },
      {
        "version": "1.1.0",
        "released": "2026-04-15",
        "changes": "Added learning paths, improved recommendations"
      }
    ]
  }
}
```

---

## 🔍 Query Patterns for Diana

### Pattern 1: Exact Capability Match
```
User: "I want to learn"
Diana Query: capability.id = "learning"
Result: learning capability found
Action: Launch academy, show learning interface
```

### Pattern 2: Keyword Search
```
User: "I want to learn Kubernetes"
Diana Query: capability.keywords contains "learning" OR capability.keywords contains "kubernetes"
Result: learning capability + courses sub-capability
Action: Search Academy for Kubernetes courses
```

### Pattern 3: Sub-Capability Match
```
User: "Take a quiz"
Diana Query: capability.sub_capabilities.id contains "quizzes"
Result: quizzes sub-capability in learning capability
Action: Launch Academy, go to quizzes section
```

### Pattern 4: Intent-Based Discovery
```
User: "I need to make a payment"
Diana Query: capability.keywords contains "payment" AND capability.requirements.permissions contains "payments:write"
Result: payment:process capability
Action: Launch payment interface with appropriate provider
```

### Pattern 5: Recommendation
```
User: "What can you help me with?"
Diana Query: capability.diana.prompts (list all)
Result: All available prompts shown
Action: Diana presents options to user
```

---

## 🚀 App Integration Guide

### How Apps Publish Capabilities

**Step 1: Define Capability Object**
```json
{
  "id": "learning",
  "name": "Learning",
  "provider": { "app_id": "academy" },
  ...
}
```

**Step 2: Register in App Metadata**
```json
{
  "id": "academy",
  "capabilities": ["learning", "certification"],
  "capability_registry_url": "/api/capabilities"
}
```

**Step 3: Expose Capability Endpoint**
```typescript
@Controller('api/capabilities')
export class CapabilityController {
  @Get()
  listCapabilities() {
    return [
      { id: "learning", ... },
      { id: "certification", ... }
    ]
  }
  
  @Get(':id')
  getCapability(@Param('id') id: string) {
    return this.capabilityService.get(id)
  }
}
```

**Step 4: Capabilities Auto-Discovered**
- On app startup, North Star ONE discovers capabilities
- Capability Registry auto-updates
- Diana immediately uses new capabilities

---

## 📊 Built-In Capabilities

### By Category

**Learning & Development**
- `learning` → Academy
- `certification` → Academy
- `knowledge-base` → Documents

**Business Operations**
- `payment:process` → Payment Service
- `payment:refund` → Payment Service
- `subscription:manage` → Payment Service
- `invoice:view` → Payment Service

**System Management**
- `backup` → Beam Me Up
- `restore` → Beam Me Up
- `sync` → Beam Me Up
- `migration` → Beam Me Up

**Marketplace**
- `purchase` → Marketplace
- `browse-plugins` → Marketplace
- `install-plugin` → Marketplace
- `manage-subscription` → Marketplace

**Communication**
- `messaging` → Notification Hub
- `email:send` → Notification Hub
- `notification:subscribe` → Notification Hub

**Data & Documents**
- `document:upload` → Documents Service
- `document:search` → Documents Service
- `document:share` → Documents Service

**User Management**
- `profile:manage` → Identity Service
- `roles:manage` → Identity Service
- `permissions:manage` → Identity Service

---

## 🎯 Capability Lifecycle

```
Create
  ↓
Register (published in capabilities.json)
  ↓
Discover (North Star ONE scans)
  ↓
Indexed (added to search index)
  ↓
Active (Diana can use it)
  ↓
Deprecated (marked, new version recommended)
  ↓
Retired (removed from active)
```

---

## 📈 Capability Metrics

Track per capability:
- **Usage Count** - How many times invoked this week
- **User Count** - Distinct users using it
- **Success Rate** - % of successful operations
- **Avg Response Time** - Performance metric
- **Error Rate** - Failures and issues
- **Adoption Rate** - % of eligible users using it

```json
{
  "capability_id": "learning",
  "period": "2026-07-01T00:00:00Z/2026-07-06T23:59:59Z",
  "metrics": {
    "invocations": 12456,
    "unique_users": 2345,
    "success_rate": 0.9876,
    "avg_response_ms": 234,
    "error_rate": 0.0124,
    "adoption_rate": 0.87
  }
}
```

---

## 🔐 Capability Permissions

Each capability declares permissions needed:

```json
{
  "capability_id": "learning",
  "required_permissions": [
    "identity:read",
    "academy:read",
    "academy:write",
    "documents:read"
  ]
}
```

Diana validates user has permissions before invoking.

---

## 🧪 Testing Capabilities

### Unit Test
```typescript
describe('Learning Capability', () => {
  it('should search for courses', async () => {
    const result = await capability.operations.search({
      q: 'Kubernetes',
      level: 'beginner'
    })
    expect(result.courses.length).toBeGreaterThan(0)
    expect(result.courses[0].title).toContain('Kubernetes')
  })
  
  it('should require authentication', async () => {
    expect(capability.requirements.authentication).toBe('bearer')
  })
})
```

### Integration Test
```typescript
describe('Diana + Learning Capability', () => {
  it('should respond to learning intent', async () => {
    const response = await diana.process('I want to learn Kubernetes')
    expect(response).toContain('courses')
    expect(response).toContain('Kubernetes')
  })
})
```

---

## 📚 Example Implementations

### Academy → Learning Capability
```
Academy registers 5 capabilities:
├─ learning (core)
├─ certification (core)
├─ career-paths (extended)
├─ instructor-tools (extended)
└─ admin-panel (internal)
```

### Marketplace → Shopping Capability
```
Marketplace registers 4 capabilities:
├─ purchase (core)
├─ browse (core)
├─ subscriptions (core)
└─ reviews (extended)
```

### Beam Me Up → Backup Capability
```
Beam Me Up registers 4 capabilities:
├─ backup (core)
├─ restore (core)
├─ sync (core)
└─ migration (extended)
```

---

## 🎛️ Capability Registry Admin Interface

### View All Capabilities
```
GET /registry/capabilities
→ Returns all 20+ capabilities with metrics
```

### Add Capability
```
POST /registry/capabilities
Body: { capability object }
```

### Update Capability
```
PUT /registry/capabilities/{id}
Body: { updated fields }
```

### Deprecate Capability
```
PATCH /registry/capabilities/{id}/deprecate
Body: { replacement_id: "new-capability-id" }
```

### Get Usage Metrics
```
GET /registry/capabilities/{id}/metrics
→ Returns usage stats for past week/month/quarter
```

---

## 🔮 Future Enhancements

### AI-Powered Recommendations
```
Diana learns which capabilities users combine
→ Suggests capability combinations
→ Auto-orchestrates multi-app flows
```

### Capability Graphs
```
Visualize how capabilities depend on each other
→ Identify missing capabilities
→ Plan ecosystem expansion
```

### Marketplace for Capabilities
```
Third-party developers submit custom capabilities
→ Community-built extensions
→ Rating and review system
```

---

## ✅ Implementation Checklist

- [ ] Define CapabilityRegistry schema
- [ ] Update AppRegistry to include capabilities
- [ ] Create capabilities.json with initial 20+ capabilities
- [ ] Add capability discovery to North Star ONE
- [ ] Implement capability query endpoints
- [ ] Add Diana capability matching logic
- [ ] Build capability search index
- [ ] Create capability metrics tracking
- [ ] Build capability admin interface
- [ ] Test 10+ Diana intent→capability flows
- [ ] Document capability publishing guide
- [ ] Create developer examples
- [ ] Performance testing

---

**This is how you build an infinitely extensible platform.** 🚀

Every new capability automatically available to Diana. Every new app automatically discovered. The system grows organically without hardcoding.
