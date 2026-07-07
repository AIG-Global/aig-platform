# WDM MARKETPLACE IMPLEMENTATION GUIDE
## World Domination Market - Phase 1 Build

**Status:** Ready to implement (Week 3-4)
**Locked Specification:** [COMPLETE_ECOSYSTEM_REFERENCE.md - Part 8](../../architecture/COMPLETE_ECOSYSTEM_REFERENCE.md)

---

## EXECUTIVE SUMMARY

WDM is a peer-to-peer marketplace enabling AIGINVEST members to buy, sell, and earn through 18 product categories with a tiered seller program, affiliate commissions (5%), and community-driven commerce.

**Key Metrics:**
- Target: €1B+ GMV by 2030
- 18 product categories
- 5 seller tiers (New → Enterprise)
- 5% affiliate commission on all sales
- €5-10B valuation potential (2030)

---

## PART 1: MARKETPLACE ARCHITECTURE

### 1.1 18 Product Categories

```
Physical Goods:
├─ Electronics (phones, laptops, accessories)
├─ Home & Garden (furniture, tools, decor)
├─ Fashion & Accessories (clothing, shoes, bags)
├─ Books & Media (ebooks, audiobooks, physical books)
└─ Sports & Outdoors (equipment, gear, apparel)

Digital Products:
├─ Software & Apps (tools, utilities, plugins)
├─ Courses & Learning (online courses, tutorials, certifications)
├─ Templates & Assets (design templates, code, stock media)
├─ eBooks & Content (guides, reports, newsletters)
└─ Design & Development Services (UI/UX, web dev, consulting)

Services:
├─ Consulting & Coaching (business, life, tech coaching)
├─ Design Services (graphic design, branding, logo)
├─ Development Services (web dev, mobile app, API development)
├─ Marketing Services (social media, content, ads)
└─ Personal Services (tutoring, fitness, photography)

Investments & Crypto:
├─ Crypto Trading Pairs (direct P2P crypto exchange)
├─ Investment Bundles (curated investment portfolios)
└─ Token Trading (AIGIO tokens, partnership tokens)

Experiences & Events:
├─ Events & Workshops (virtual & in-person events)
├─ Travel & Experiences (trips, accommodations, activities)
└─ Memberships & Subscriptions (community access, premium content)
```

### 1.2 Seller Tiers (5 Levels)

```
Tier 1: New Seller
├─ Requirements: Email verified, basic profile
├─ Capacity: 0-10 products
├─ Commission: 5% platform fee
├─ Rating: No requirements
├─ Badge: "New" (green badge)

Tier 2: Active Seller
├─ Requirements: 11+ products, 4.0+ rating, 50+ sales
├─ Capacity: 11-100 products
├─ Commission: 4% platform fee
├─ Rating: Maintain 4.0+
├─ Badge: "Active" (blue badge)
├─ Perks: Featured in category, priority support

Tier 3: Pro Seller
├─ Requirements: 101+ products, 4.5+ rating, 500+ sales
├─ Capacity: 101-500 products
├─ Commission: 3% platform fee
├─ Rating: Maintain 4.5+
├─ Badge: "Pro" (gold badge)
├─ Perks: Top placement, custom storefront, analytics

Tier 4: Platinum Seller
├─ Requirements: 500+ products, 4.7+ rating, 2000+ sales
├─ Capacity: 500+ products
├─ Commission: 2% platform fee
├─ Rating: Maintain 4.7+
├─ Badge: "Platinum" (platinum badge)
├─ Perks: API access, white-label options, dedicated account manager

Tier 5: Enterprise Seller
├─ Requirements: Custom (negotiated with AIGINVEST)
├─ Capacity: Unlimited
├─ Commission: 1-2% (custom)
├─ Rating: 4.8+
├─ Badge: "Enterprise" (custom badge)
├─ Perks: Full integration, custom terms, priority support 24/7
```

### 1.3 Key Features

**For Buyers:**
- Browse 18 categories
- Advanced search & filtering
- Wishlist functionality
- Reviews & ratings (with photos)
- Buyer protection (2-week return window)
- Direct messaging with sellers
- Order tracking
- Digital delivery (for digital products)
- Escrow payment protection

