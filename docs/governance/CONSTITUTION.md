# AIGINVEST Constitution

**Version:** 1.0  
**Status:** Permanent — changes require full team review  
**Purpose:** Ten principles that guide every engineering, product, and business decision

---

## 1. Diana is the primary interface

Users interact through web, mobile, AIOS, or APIs — but Diana is always the guide and coordinator. Every surface should feel like a window into Diana, not a standalone application.

*Test: Can the user complete this workflow by talking to Diana?*

---

## 2. Goals come before applications

Users start by describing what they want to achieve. The platform assembles the right environment. No user should ever think "which tool do I open?" before starting work.

*Test: Does this feature help users express intent, or does it require them to navigate?*

---

## 3. Every resource belongs somewhere

No orphaned documents, tasks, conversations, or files. The hierarchy is:

```
Organization → User → Goal → Workspace → Resources
```

Every object has a parent. Every parent has an owner. Ownership drives permissions, search, and memory.

*Test: If the user asks "where is everything related to X?" — can Diana answer?*

---

## 4. AI assists, but users remain in control

Diana can recommend, automate, and act — but important actions must be transparent and, where appropriate, require explicit approval. Users must be able to review, undo, or override what Diana does.

*Test: If Diana takes an action, does the user know what happened and why?*

---

## 5. Memory is earned, not assumed

Diana remembers information that genuinely helps the user in future sessions: goals, preferences, decisions, key facts. Not every message. Quality over quantity.

*Test: Would a thoughtful human assistant remember this? Does it improve future interactions?*

---

## 6. Platform services are shared

Identity, search, storage, payments, notifications, memory, and AI routing are built once and consumed everywhere. No application reinvents what the platform already provides.

*Test: Does a new feature introduce a duplicate service, or does it use what already exists?*

---

## 7. APIs first

Every capability is accessible through a well-defined API. Web, mobile, AIOS, and future clients are all first-class consumers of the same backend. No capability exists only in the UI layer.

*Test: Can a third-party developer access this capability through the API?*

---

## 8. Security by design

Permissions, audit trails, and data privacy are requirements — not afterthoughts. Every new capability is reviewed for: who can access it, what is logged, and how user data is protected.

*Test: Has this feature been evaluated for unauthorized access, data leakage, and auditability?*

---

## 9. Every sprint delivers user value

At the end of each two-week sprint, a real user must be able to do something new or meaningfully better. Infrastructure work is only justified if it directly enables the next user-facing capability.

*Test: Can we demonstrate this sprint's work to a user in under two minutes?*

---

## 10. Simplicity wins

If two solutions solve the same problem, the simpler one is preferred unless there is a documented, compelling reason otherwise. Complexity is a liability that compounds.

*Test: Could a new developer understand this in one hour? Is this the minimum viable solution?*

---

## Using This Document

These principles are a decision tool, not a checklist.

When a proposal is debated, ask: which principles does it align with? Which does it violate? A feature that conflicts with multiple principles should be redesigned or deferred.

When a principle conflicts with another, use judgment. Principle 9 (deliver value) and Principle 10 (simplicity) often create productive tension — that tension should result in focused, well-scoped work, not paralysis.

---

## Amending This Document

The Constitution may be amended only when:

1. A principle is demonstrably wrong given new evidence
2. The full team agrees the change is necessary
3. The rationale is documented alongside the change

Amendments are not for convenience. They exist because the platform learned something important.

---

*"Users express intent. The platform assembles capability. Diana orchestrates the journey."*
