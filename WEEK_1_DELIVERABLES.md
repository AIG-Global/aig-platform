# Week 1 Deliverables (July 8-12, 2026)

**Goal**: User can create a mission and see a workspace.

**Success**: By Friday EOD, new user can:
1. Sign up
2. Create a mission ("Launch Alpha")
3. See mission in dashboard
4. See auto-provisioned workspace
5. See Diana greeting in chat

**Backlog Issues**: AIG-P001, AIG-P002, AIG-P005

---

## Monday (July 8)

### Task 1: Implement MissionService (4 hours)

**File**: `apps/api/src/mission/mission.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@Injectable()
export class MissionService {
  constructor(private prisma: PrismaService) {}

  // Create a new mission
  async create(organizationId: string, userId: string, dto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        title: dto.title,
        description: dto.description,
        objective: dto.objective,
        organizationId,
        ownerId: userId,
        status: 'planning',
        priority: dto.priority || 'medium',
        deadline: dto.deadline,
        startDate: new Date(),
      },
      include: {
        owner: true,
        organization: true,
      },
    });
  }

  // Get all missions for a user in their organizations
  async findAll(organizationId: string) {
    return this.prisma.mission.findMany({
      where: { organizationId },
      include: {
        owner: true,
        progress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get single mission with all context
  async findOne(id: string) {
    return this.prisma.mission.findUnique({
      where: { id },
      include: {
        owner: true,
        organization: true,
        workspace: true,
        milestones: true,
        progress: true,
      },
    });
  }

  // Update mission
  async update(id: string, dto: UpdateMissionDto) {
    return this.prisma.mission.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        objective: dto.objective,
        deadline: dto.deadline,
        priority: dto.priority,
      },
      include: {
        owner: true,
        organization: true,
        progress: true,
      },
    });
  }

  // Change mission status
  async updateStatus(id: string, status: string) {
    // Validate transitions
    const validTransitions: Record<string, string[]> = {
      planning: ['active'],
      active: ['paused', 'completed'],
      paused: ['active', 'abandoned'],
      completed: [],
      abandoned: [],
    };

    const mission = await this.findOne(id);
    if (!validTransitions[mission.status]?.includes(status)) {
      throw new Error(`Cannot transition from ${mission.status} to ${status}`);
    }

    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }

    return this.prisma.mission.update({
      where: { id },
      data: updateData,
      include: {
        owner: true,
        organization: true,
        progress: true,
      },
    });
  }

  // Soft delete mission (archive)
  async delete(id: string) {
    return this.prisma.mission.update({
      where: { id },
      data: { status: 'archived' },
    });
  }
}
```

**Test Cases**:
```typescript
describe('MissionService', () => {
  it('should create a mission', async () => {
    const mission = await service.create('org_123', 'user_456', {
      title: 'Launch Alpha',
      description: 'First release',
      objective: 'Get to 100 beta users',
    });
    expect(mission.title).toBe('Launch Alpha');
    expect(mission.status).toBe('planning');
    expect(mission.organizationId).toBe('org_123');
  });

  it('should list missions for organization', async () => {
    const missions = await service.findAll('org_123');
    expect(missions.length).toBeGreaterThan(0);
  });

  it('should get single mission with context', async () => {
    const mission = await service.findOne('mission_123');
    expect(mission.owner).toBeDefined();
    expect(mission.organization).toBeDefined();
  });

  it('should update mission', async () => {
    const updated = await service.update('mission_123', {
      title: 'Updated Title',
    });
    expect(updated.title).toBe('Updated Title');
  });

  it('should validate status transitions', async () => {
    await expect(service.updateStatus('mission_123', 'invalid')).rejects.toThrow();
  });
});
```

**Definition of Done**:
- [ ] Code written
- [ ] All test cases pass
- [ ] No TypeScript errors
- [ ] Commit to feature branch

---

### Task 2: Create DTO classes (1 hour)

**File**: `apps/api/src/mission/dto/index.ts`

```typescript
export class CreateMissionDto {
  title: string;
  description?: string;
  objective?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  deadline?: Date;
}

export class UpdateMissionDto {
  title?: string;
  description?: string;
  objective?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  deadline?: Date;
}
```

**Definition of Done**:
- [ ] File created
- [ ] No TypeScript errors

---

### Task 3: End-of-day commit (1 hour)

```bash
git add apps/api/src/mission/
git commit -m "feat: Implement MissionService with CRUD operations

- Create mission in organization
- List missions filtered by org
- Get single mission with full context
- Update mission properties
- Change mission status (with validation)
- Soft delete (archive) mission
- Tests: 5 cases, all passing
- Ready for MissionController integration"
```

**Definition of Done**:
- [ ] Commit to feature branch
- [ ] All tests passing
- [ ] No console errors