**For Sellers:**
- Customizable storefront
- Bulk product upload (CSV)
- Inventory management
- Pricing automation
- Coupon creation
- Shipping label generation
- Affiliate program management
- Analytics dashboard
- Customer messaging
- Automated invoicing

---

## PART 2: DATABASE SCHEMA

### New Prisma Models

```prisma
// ============================================================================
// WDM MARKETPLACE MODELS
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
  originalPrice_eur Decimal? @db.Decimal(10, 2) // for discounts
  currency        String    @default("EUR")
  
  // Inventory
  quantity        Int       @default(0)
  lowStockAlert   Int       @default(5)
  digitalDelivery Boolean   @default(false)
  deliveryUrl     String?   // for digital products
  
  // Status & visibility
  status          String    @default("active") // active, draft, archived, suspended
  featured        Boolean   @default(false)
  rating          Decimal   @db.Decimal(3, 2) @default(0)
  reviewCount     Int       @default(0)
  
  // Media
  images          String[]  // array of image URLs
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
  status          String    @default("pending") // pending, paid, processing, shipped, delivered, cancelled, refunded
  paymentStatus   String    @default("unpaid") // unpaid, paid, failed, refunded
  
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
  type            String    // buyer_payment, seller_payout, affiliate_payout, refund
  status          String    @default("pending") // pending, completed, failed
  
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
  rating          Int       // 1-5
  title           String
  comment         String    @db.Text
  images          String[]
  
  // Moderation
  verified        Boolean   @default(true) // verified purchase
  helpful_count   Int       @default(0)
  unhelpful_count Int       @default(0)
  status          String    @default("published") // published, pending, rejected
  
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
  tier            String    @default("new_seller") // new_seller, active, pro, platinum, enterprise
  rating          Decimal   @db.Decimal(3, 2) @default(0)
  reviewCount     Int       @default(0)
  salesCount      Int       @default(0)
  
  // Contact
  email           String
  phone           String?
  address         String?   @db.Text
  
  // Financials
  payoutMethod    String? // bank_transfer, paypal, crypto_wallet
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
  initiatedBy     String    // buyer_id or seller_id
  
  // Dispute details
  reason          String    // item_not_received, item_not_as_described, quality_issue, other
  description     String    @db.Text
  
  // Resolution
  status          String    @default("open") // open, in_progress, resolved, closed
  resolution      String?
  
  // Evidence
  attachments     String[]
  
  createdAt       DateTime  @default(now())
  resolvedAt      DateTime?
  
  @@index([orderId])
  @@map("wdm_disputes")
}

// Update Member model to include seller info
model Member {
  // ... existing fields ...
  
  // WDM relations
  wdmProducts     WDMProduct[]
  wdmOrders       WDMOrder[] @relation("WDMBuyer")
  wdmReviews      WDMReview[]
  wdmSellerProfile WDMSellerProfile?
}
```

---

## PART 3: API ENDPOINTS (20+ endpoints)

### 3.1 Category Endpoints

```
GET     /wdm/categories                    - List all 18 categories
GET     /wdm/categories/{slug}             - Get category details
GET     /wdm/categories/{slug}/products    - List products in category
```

### 3.2 Product Endpoints (Buyer)

```
GET     /wdm/products                      - Browse all products (with filters)
GET     /wdm/products/{id}                 - Get product details
POST    /wdm/products/{id}/add-to-wishlist - Add to wishlist
DELETE  /wdm/products/{id}/remove-from-wishlist
GET     /wdm/products/{id}/reviews         - Get product reviews
POST    /wdm/products/{id}/reviews         - Leave review (after purchase)
GET     /wdm/products/search               - Advanced search
```

### 3.3 Product Endpoints (Seller)

```
POST    /wdm/products/create               - Create new product
PUT     /wdm/products/{id}/update          - Update product
DELETE  /wdm/products/{id}/delete          - Delete product
POST    /wdm/products/{id}/publish         - Publish product
POST    /wdm/products/bulk-upload          - Upload products via CSV
GET     /wdm/sellers/products              - Get seller's products
```

