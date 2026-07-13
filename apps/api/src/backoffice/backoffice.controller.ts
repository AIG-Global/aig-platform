import { Body, Controller, Get, Post } from '@nestjs/common'
import { BackofficeService } from './backoffice.service.js'

@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Get('overview')
  getOverview() {
    return this.backofficeService.getOverview()
  }

  @Post('offers/select')
  selectOffer(@Body() body: { name: string }) {
    return this.backofficeService.selectOffer(body?.name || '')
  }

  @Post('banners/publish')
  publishBanner(@Body() body: { text: string; target: string }) {
    return this.backofficeService.publishBanner(body?.text || '', body?.target || 'All users')
  }
}
