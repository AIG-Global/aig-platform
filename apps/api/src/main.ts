import { Controller, Get } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'

@Controller()
class AppController {
  @Get('/health')
  health() {
    return { status: 'ok', service: 'api' }
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3333)
}

bootstrap()