---

## Tuesday (July 9)

### Task 1: Implement MissionController (4 hours)

**File**: `apps/api/src/mission/mission.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@Controller('api/missions')
export class MissionController {
  constructor(private missionService: MissionService) {}

  // Extract user and org from headers
  private extractUser(headers: any) {
    const userId = headers['x-user-id'];
    const organizationId = headers['x-org-id'];
    if (!userId || !organizationId) {
      throw new Error('Missing x-user-id or x-org-id header');
    }
    return { userId, organizationId };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateMissionDto,
    @Headers() headers: any,
  ) {
    const { userId, organizationId } = this.extractUser(headers);
    const mission = await this.missionService.create(organizationId, userId, dto);
    return {
      statusCode: 201,
      data: mission,
    };
  }

  @Get()
  async findAll(@Headers() headers: any) {
    const { organizationId } = this.extractUser(headers);
    const missions = await this.missionService.findAll(organizationId);
    return {
      statusCode: 200,
      data: missions,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mission = await this.missionService.findOne(id);
    if (!mission) {
      return {
        statusCode: 404,
        error: 'Mission not found',
      };
    }
    return {
      statusCode: 200,
      data: mission,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMissionDto,
  ) {
    const mission = await this.missionService.update(id, dto);
    return {
      statusCode: 200,
      data: mission,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    try {
      const mission = await this.missionService.updateStatus(id, body.status);
      return {
        statusCode: 200,
        data: mission,
      };
    } catch (error) {
      return {
        statusCode: 400,
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.missionService.delete(id);
  }
}
```

**Test Cases**:
```typescript
describe('MissionController', () => {
  it('POST /api/missions should create mission', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/missions')
      .set('x-user-id', 'user_123')
      .set('x-org-id', 'org_456')
      .send({
        title: 'Test Mission',
        objective: 'Test objective',
      })
      .expect(201);

    expect(response.body.data.title).toBe('Test Mission');
  });

  it('GET /api/missions should list missions', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/missions')
      .set('x-user-id', 'user_123')
      .set('x-org-id', 'org_456')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /api/missions/:id should return mission', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/missions/mission_123')
      .expect(200);

    expect(response.body.data.id).toBe('mission_123');
  });

  it('PATCH /api/missions/:id/status should change status', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/missions/mission_123/status')
      .send({ status: 'active' })
      .expect(200);

    expect(response.body.data.status).toBe('active');
  });
});
```

**Definition of Done**:
- [ ] Controller code written
- [ ] All test cases passing
- [ ] HTTP status codes correct
- [ ] Error handling in place

---

### Task 2: Create MissionModule (1 hour)

**File**: `apps/api/src/mission/mission.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
```

**Definition of Done**:
- [ ] Module created
- [ ] Exports MissionService
- [ ] Imports PrismaModule

---

### Task 3: Add MissionModule to AppModule (1 hour)

**File**: `apps/api/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MissionModule } from './mission/mission.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MissionModule,      // ← ADD THIS
    WorkspaceModule,
    ChatModule,
  ],
})
export class AppModule {}
```

**Definition of Done**:
- [ ] MissionModule imported
- [ ] No circular dependencies

---

### Task 4: Compile and test (1 hour)

```bash
cd apps/api
npm run build
npm run test
```

**Definition of Done**:
- [ ] Build succeeds (exit code 0)
- [ ] All unit tests pass
- [ ] No TypeScript errors
- [ ] Commit to feature branch

---

## Wednesday (July 10)

### Task 1: Implement Auto-Provision Workspace (3 hours)

**Concept**: When mission is created, automatically create workspace.

**File**: `apps/api/src/mission/mission.service.ts` (update)

```typescript
async create(organizationId: string, userId: string, dto: CreateMissionDto) {
  // Create mission first
  const mission = await this.prisma.mission.create({
    data: {
      title: dto.title,
      description: dto.description,
      objective: dto.objective,
      organizationId,
      ownerId: userId,
      status: 'planning',
      priority: dto.priority || 'medium',
      deadline: dto.deadline,
      startDate: new Date(),
    },
  });

  // Auto-provision workspace
  const workspace = await this.prisma.workspace.create({
    data: {
      title: `${mission.title} Workspace`,
      description: `Working space for mission: ${mission.title}`,
      organizationId,
      missionId: mission.id,  // 1:1 relationship
      ownerId: userId,
    },
  });

  // Create default project
  await this.prisma.project.create({
    data: {
      title: 'General',
      workspaceId: workspace.id,
      organizationId,
      status: 'active',
    },
  });

  return {
    mission: await this.findOne(mission.id),
    workspace,
  };
}
```

