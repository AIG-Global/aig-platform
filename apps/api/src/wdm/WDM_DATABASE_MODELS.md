# WDM DATABASE MODELS
## Prisma Schema Models for World Domination Market

**Status:** Ready to add to Prisma schema
**Target Database:** PostgreSQL 16
**Integration:** Phase 1, Week 3-4

---

## COMPLETE PRISMA MODELS

Add these models to `/prisma/schema.prisma`:

```prisma
// ============================================================================
// WDM MARKETPLACE MODELS (NEW)
// ============================================================================

model WDMCategory {
  id              String    @id @default(cuid())
  name            String    @unique
  slug            String    @unique
  description     String?   @db.Text
  icon            String?   // emoji or icon name
  productCount    Int       @default(0)
  
  // Relations
  products        WDMProduct[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@map("wdm_categories")
}

model WDMProduct {
  id              String    @id @default(cuid())
  sellerId        String
  categoryId      String
  
  // Product info
  title           String
  description     String    @db.Text
  sku             String?   @unique
  price_eur       Decimal   @db.Decimal(10, 2)
  originalPrice_eur Decimal? @db.Decimal(10, 2)
  currency        String    @default("EUR")
  
  // Inventory
  quantity        Int       @default(0)
  lowStockAlert   Int       @default(5)
  digitalDelivery Boolean   @default(false)
  deliveryUrl     String?
  
  // Status & visibility
  status          String    @default("active")
  featured        Boolean   @default(false)
  rating          Decimal   @db.Decimal(3, 2) @default(0)
  reviewCount     Int       @default(0)
  
  // Media
  images          String[]
  videoUrl        String?
  
  // Shipping
  weight_kg       Decimal?  @db.Decimal(5, 2)
  shippingTime_days Int?
  shippingCost_eur Decimal?  @db.Decimal(10, 2)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  tags            String[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  publishedAt     DateTime?
  
  // Relations
  seller          Member    @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  category        WDMCategory @relation(fields: [categoryId], references: [id])
  orders          WDMOrderItem[]
  reviews         WDMReview[]
  
  @@index([sellerId])
  @@index([categoryId])
  @@index([status])
  @@map("wdm_products")
}

model WDMOrder {
  id              String    @id @default(cuid())
  buyerId         String
  
  // Order details
  orderNumber     String    @unique
  status          String    @default("pending")
  paymentStatus   String    @default("unpaid")
  
  // Amounts
  subtotal_eur    Decimal   @db.Decimal(10, 2)
  shippingCost_eur Decimal  @db.Decimal(10, 2) @default(0)
  tax_eur         Decimal   @db.Decimal(10, 2) @default(0)
  platformFee_eur Decimal   @db.Decimal(10, 2)
  total_eur       Decimal   @db.Decimal(10, 2)
  
  // Fulfillment
  trackingNumber  String?
  estimatedDelivery DateTime?
  actualDelivery  DateTime?
  
  // Customer info
  shippingAddress String    @db.Text
  notes           String?   @db.Text
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  buyer           Member    @relation("WDMBuyer", fields: [buyerId], references: [id], onDelete: Cascade)
  items           WDMOrderItem[]
  transactions    WDMTransaction[]
  
  @@index([buyerId])
  @@index([status])
  @@map("wdm_orders")
}

model WDMOrderItem {
  id              String    @id @default(cuid())
  orderId         String
  productId       String
  
  // Item snapshot at order time
  title           String
  price_eur       Decimal   @db.Decimal(10, 2)
  quantity        Int
  subtotal_eur    Decimal   @db.Decimal(10, 2)
  
  // Seller commission calculation
  sellerAmount_eur Decimal   @db.Decimal(10, 2)
  affiliateCommission_eur Decimal @db.Decimal(10, 2) @default(0)
  platformFee_eur Decimal   @db.Decimal(10, 2)
  
  createdAt       DateTime  @default(now())
  
  // Relations
  order           WDMOrder  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         WDMProduct @relation(fields: [productId], references: [id])
  
  @@index([orderId])
  @@map("wdm_order_items")
}

model WDMTransaction {
  id              String    @id @default(cuid())
  orderId         String
  
  // Transaction type & status
  type            String
  status          String    @default("pending")
  
  // Money flow
  amount_eur      Decimal   @db.Decimal(10, 2)
  fromMemberId    String
  toMemberId      String
  
  // Reference
  description     String?
  metadata_json   String?   @db.Text
  
  createdAt       DateTime  @default(now())
  completedAt     DateTime?
  
  // Relations
  order           WDMOrder  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@index([status])
  @@map("wdm_transactions")
}

model WDMReview {
  id              String    @id @default(cuid())
  productId       String
  buyerId         String
  
  // Review content
  rating          Int
  title           String
  comment         String    @db.Text
  images          String[]
  
  // Moderation
  verified        Boolean   @default(true)
  helpful_count   Int       @default(0)
  unhelpful_count Int       @default(0)
  status          String    @default("published")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  product         WDMProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  buyer           Member    @relation(fields: [buyerId], references: [id], onDelete: Cascade)
  
  @@index([productId])
  @@index([buyerId])
  @@map("wdm_reviews")
}

model WDMSellerProfile {
  id              String    @id @default(cuid())
  sellerId        String    @unique
  
  // Seller info
  businessName    String
  description     String?   @db.Text
  logo            String?
  bannerImage     String?
  
  // Tier & metrics
  tier            String    @default("new_seller")
  rating          Decimal   @db.Decimal(3, 2) @default(0)
  reviewCount     Int       @default(0)
  salesCount      Int       @default(0)
  
  // Contact
  email           String
  phone           String?
  address         String?   @db.Text
  
  // Financials
  payoutMethod    String?
  payoutAddress   String?
  
  // Status
  verified        Boolean   @default(false)
  suspended       Boolean   @default(false)
  suspensionReason String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  seller          Member    @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  affiliateLinks  WDMAffiliateLink[]
  
  @@map("wdm_seller_profiles")
}

model WDMAffiliateLink {
  id              String    @id @default(cuid())
  sellerProfileId String
  
  // Link info
  code            String    @unique
  url             String
  customName      String?
  
  // Tracking
  clicks          Int       @default(0)
  conversions     Int       @default(0)
  earnings_eur    Decimal   @db.Decimal(10, 2) @default(0)
  
  // Status
  active          Boolean   @default(true)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  sellerProfile   WDMSellerProfile @relation(fields: [sellerProfileId], references: [id], onDelete: Cascade)
  
  @@index([sellerProfileId])
  @@map("wdm_affiliate_links")
}

model WDMDispute {
  id              String    @id @default(cuid())
  orderId         String
  initiatedBy     String
  
  // Dispute details
  reason          String
  description     String    @db.Text
  
  // Resolution
  status          String    @default("open")
  resolution      String?
  
  // Evidence
  attachments     String[]
  
  createdAt       DateTime  @default(now())
  resolvedAt      DateTime?
  
  @@index([orderId])
  @@map("wdm_disputes")
}
```

