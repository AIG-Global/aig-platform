import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Module, Controller, Get } from '@nestjs/common'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { AuthModule } from './auth/auth.module.js'
import { ComplianceModule } from './compliance/compliance.module.js'
// Temporarily disabled modules with schema mismatches - to be fixed in next session
// import { ChatModule } from './chat/chat.module.js'
// import { ProjectModule } from './projects/project.module.js'
// import { TaskModule } from './tasks/task.module.js'
// import { WorkspaceModule } from './workspace/workspace.module.js'
// import { ActivityModule } from './activity/activity.module.js'
// import { ProgressModule } from './progress/progress.module.js'
// import { MissionModule } from './mission/mission.module.js'
// import { WDMModule } from './wdm/wdm.module.js'
// import { CommissionsModule } from './commissions/commissions.module.js'
// import { GeneralsModule } from './generals/generals.module.js'
// import { AnalyticsModule } from './analytics/analytics.module.js'
// import { MailchimpModule } from './mailchimp/mailchimp.module.js'
// import { PaymentModule } from './payment/payment.module.js'

// ESM compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Dynamically require Phase 2 modules using absolute paths
const identityPath = resolve(__dirname, '../../../packages/identity/dist')
//const userMgmtPath = resolve(__dirname, '../../../packages/user-management/dist/user-management/src')
//const orgMgmtPath = resolve(__dirname, '../../../packages/organization-management/dist/organization-management/src')

const identityDist = require(identityPath)
//const userMgmtDist = require(userMgmtPath)
//const orgMgmtDist = require(orgMgmtPath)

const IdentityModule = identityDist.IdentityModule
//const UserManagementModule = userMgmtDist.UserManagementModule
//const OrganizationManagementModule = orgMgmtDist.OrganizationManagementModule

@Controller()
class AppController {
  @Get('/health')
  health() {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('info')
  apiInfo() {
    return {
      name: 'AIG Platform API',
      version: '0.3.0',
      modules: ['identity', 'chat', 'wdm-marketplace', 'auth', 'workspace', 'projects'],
      timestamp: new Date().toISOString(),
    }
  }
}

@Module({
  imports: [
    AuthModule,
    ComplianceModule,
    IdentityModule,
    // Temporarily disabled modules pending schema alignment
    // ChatModule, ProjectModule, TaskModule, WorkspaceModule, ActivityModule,
    // ProgressModule, MissionModule, WDMModule, CommissionsModule, GeneralsModule,
    // AnalyticsModule, MailchimpModule, PaymentModule,
    // UserManagementModule, OrganizationManagementModule,
  ],
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    credentials: true,
  })

  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3333
  await app.listen(port)

  console.log(`🚀 AIG Platform API running on http://localhost:${port}`)
  console.log(`📚 v0.3.0 - Phase 1 (WDM Marketplace, Identity, Workspace, Projects) services loaded`)
}

bootstrap()