### 3.4 Order Endpoints (Buyer)

```
POST    /wdm/orders/create                 - Create order from cart
GET     /wdm/orders                        - Get buyer's orders
GET     /wdm/orders/{id}                   - Get order details
PUT     /wdm/orders/{id}/confirm-delivery  - Confirm order received
GET     /wdm/orders/{id}/invoice           - Download invoice
POST    /wdm/orders/{id}/refund            - Request refund
```

### 3.5 Order Endpoints (Seller)

```
GET     /wdm/sellers/orders                - Get seller's orders
PUT     /wdm/sellers/orders/{id}/mark-shipped - Update order status
POST    /wdm/sellers/orders/{id}/shipping-label - Generate shipping label
GET     /wdm/sellers/orders/{id}/payout    - Get payout details
```

### 3.6 Seller Profile & Tier

```
GET     /wdm/sellers/{id}                  - Get seller profile
POST    /wdm/sellers/profile/create        - Create seller profile
PUT     /wdm/sellers/profile/update        - Update seller profile
GET     /wdm/sellers/profile/stats         - Get seller stats (sales, rating, revenue)
POST    /wdm/sellers/profile/verify        - Request verification
GET     /wdm/sellers/profile/tier          - Get current tier & progress
```

### 3.7 Affiliate Program

```
POST    /wdm/affiliates/link-create        - Create affiliate link
GET     /wdm/affiliates/links              - Get affiliate links
GET     /wdm/affiliates/earnings           - Get affiliate earnings
POST    /wdm/affiliates/payout-request     - Request payout
GET     /wdm/affiliates/stats              - Get performance stats
```

### 3.8 Disputes & Support

```
POST    /wdm/disputes/create               - File dispute
GET     /wdm/disputes/{id}                 - Get dispute details
PUT     /wdm/disputes/{id}/message         - Add message to dispute
PUT     /wdm/disputes/{id}/resolve         - Resolve dispute (admin)
```

---

## PART 4: COMMISSION & PAYOUT LOGIC

### 4.1 Commission Breakdown (Per Order Item)

```
Example: €100 product sold, New Seller tier

Gross: €100.00
├─ Seller Amount: €95.00 (5% platform fee deducted)
├─ Platform Fee: €5.00
└─ Affiliate Commission (if applicable): €5.00 (5% of seller amount)

Seller Payout: €90.00 (€95 - €5 affiliate if applicable)
AIGINVEST Platform: €5.00
Affiliate: €5.00 (if affiliate code used)
```

### 4.2 Tier-Based Commission Rates

```
New Seller:     5% platform fee → Seller gets 95%
Active Seller:  4% platform fee → Seller gets 96%
Pro Seller:     3% platform fee → Seller gets 97%
Platinum:       2% platform fee → Seller gets 98%
Enterprise:     1-2% (custom)   → Seller gets 98-99%

Affiliate Commission: 5% of seller amount (all tiers)
```

### 4.3 Payout Schedule

```
Pending: Order received, no payment yet
Processing: Payment received, awaiting settlement (24-48 hours)
Completed: Funds transferred to seller's account
Refunded: Refund processed (7-10 business days)

Seller payout frequency: Weekly (Mondays)
Minimum payout: €25
Maximum hold period: 30 days after delivery
```

---

## PART 5: SEARCH & FILTERING

### 5.1 Search Filters

```
Category filter     - 18 categories
Price range        - Min/Max EUR
Seller tier        - New/Active/Pro/Platinum/Enterprise
Rating             - 1-5 stars minimum
Shipping time      - 1-3 days, 4-7 days, 2+ weeks
Delivery type      - Digital only, Physical only, All
New/Featured       - Recently added, Featured products
```

### 5.2 Search Algorithm

```
1. Full-text search on: title, description, tags
2. Apply filters (category, price, rating, etc.)
3. Sort by: relevance, newest, price (low-high/high-low), rating, sales
4. Pagination: 20 items per page
5. Suggest related products
```

---

## PART 6: SELLER VERIFICATION & TRUST

### 6.1 Verification Steps