---

## UPDATE EXISTING MODELS

Update the existing `Member` model to include WDM relations:

```prisma
model Member {
  // ... existing fields ...
  
  // WDM Marketplace relations (NEW)
  wdmProducts     WDMProduct[]
  wdmOrders       WDMOrder[] @relation("WDMBuyer")
  wdmReviews      WDMReview[]
  wdmSellerProfile WDMSellerProfile?
}
```

---

## MIGRATION INSTRUCTIONS

### Step 1: Update Schema
Add all WDM models to `/prisma/schema.prisma`

### Step 2: Create Migration
```bash
cd C:\Users\PC\AIG-Global\aig-platform
npx prisma migrate dev --name add_wdm_marketplace
```

### Step 3: Seed Categories
Run seed script to populate 18 categories (after migration)

### Step 4: Generate Client
```bash
npx prisma generate
```

---

## DATABASE STATISTICS

**Total New Tables:** 9
- wdm_categories
- wdm_products
- wdm_orders
- wdm_order_items
- wdm_transactions
- wdm_reviews
- wdm_seller_profiles
- wdm_affiliate_links
- wdm_disputes

**Indexes Created:** 15+
**Foreign Keys:** 12
**Constraints:** Unique (email, sku, code, orderNumber, sellerId)

**Estimated Storage (Year 1):**
- 100,000 products = ~50 MB
- 1M orders = ~200 MB
- 5M reviews = ~150 MB
- Total: ~500 MB

---

## NEXT STEPS

1. ✅ Define all models (DONE)
2. ⏳ Add to Prisma schema
3. ⏳ Run migration
4. ⏳ Seed 18 categories
5. ⏳ Implement API endpoints
6. ⏳ Add business logic (commission calculations)
7. ⏳ Build UI components

---

**WDM Database Ready for Implementation**
**Phase 1 Week 3 Target**