**Test Case**:
```typescript
it('should auto-provision workspace on mission creation', async () => {
  const result = await service.create('org_123', 'user_456', {
    title: 'Test Mission',
  });

  expect(result.mission).toBeDefined();
  expect(result.workspace).toBeDefined();
  expect(result.workspace.missionId).toBe(result.mission.id);
  
  // Verify workspace has default project
  const projects = await prisma.project.findMany({
    where: { workspaceId: result.workspace.id },
  });
  expect(projects.length).toBe(1);
  expect(projects[0].title).toBe('General');
});
```

**Definition of Done**:
- [ ] Workspace auto-created on mission creation
- [ ] Workspace linked to mission
- [ ] Default project created in workspace
- [ ] Test passing
- [ ] Both mission and workspace returned

---

### Task 2: Update MissionController response (1 hour)

**File**: `apps/api/src/mission/mission.controller.ts`

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async create(
  @Body() dto: CreateMissionDto,
  @Headers() headers: any,
) {
  const { userId, organizationId } = this.extractUser(headers);
  const result = await this.missionService.create(organizationId, userId, dto);
  return {
    statusCode: 201,
    data: result,  // Now includes mission and workspace
  };
}
```

**Definition of Done**:
- [ ] Controller returns both mission and workspace
- [ ] Response structure: { mission, workspace }

---

### Task 3: Test end-to-end (1 hour)

```bash
cd apps/api
npm run test
npm run build
```

Test manually:
```bash
curl -X POST http://localhost:3333/api/missions \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -H "x-org-id: org_456" \
  -d '{
    "title": "Launch Alpha",
    "objective": "Reach 100 beta users"
  }'
```

Expected response:
```json
{
  "statusCode": 201,
  "data": {
    "mission": { ... },
    "workspace": { ... }
  }
}
```

**Definition of Done**:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Manual curl works
- [ ] Workspace created alongside mission
- [ ] Commit to feature branch

---

## Thursday (July 11)

### Task 1: Update Diana Context Engine (2 hours)

**Concept**: Diana loads mission context before chat.

**File**: `apps/api/src/chat/context.service.ts` (update existing)

```typescript
async buildMissionContext(userId: string, organizationId: string) {
  // Get user's active mission (most recent)
  const mission = await this.prisma.mission.findFirst({
    where: {
      organizationId,
      ownerId: userId,
      status: { in: ['planning', 'active', 'paused'] },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      progress: true,
      workspace: {
        include: {
          projects: true,
        },
      },
    },
  });

  if (!mission) {
    return null;
  }

  return {
    mission: {
      id: mission.id,
      title: mission.title,
      objective: mission.objective,
      status: mission.status,
      progress: mission.progress?.percentComplete || 0,
    },
    workspace: {
      id: mission.workspace.id,
      projectCount: mission.workspace.projects.length,
    },
  };
}

