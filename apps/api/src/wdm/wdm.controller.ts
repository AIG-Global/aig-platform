import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { WDMService } from './wdm.service.js'
import { WDMProductService } from './services/wdm-product.service.js'
import { WDMOrderService } from './services/wdm-order.service.js'
import { WDMSellerService } from './services/wdm-seller.service.js'
import { WDMAffiliateService } from './services/wdm-affiliate.service.js'

@Controller('wdm')
export class WDMController {
  constructor(
    private wdmService: WDMService,
    private productService: WDMProductService,
    private orderService: WDMOrderService,
    private sellerService: WDMSellerService,
    private affiliateService: WDMAffiliateService,
  ) {}

  // ============================================================================
  // CATEGORY ENDPOINTS
  // ============================================================================

  /**
   * List all 18 categories
   * GET /wdm/categories
   */
  @Get('categories')
  async listCategories() {
    return this.wdmService.getAllCategories()
  }

  /**
   * Get category details
   * GET /wdm/categories/:slug
   */
  @Get('categories/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.wdmService.getCategoryBySlug(slug)
  }

  /**
   * List products in category
   * GET /wdm/categories/:slug/products
   */
  @Get('categories/:slug/products')
  async getProductsByCategory(
    @Param('slug') slug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.productService.getByCategory(slug, parseInt(page), parseInt(limit))
  }

  // ============================================================================
  // PRODUCT ENDPOINTS (BUYER)
  // ============================================================================

