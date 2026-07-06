import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Module, Controller, Get } from '@nestjs/common'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// ESM compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Dynamically require Phase 2 modules using absolute paths
const identityPath = resolve(__dirname, '../../../packages/identity/dist')
const userMgmtPath = resolve(__dirname, '../../../packages/user-management/dist')
const orgMgmtPath = resolve(__dirname, '../../../packages/organization-management/dist')

const identityDist = require(identityPath)
const userMgmtDist = require(userMgmtPath)
const orgMgmtDist = require(orgMgmtPath)

const IdentityModule = identityDist.IdentityModule
const UserManagementModule = userMgmtDist.UserManagementModule
const OrganizationManagementModule = orgMgmtDist.OrganizationManagementModule

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
      modules: ['identity'],
      timestamp: new Date().toISOString(),
    }
  }
}

@Module({
  imports: [
    IdentityModule,
    //UserManagementModule,
    //OrganizationManagementModule,
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
