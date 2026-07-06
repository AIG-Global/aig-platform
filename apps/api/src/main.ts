import { Controller, Get } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { AskDianaModule } from './modules/ask-diana/ask-diana.module'

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
      version: '0.1.0',
      modules: ['ask-diana'],
      timestamp: new Date().toISOString(),
    }
  }
}

@Module({
  imports: [AskDianaModule],
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  })

  // Global prefix
  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3333
  await app.listen(port)

  console.log(`🚀 AIG Platform API running on http://localhost:${port}`)
  console.log(`📚 Ask Diana module loaded`)
}

bootstrap()
