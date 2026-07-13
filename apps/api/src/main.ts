import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Module, Controller, Get } from '@nestjs/common'
import { IdentityModule } from '@aig/identity'
import { UserManagementModule } from '@aig/user-management'
import { OrganizationManagementModule } from '@aig/organization-management'
import { AuthModule } from './auth/auth.module.js'
import { ComplianceModule } from './compliance/compliance.module.js'
import { LocalizationModule } from './localization/localization.module.js'
import { BackofficeModule } from './backoffice/backoffice.module.js'
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
    LocalizationModule,
    BackofficeModule,
    IdentityModule,
    UserManagementModule,
    OrganizationManagementModule,
    // Temporarily disabled modules pending schema alignment
    // ChatModule, ProjectModule, TaskModule, WorkspaceModule, ActivityModule,
    // ProgressModule, MissionModule, WDMModule, CommissionsModule, GeneralsModule,
    // AnalyticsModule, MailchimpModule, PaymentModule,
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