  /**
   * Browse all products with filters
   * GET /wdm/products
   */
  @Get('products')
  async listProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('tier') tier?: string,
    @Query('sort') sort: string = 'newest',
  ) {
    return this.productService.searchProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      rating: rating ? parseInt(rating) : undefined,
      tier,
      sort,
    })
  }

  /**
   * Get product details
   * GET /wdm/products/:id
   */
  @Get('products/:id')
  async getProduct(@Param('id') productId: string) {
    return this.productService.getById(productId)
  }

  /**
   * Get product reviews
   * GET /wdm/products/:id/reviews
   */
  @Get('products/:id/reviews')
  async getProductReviews(
    @Param('id') productId: string,
    @Query('page') page: string = '1',
  ) {
    return this.productService.getReviews(productId, parseInt(page))
  }

  /**
   * Leave review (requires purchase)
   * POST /wdm/products/:id/reviews
   */
  @Post('products/:id/reviews')
  async createReview(
    @Param('id') productId: string,
    @Body() reviewData: any,
  ) {
    return this.productService.createReview(productId, reviewData)
  }

  // ============================================================================
  // PRODUCT ENDPOINTS (SELLER)
  // ============================================================================

  /**
   * Create new product
   * POST /wdm/products
   */
  @Post('products')
  async createProduct(@Body() productData: any) {
    return this.productService.create(productData)
  }

  /**
   * Update product
   * PUT /wdm/products/:id
   */
  @Put('products/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateData: any,
  ) {
    return this.productService.update(productId, updateData)
  }

  /**
   * Delete product
   * DELETE /wdm/products/:id
   */
  @Delete('products/:id')
  async deleteProduct(@Param('id') productId: string) {
    return this.productService.delete(productId)
  }

  /**
   * Get seller's products
   * GET /wdm/sellers/products
   */
  @Get('sellers/products')
  async getSellerProducts(@Query('sellerId') sellerId: string) {
    return this.productService.getBySellerOld(sellerId)
  }

  // ============================================================================
  // ORDER ENDPOINTS (BUYER)
  // ============================================================================

  /**
   * Create order
   * POST /wdm/orders
   */
  @Post('orders')
  async createOrder(@Body() orderData: any) {
    return this.orderService.create(orderData)
  }

  /**
   * Get buyer's orders
   * GET /wdm/orders
   */
  @Get('orders')
  async getBuyerOrders(@Query('buyerId') buyerId: string) {
    return this.orderService.getByBuyer(buyerId)
  }

  /**
   * Get order details
   * GET /wdm/orders/:id
   */
  @Get('orders/:id')
  async getOrder(@Param('id') orderId: string) {
    return this.orderService.getById(orderId)
  }

  /**
   * Confirm delivery
   * PUT /wdm/orders/:id/confirm-delivery
   */
  @Put('orders/:id/confirm-delivery')
  async confirmDelivery(@Param('id') orderId: string) {
    return this.orderService.confirmDelivery(orderId)
  }

  /**
   * Request refund
   * POST /wdm/orders/:id/refund
   */
  @Post('orders/:id/refund')
  async requestRefund(
    @Param('id') orderId: string,
    @Body() refundData: any,
  ) {
    return this.orderService.requestRefund(orderId, refundData)
  }

  // ============================================================================
  // ORDER ENDPOINTS (SELLER)
  // ============================================================================

  /**
   * Get seller's orders
   * GET /wdm/sellers/orders
   */
  @Get('sellers/orders')
  async getSellerOrders(@Query('sellerId') sellerId: string) {
    return this.orderService.getBySeller(sellerId)
  }

  /**
   * Mark order as shipped
   * PUT /wdm/sellers/orders/:id/mark-shipped
   */
  @Put('sellers/orders/:id/mark-shipped')
  async markShipped(
    @Param('id') orderId: string,
    @Body() shippingData: any,
  ) {
    return this.orderService.markShipped(orderId, shippingData)
  }

  // ============================================================================
  // SELLER PROFILE & TIER
  // ============================================================================

  /**
   * Get seller profile
   * GET /wdm/sellers/:id
   */
  @Get('sellers/:id')
  async getSellerProfile(@Param('id') sellerId: string) {
    return this.sellerService.getProfile(sellerId)
  }

  /**
   * Create seller profile
   * POST /wdm/sellers/profile
   */
  @Post('sellers/profile')
  async createSellerProfile(@Body() profileData: any) {
    return this.sellerService.createProfile(profileData)
  }

  /**
   * Update seller profile
   * PUT /wdm/sellers/profile
   */
  @Put('sellers/profile')
  async updateSellerProfile(@Body() updateData: any) {
    return this.sellerService.updateProfile(updateData)
  }

  /**
   * Get seller stats
   * GET /wdm/sellers/profile/stats
   */
  @Get('sellers/profile/stats')
  async getSellerStats(@Query('sellerId') sellerId: string) {
    return this.sellerService.getStats(sellerId)
  }

  /**
   * Get current tier & progress
   * GET /wdm/sellers/profile/tier
   */
  @Get('sellers/profile/tier')
  async getSellerTier(@Query('sellerId') sellerId: string) {
    return this.sellerService.getTierStatus(sellerId)
  }

  // ============================================================================
  // AFFILIATE PROGRAM
  // ============================================================================

  /**
   * Create affiliate link
   * POST /wdm/affiliates/link
   */
  @Post('affiliates/link')
  async createAffiliateLink(@Body() linkData: any) {
    return this.affiliateService.createLink(linkData)
  }

  /**
   * Get affiliate links
   * GET /wdm/affiliates/links
   */
  @Get('affiliates/links')
  async getAffiliateLinks(@Query('sellerId') sellerId: string) {
    return this.affiliateService.getLinks(sellerId)
  }

  /**
   * Get affiliate earnings
   * GET /wdm/affiliates/earnings
   */
  @Get('affiliates/earnings')
  async getAffiliateEarnings(@Query('sellerId') sellerId: string) {
    return this.affiliateService.getEarnings(sellerId)
  }

  /**
   * Request payout
   * POST /wdm/affiliates/payout-request
   */
  @Post('affiliates/payout-request')
  async requestAffiliatePatoutPayout(@Body() payoutData: any) {
    return this.affiliateService.requestPayout(payoutData)
  }
}
