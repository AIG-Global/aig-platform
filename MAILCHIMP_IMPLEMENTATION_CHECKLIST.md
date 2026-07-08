# Mailchimp Integration Implementation Checklist

## Phase 1: Setup (Day 1)

- [ ] **Get Mailchimp Account**
  - [ ] Sign up at mailchimp.com
  - [ ] Create audience/list named "AIGINVEST Members"
  - [ ] Get API Key from Account > Extras > API Keys
  - [ ] Get List ID from Lists > Settings

- [ ] **Install Dependencies**
  ```bash
  cd apps/api
  npm install axios mailchimp-marketing
  npm install --save-dev @types/node
  ```

- [ ] **Add Environment Variables**
  ```
  MAILCHIMP_API_KEY=your_key
  MAILCHIMP_LIST_ID=your_list_id
  MAILCHIMP_FROM_EMAIL=noreply@aiginvest.com
  MAILCHIMP_FROM_NAME=AIGINVEST
  ```

## Phase 2: Database (Day 1)

- [ ] **Update Prisma Schema**
  - [ ] Add `EmailCampaign` model
  - [ ] Add `EmailLog` model
  - [ ] Add `mailchimpContactId` to User model
  - [ ] Add `emailLogs` relation to User model

- [ ] **Create Migration**
  ```bash
  npx prisma migrate dev --name add_mailchimp_tables
  ```

- [ ] **Verify Migration**
  ```bash
  psql -d aig_platform -c "\dt" | grep email
  ```

## Phase 3: Backend Implementation (Day 2)

- [ ] **Create Mailchimp Service**
  - [ ] `mailchimp.service.ts` - API integration
  - [ ] Test: `subscribeUser()` method
  - [ ] Test: `syncAllUsers()` method

- [ ] **Create Email Template Service**
  - [ ] `email-template.service.ts` - HTML generation
  - [ ] Test: Build personalized digest HTML
  - [ ] Verify: All variables render correctly

- [ ] **Create Weekly Digest Service**
  - [ ] `weekly-digest.service.ts` - Orchestration
  - [ ] Test: `sendWeeklyDigestToAll()` method
  - [ ] Test: `sendCountryOpenedEmail()` method
  - [ ] Test: `getCampaignStats()` method

- [ ] **Create Controller**
  - [ ] `mailchimp.controller.ts` - REST endpoints
  - [ ] All 6 endpoints implemented

- [ ] **Create Module**
  - [ ] `mailchimp.module.ts` - DI configuration

## Phase 4: Integration (Day 2)

- [ ] **Update App Module**
  ```typescript
  imports: [
    // ...
    MailchimpModule,
  ]
  ```

- [ ] **Update Auth Service**
  - [ ] Auto-subscribe on user registration
  - [ ] Handle subscribe errors gracefully

- [ ] **Update User Service**
  - [ ] Subscribe user on creation
  - [ ] Handle profile updates → tag updates

## Phase 5: Cron Jobs (Day 3)

- [ ] **Install Cron Package**
  ```bash
  npm install @nestjs/schedule
  npm install @nestjs/terminu
  ```

- [ ] **Create Cron Service**
  - [ ] Schedule: Weekly digest (Monday 9 AM)
  - [ ] Add logging
  - [ ] Add error handling

- [ ] **Register Cron Module**
  ```typescript
  @Module({
    imports: [ScheduleModule.forRoot()],
  })
  ```

## Phase 6: Testing (Day 3)

- [ ] **Unit Tests**
  - [ ] Test Mailchimp service methods
  - [ ] Test email template generation
  - [ ] Test country detection logic

- [ ] **Integration Tests**
  - [ ] Test full signup → subscribe flow
  - [ ] Test weekly digest generation
  - [ ] Test error handling

- [ ] **Manual Testing**
  - [ ] Subscribe test user manually
  - [ ] Verify in Mailchimp dashboard
  - [ ] Send test campaign
  - [ ] Check email received

- [ ] **Load Testing**
  - [ ] Test batch subscribe (100+ users)
  - [ ] Test email generation (1000+ users)
  - [ ] Monitor performance

## Phase 7: Monitoring (Day 4)

- [ ] **Setup Logging**
  - [ ] Log all subscription events
  - [ ] Log all email sends
  - [ ] Log all errors

- [ ] **Create Dashboards**
  - [ ] Campaign stats endpoint working
  - [ ] Query email logs by type/status
  - [ ] Track open/click rates

- [ ] **Alerts**
  - [ ] Alert on send failures > 5%
  - [ ] Alert on API errors
  - [ ] Slack notifications

## Phase 8: Documentation (Day 4)

- [ ] **API Documentation**
  - [ ] Document all endpoints
  - [ ] Document request/response formats
  - [ ] Document error codes

- [ ] **Runbook**
  - [ ] How to manually send digest
  - [ ] How to subscribe user
  - [ ] How to troubleshoot

- [ ] **Disaster Recovery**
  - [ ] Backup subscribers list
  - [ ] Recovery procedures

## Implementation Order

### Priority 1 (Must Have)
1. Mailchimp service + API integration
2. Email template generation
3. Weekly digest orchestration
4. Auto-subscribe on signup
5. Basic monitoring

### Priority 2 (Should Have)
1. Gamification (country opened emails)
2. Cron job scheduling
3. Dashboard stats
4. Segmentation tags

### Priority 3 (Nice to Have)
1. Webhook handling (opens/clicks)
2. A/B testing
3. Advanced segmentation
4. Predictive sends

## Testing Checklist

### Unit Tests
```bash
npm test -- mailchimp.service.spec.ts
npm test -- email-template.service.spec.ts
npm test -- weekly-digest.service.spec.ts
```

### Integration Tests
```bash
# Test API endpoints
curl -X POST http://localhost:3333/api/mailchimp/subscribe/user123
curl -X GET http://localhost:3333/api/mailchimp/stats
curl -X POST http://localhost:3333/api/mailchimp/weekly-digest
```

### Email Verification
```bash
# Check test email received
# Verify HTML rendering
# Verify all variables populated
# Check mobile rendering
```

## Post-Launch

- [ ] **Monitor Email Delivery**
  - [ ] Check bounce rate
  - [ ] Check unsubscribe rate
  - [ ] Monitor complaint rate

- [ ] **Analyze Campaign Performance**
  - [ ] Open rates (target: 25-35%)
  - [ ] Click-through rates (target: 5-10%)
  - [ ] Conversion rates

- [ ] **Optimize**
  - [ ] A/B test subject lines
  - [ ] Optimize send times
  - [ ] Refine segmentation
  - [ ] Improve templates

## Rollback Plan

If issues arise:
1. Disable auto-subscribe (comment out in auth service)
2. Stop cron jobs (remove @Cron decorators)
3. Revert database migration (`npx prisma migrate resolve --rolled-back`)
4. Redeploy without Mailchimp module

## Success Criteria

- ✅ 100% of new users auto-subscribed
- ✅ Weekly digest sent to 95%+ of members
- ✅ <2% failure rate on sends
- ✅ <0.5% unsubscribe rate per campaign
- ✅ Campaign stats accurate and available
- ✅ Country opened emails trigger correctly
- ✅ Vault warning emails send when needed
- ✅ <1s response time for API endpoints

## Support Contacts

- **Mailchimp Support**: support@mailchimp.com
- **API Issues**: Stack Overflow [mailchimp-api] tag
- **Documentation**: developers.mailchimp.com
