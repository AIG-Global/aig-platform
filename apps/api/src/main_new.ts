import 'reflect-metadata'
import { Controller, Get } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'

// Phase 2 services
import { IdentityModule } from '@aig/identity'
import { UserManagementModule } from '@aig/user-management'
import { OrganizationManagementModule } from '@aig/organization-management'

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

  @Get('/api/info')
  apiInfo() {
    return {
      name: 'AIG Platform API',
      version: '0.2.0',
      modules: ['identity', 'user-management', 'organization-management'],
      timestamp: new Date().toISOString(),
    }
  }
}

@Module({
  imports: [
    IdentityModule,
    UserManagementModule,
    OrganizationManagementModule,
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
  console.log(`📚 v0.2.0 - Phase 2 (Identity, User, Organization) services loaded`)
}

bootstrap()