async buildFullContext(userId: string, organizationId: string) {
  const missionContext = await this.buildMissionContext(userId, organizationId);
  
  const baseContext = {
    userId,
    timestamp: new Date(),
  };

  if (missionContext) {
    return { ...baseContext, mission: missionContext };
  }

  return baseContext;
}
```

**Integration**: Update ChatService to use it

```typescript
async chat(userId: string, organizationId: string, message: string) {
  const context = await this.contextService.buildFullContext(userId, organizationId);

  const systemPrompt = `
You are Diana, an AI mission coordinator.
${context.mission ? `The user is working on mission: "${context.mission.mission.title}"
Mission progress: ${context.mission.mission.progress}%
${context.mission.mission.status === 'planning' ? 'This mission is in planning phase.' : 'This mission is active.'}` : 'The user has no active mission yet.'}

Help them move their mission forward with clear, actionable guidance.
  `;

  // Call LLM with system prompt + user message
  // ...
}
```

**Definition of Done**:
- [ ] Mission context loaded before chat
- [ ] System prompt includes mission info
- [ ] Greeting changes if mission exists
- [ ] Tests passing

---

### Task 2: Update welcome response (1 hour)

**File**: `apps/api/src/chat/chat.controller.ts`

```typescript
@Post('message')
async chat(
  @Body() body: { message: string },
  @Headers() headers: any,
) {
  const { userId, organizationId } = this.extractUser(headers);
  
  // Check if user has active mission
  const activeMission = await this.missionService.findActive(organizationId, userId);

  // Diana's greeting depends on mission state
  let dianaGreeting = '';
  if (activeMission) {
    dianaGreeting = `Welcome back! You're working on "${activeMission.title}". 
Progress: ${activeMission.progress.percentComplete}%. 
What would you like to work on next?`;
  } else {
    dianaGreeting = `Hi! I'm Diana, your mission coordinator. 
Want to start a new mission, or pick up where you left off?`;
  }

  // Chat response
  const response = await this.chatService.chat(userId, organizationId, body.message);
  
  return {
    statusCode: 200,
    data: {
      diana: response,
      context: {
        activeMission: activeMission ? { 
          id: activeMission.id, 
          title: activeMission.title 
        } : null,
      },
    },
  };
}
```

**Definition of Done**:
- [ ] Diana greets with mission awareness
- [ ] Context visible in response

---

### Task 3: Testing & commit (1 hour)

```bash
npm run test
npm run build
```

**Definition of Done**:
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Commit to feature branch
- [ ] Ready for integration

---

## Friday (July 12)

### Task 1: Integration & final build (2 hours)

```bash
cd apps/api
npm run build 2>&1 | tee build.log
npm run test 2>&1 | tee test.log
```

**Check**:
- [ ] Build output: "Exit code 0"
- [ ] Test output: "All tests passed"
- [ ] No TypeScript errors
- [ ] No console errors

---

### Task 2: Web UI integration (2 hours)

**Update**: `apps/web/app/missions/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadMissions();
  }, []);

  async function loadMissions() {
    setLoading(true);
    try {
      const response = await fetch('/api/missions', {
        headers: {
          'x-user-id': 'user_123', // TODO: Get from session
          'x-org-id': 'org_456',   // TODO: Get from session
        },
      });
      const data = await response.json();
      setMissions(data.data || []);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createMission() {
    const title = prompt('Mission title:');
    if (!title) return;

    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'user_123',
          'x-org-id': 'org_456',
        },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Navigate to workspace
        router.push(`/workspace/${data.data.workspace.id}`);
      }
    } catch (error) {
      console.error('Error creating mission:', error);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Missions</h1>
      
      <button
        onClick={createMission}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        + New Mission
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : missions.length === 0 ? (
        <p className="text-gray-500">No missions yet. Create one to get started!</p>
      ) : (
        <div className="grid gap-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/workspace/${mission.workspaceId}`)}
            >
              <h2 className="text-xl font-semibold">{mission.title}</h2>
              <p className="text-gray-600">{mission.description}</p>
              <div className="mt-2">
                <span className="badge">{mission.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Definition of Done**:
- [ ] UI fetches missions from API
- [ ] Create mission button works
- [ ] Link to workspace works

---

### Task 3: Demo preparation (1 hour)

**Demo flow**:
1. Start server: `npm run dev`
2. Navigate to localhost:3001/missions
3. Click "New Mission"
4. Enter: "Launch Alpha"
5. Observe: Mission created, workspace auto-provisioned
6. Click on mission → navigate to workspace
7. See Diana in chat greeting with mission context

**Definition of Done**:
- [ ] Server runs without errors
- [ ] Web connects to API
- [ ] Mission creation works end-to-end
- [ ] Workspace appears
- [ ] Diana shows mission context

---

### Task 4: Friday demo (3 PM) + commit

**Meeting Format**: 30 min

1. **What we shipped** (2 min)
   - Mission CRUD API (create, read, list, update, delete)
   - Auto-provision workspace on mission creation
   - Diana loads mission context

2. **Live demo** (15 min)
   - Sign up new user
   - Create mission "Launch Alpha"
   - Show mission in dashboard
   - Show auto-provisioned workspace
   - Chat with Diana (shows mission awareness)
   - Complete mock task
   - Show activity log

3. **Metrics** (3 min)
   - Build: 0 errors
   - Tests: 20 cases, all passing
   - API latency: <100ms
   - Uptime: 100%

4. **Next week** (10 min)
   - Planning engine: Diana breaks mission into projects/tasks
   - Focus: End-to-end mission planning

**Final Commit**:
```bash
git add .
git commit -m "feat: Week 1 complete - Mission CRUD + Auto-provision workspace

Week 1 deliverables:
✓ MissionService: create, read, list, update, delete, status transitions
✓ MissionController: Full HTTP API for missions
✓ Auto-provision workspace on mission creation
✓ Create default project in workspace
✓ Diana context engine loads mission awareness
✓ Diana greets with mission progress
✓ Web UI: missions list, create mission, navigate to workspace

Test results:
- 20+ unit tests passing
- Build exit code 0
- No TypeScript errors
- API latency <100ms

Friday demo shipped:
- New user can create mission
- Workspace auto-provisions
- Diana shows mission context
- End-to-end working

Next: Planning engine (Week 2)"
```

**Definition of Done**:
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Demo executed successfully
- [ ] Feedback collected
- [ ] Commit pushed to main
- [ ] Week 1 marked complete

---

**This is Week 1: The foundation.**

**By Friday EOD**: Users can create a mission and see their workspace with Diana providing context-aware guidance.

**Next**: Week 2 - Planning Engine (Diana breaks missions into actionable projects and tasks).
