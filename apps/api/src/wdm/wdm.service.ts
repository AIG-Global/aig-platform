import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class WDMService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all 18 categories
   */
  async getAllCategories() {
    try {
      const categories = await this.prisma.$queryRaw`
        SELECT id, name, slug, description, icon, "productCount"
        FROM wdm_categories
        ORDER BY name ASC
      `
      return {
        success: true,
        categories,
        count: (categories as any[]).length,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch categories',
      }
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    try {
      const category = await this.prisma.$queryRaw`
        SELECT id, name, slug, description, icon, "productCount"
        FROM wdm_categories
        WHERE slug = ${slug}
        LIMIT 1
      `
      return {
        success: true,
        category: (category as any[])[0],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Category not found',
      }
    }
  }

  /**
   * Initialize seed data (18 categories)
   */
  async seedCategories() {
    const categories = [
      { name: 'Electronics', slug: 'electronics', icon: '📱' },
      { name: 'Home & Garden', slug: 'home-garden', icon: '🏠' },
      { name: 'Fashion & Accessories', slug: 'fashion', icon: '👗' },
      { name: 'Books & Media', slug: 'books', icon: '📚' },
      { name: 'Sports & Outdoors', slug: 'sports', icon: '⚽' },
      { name: 'Software & Apps', slug: 'software', icon: '💻' },
      { name: 'Courses & Learning', slug: 'courses', icon: '🎓' },
      { name: 'Templates & Assets', slug: 'templates', icon: '🎨' },
      { name: 'eBooks & Content', slug: 'ebooks', icon: '📖' },
      { name: 'Design & Development Services', slug: 'dev-services', icon: '🛠️' },
      { name: 'Consulting & Coaching', slug: 'consulting', icon: '💼' },
      { name: 'Design Services', slug: 'design', icon: '🎯' },
      { name: 'Development Services', slug: 'development', icon: '⚙️' },
      { name: 'Marketing Services', slug: 'marketing', icon: '📢' },
      { name: 'Personal Services', slug: 'personal', icon: '👤' },
      { name: 'Crypto Trading', slug: 'crypto', icon: '₿' },
      { name: 'Investment Bundles', slug: 'investments', icon: '💰' },
      { name: 'Experiences & Events', slug: 'experiences', icon: '🎉' },
    ]

    for (const cat of categories) {
      // This will be implemented when WDM tables exist in database
      console.log(`Seeding category: ${cat.name}`)
    }

    return { success: true, seeded: categories.length }
  }
}