```
Step 1: Email verification
Step 2: Phone verification
Step 3: Address verification
Step 4: Bank account verification (for payouts)
Step 5: Identity verification (ID/Passport scan)

Badge awarded: "Verified" badge on seller profile
```

### 6.2 Rating & Review System

```
Buyer can rate 1-5 stars after:
- 7 days passed since delivery, or
- Buyer confirms delivery early

Review includes:
- Star rating
- Written review
- Photos (up to 3)
- Verified purchase badge

Fake review detection: Flag suspicious patterns
```

### 6.3 Seller Trust Score

```
Factors:
├─ Average rating (40% weight)
├─ Sales count (25% weight)
├─ Response time (15% weight)
├─ Dispute rate (15% weight)
└─ Account age (5% weight)

Score: 0-100, displayed publicly
Automatic tier demotion if score drops below tier threshold
```

---

## PART 7: PAYMENT & SECURITY

### 7.1 Payment Processing

```
Buyer Payment Flow:
1. Add products to cart
2. Review order
3. Pay (AIGINVEST wallet EUR or credit card)
4. Order confirmed, seller notified
5. Seller ships/delivers
6. Buyer confirms receipt
7. Money released to seller (after 7-day hold)

Digital Products:
1. Payment completes
2. Download link sent immediately
3. No 7-day hold
```

### 7.2 Escrow Protection

```
Buyer pays into escrow
├─ If delivered on time: Money released to seller after 7 days
├─ If dispute filed: Held pending resolution
└─ If refund requested: Money returned to buyer

Reduces fraud risk for both parties
```

### 7.3 Anti-Fraud Measures

```
- Email verification required
- Phone verification for first purchase
- Velocity checks (limit transactions/day)
- Manual review for high-value orders (>€5,000)
- Chargeback protection
- Seller identity verification
```

---

## PART 8: IMPLEMENTATION TIMELINE

**Week 3 (Sprint 1):**
- [ ] Create 10 Prisma models (categories, products, orders, etc.)
- [ ] Set up WDM NestJS module structure
- [ ] Implement product CRUD endpoints (create, read, update, delete)
- [ ] Implement category browsing endpoints
- [ ] Build product search with basic filters

**Week 4 (Sprint 2):**
- [ ] Implement order creation & management
- [ ] Build payout logic (commission calculations)
- [ ] Implement seller tier system
- [ ] Create affiliate link management
- [ ] Build review/rating system
- [ ] Add dispute resolution system

**Week 4+ (Sprint 3):**
- [ ] Search optimization
- [ ] Admin dashboard (monitor sales, disputes, fraud)
- [ ] Analytics & reporting
- [ ] Mobile-friendly product browsing
- [ ] Integration with existing wallet system

---

## PART 9: SUCCESS METRICS

**By Week 4 End (MVP Launch):**
- ✅ 18 categories available
- ✅ 50+ test products seeded
- ✅ Basic buy/sell flow working
- ✅ Commission calculations accurate
- ✅ 20+ API endpoints functional
- ✅ Seller verification flow complete
- ✅ Review system working

**By Month 2:**
- ✅ 1,000 products listed
- ✅ 100+ sellers onboarded
- ✅ €50K+ GMV
- ✅ 1,000+ reviews

**By 2030 Target:**
- ✅ €1B+ GMV
- ✅ 10,000+ sellers
- ✅ 100,000+ products
- ✅ 1M+ transactions/month

---

## PART 10: TECHNICAL CONSIDERATIONS

**Performance:**
- Product search must return <200ms (Redis cache)
- Category browsing must paginate (20 items/page)
- Order creation must be atomic (no partial orders)

**Database:**
- Indexes on: sellerId, categoryId, status, createdAt
- Archival strategy for old orders (move to cold storage after 2 years)

**Security:**
- All payments must be logged for audit
- Seller identity verification mandatory
- Buyer PII encrypted at rest

**Scalability:**
- Horizontal scaling of API servers
- Database read replicas for search queries
- Elasticsearch for full-text search (future)

---

**WDM Ready for Phase 1 Week 3-4 Implementation**
**Last Updated:** 2026-07-07
