import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { WorkspaceService } from './workspace.service.js'
import { WorkspaceBundleDto } from './workspace.dto.js'

// ─── Mission type classifier ────────────────────────────────────────────────

const MISSION_PATTERNS: Record<string, string[]> = {
  startup:  ['start', 'launch', 'build a company', 'found', 'startup', 'business', 'venture'],
  software: ['app', 'software', 'platform', 'api', 'develop', 'coding', 'system', 'website'],
  personal: ['personal', 'journal', 'habit', 'goals', 'health', 'fitness', 'life', 'self'],
  learning: ['learn', 'study', 'understand', 'course', 'practice', 'master', 'improve'],
}

function classifyGoal(goal: string): { type: string; confidence: number } {
  const lower = goal.toLowerCase()
  let best = { type: 'general', confidence: 0 }
  for (const [type, keywords] of Object.entries(MISSION_PATTERNS)) {
    const hits = keywords.filter((kw) => lower.includes(kw)).length
    if (hits > 0) {
      const confidence = Math.min(hits / keywords.length + 0.5, 0.99)
      if (confidence > best.confidence) best = { type, confidence }
    }
  }
  return best
}

function extractTitle(goal: string): string {
  const patterns = [
    /(?:build|create|launch|start|develop) (?:an? )?(.+?)(?:\s+(?:company|startup|business|app|platform|system))?$/i,
    /(?:learn|study|master) (.+?)(?:\s+(?:from scratch|basics|fundamentals))?$/i,
    /^(?:i want to |i need to |help me )(.+)/i,
  ]
  for (const pattern of patterns) {
    const m = goal.match(pattern)
    if (m?.[1]) {
      return m[1].trim().replace(/\.$/, '').split(/\s+/).slice(0, 4).join(' ')
    }
  }
  // Fallback: first 3–4 meaningful words
  return goal.replace(/^(i want to|i need to|help me|let's|lets)\s+/i, '').split(/\s+/).slice(0, 4).join(' ')
}

// ─── Starter templates per mission type ─────────────────────────────────────

const STARTER_TASKS: Record<string, Array<{ title: string; priority: string }>> = {
  startup: [
    { title: 'Define vision and mission statement', priority: 'high' },
    { title: 'Identify your target customer', priority: 'high' },
    { title: 'Research 3 key competitors', priority: 'medium' },
    { title: 'Prototype your core feature', priority: 'medium' },
  ],
  software: [
    { title: 'Define architecture and tech stack', priority: 'high' },
    { title: 'Create repository and project structure', priority: 'high' },
    { title: 'Write first working prototype', priority: 'medium' },
    { title: 'Set up CI/CD pipeline', priority: 'medium' },
  ],
  learning: [
    { title: 'Define learning goals and timeline', priority: 'high' },
    { title: 'Find best resources (books, courses, docs)', priority: 'high' },
    { title: 'Complete first module or chapter', priority: 'medium' },
    { title: 'Build a practice project', priority: 'medium' },
  ],
  personal: [
    { title: 'Write down your current state and goal', priority: 'high' },
    { title: 'Identify 3 key habits to build', priority: 'high' },
    { title: 'Schedule daily check-in time', priority: 'medium' },
    { title: 'Review progress after one week', priority: 'medium' },
  ],
  general: [
    { title: 'Clarify the goal and define success', priority: 'high' },
    { title: 'Break goal into major milestones', priority: 'high' },
    { title: 'Identify resources and blockers', priority: 'medium' },
    { title: 'Start with the smallest next action', priority: 'medium' },
  ],
}

const WELCOME_DOC: Record<string, (title: string, goal: string) => string> = {
  startup: (title, goal) => `# ${title}

## Your Goal
${goal}

## Mission
*Define the mission for ${title} here — what problem does it solve and for whom?*

## Vision
*Where will ${title} be in 3 years?*

## Value Proposition
*What makes ${title} uniquely valuable compared to alternatives?*

## Target Customer
*Who is your ideal customer? Describe them specifically.*

---

## Next Steps
1. Complete the Vision & Mission statement
2. Identify your target customer segment
3. Research 3 key competitors
4. Define your core differentiator

*Diana will help you work through each of these.*
`,
  software: (title, goal) => `# ${title} — Architecture

## Your Goal
${goal}

## System Overview
*Describe the system and its primary purpose.*

## Core Features
1. *Feature 1*
2. *Feature 2*
3. *Feature 3*

## Tech Stack
- Frontend: 
- Backend: 
- Database: 
- Infrastructure: 

## Key Design Decisions
*Record important architectural decisions here as you make them.*

---

*Diana will help you refine the architecture as you build.*
`,
  learning: (title, goal) => `# Learning: ${title}

## Your Goal
${goal}

## What Success Looks Like
*How will you know when you've achieved your learning goal?*

## Learning Path
1. *Start with fundamentals*
2. *Build something small*
3. *Tackle a real project*
4. *Teach it to solidify understanding*

## Resources
*Add books, courses, and docs here as you find them.*

---

*Diana will guide you through each step.*
`,
  personal: (title, goal) => `# ${title}

## Your Goal
${goal}

## Current State
*Where are you now? Be honest.*

## Desired State
*Where do you want to be?*

## Key Habits to Build
1. 
2. 
3. 

## Weekly Check-in Questions
- What went well this week?
- What was difficult?
- What will I do differently?

---

*Diana will check in with you regularly.*
`,
  general: (title, goal) => `# ${title}

## Your Goal
${goal}

## What Does Success Look Like?
*Define what "done" means for this goal.*

## Major Milestones
1. 
2. 
3. 

## Key Resources Needed
*People, tools, information, or budget.*

---

*Diana has prepared this workspace to help you stay organized.*
`,
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

@Injectable()
export class WorkspaceOrchestrator {
  constructor(
    private prisma: PrismaService,
    private workspaceService: WorkspaceService,
  ) {}

  /**
   * Core "Goal → Workspace" flow.
   * Creates workspace, project, document, tasks, and memory from a single goal string.
   */
  async createFromGoal(ownerId: string, goal: string): Promise<WorkspaceBundleDto> {
    const start = Date.now()

    // 1. Classify goal → mission type + title
    const { type } = classifyGoal(goal)
    const title = extractTitle(goal)

    // 2. Create workspace
    const workspace = await this.workspaceService.create(ownerId, {
      title,
      goal,
      type: type as any,
      emoji: this.emojiForType(type),
    })

    // 3. Create project
    const project = await this.prisma.project.create({
      data: {
        userId: ownerId,
        workspaceId: workspace.id,
        name: title,
        description: goal,
        status: 'active',
        color: workspace.color,
      },
    })

    // 4. Create welcome document
    const docTemplate = WELCOME_DOC[type] ?? WELCOME_DOC.general
    const document = await this.prisma.document.create({
      data: {
        userId: ownerId,
        workspaceId: workspace.id,
        projectId: project.id,
        title: 'Welcome',
        content: docTemplate(title, goal),
        documentType: 'document',
      },
    })

    // 5. Create starter tasks
    const taskTemplates = STARTER_TASKS[type] ?? STARTER_TASKS.general
    const tasks = await Promise.all(
      taskTemplates.map((t, i) =>
        this.prisma.projectTask.create({
          data: {
            projectId: project.id,
            title: t.title,
            priority: t.priority,
            status: 'todo',
            order: i,
          },
        }),
      ),
    )

    // 6. Store Diana memory
    const memory = await this.prisma.dianaMemory.upsert({
      where: { userId_category_key: { userId: ownerId, category: 'workspace', key: `goal_${workspace.id}` } },
      create: {
        userId: ownerId,
        workspaceId: workspace.id,
        category: 'workspace',
        key: `goal_${workspace.id}`,
        value: JSON.stringify({ goal, title, type, workspaceId: workspace.id }),
        confidence: 100,
      },
      update: {
        value: JSON.stringify({ goal, title, type, workspaceId: workspace.id }),
      },
    })

    return {
      workspace,
      projectId: project.id,
      documentId: document.id,
      taskIds: tasks.map((t) => t.id),
      memoryId: memory.id,
      durationMs: Date.now() - start,
    }
  }

  private emojiForType(type: string): string {
    const map: Record<string, string> = {
      startup: '🚀',
      software: '💻',
      learning: '📚',
      personal: '🎯',
      general: '✨',
    }
    return map[type] ?? '✨'
  }
}
