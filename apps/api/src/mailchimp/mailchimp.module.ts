import { Module } from '@nestjs/common'
import { MailchimpService } from './mailchimp.service'
import { EmailTemplateService } from './email-template.service'
import { WeeklyDigestService } from './weekly-digest.service'
import { MailchimpController } from './mailchimp.controller'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [],
  controllers: [MailchimpController],
  providers: [
    MailchimpService,
    EmailTemplateService,
    WeeklyDigestService,
    PrismaService,
  ],
  exports: [MailchimpService, WeeklyDigestService],
})
export class MailchimpModule {}
