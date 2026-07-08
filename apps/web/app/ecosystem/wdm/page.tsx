'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, Zap } from 'lucide-react'

const PRODUCTS = [
  {
    id: 1,
    name: 'Luxury Timepiece Collection',
    category: 'Watches',
    price: 2500,
    commission: '15%',
    image: '⌚',
    rating: 4.9,
    reviews: 156,
    description: 'Premium Swiss watches with lifetime warranty'
  },
  {
    id: 2,
    name: 'Exclusive Leather Goods',
    category: 'Accessories',
    price: 1200,
    commission: '12%',
    image: '👜',
    rating: 4.8,
    reviews: 89,
    description: 'Hand-crafted Italian leather bags and accessories'
  },
  {
    id: 3,
    name: 'Designer Fashion Line',
    category: 'Fashion',
    price: 3500,
    commission: '18%',
    image: '👔',
    rating: 5.0,
    reviews: 234,
    description: 'Exclusive designer collections'
  },
  {
    id: 4,
    name: 'Premium Tech Gadgets',
    category: 'Technology',
    price: 1800,
    commission: '10%',
    image: '📱',
    rating: 4.7,
    reviews: 178,
    description: 'Latest technology and smart devices'
  },
  {
    id: 5,
    name: 'Luxury Home Decor',
    category: 'Home',
    price: 4200,
    commission: '20%',
    image: '🏺',
    rating: 4.9,
    reviews: 112,
    description: 'Handpicked luxury home furnishings'
  },
  {
    id: 6,
    name: 'Fine Wine Collection',
    category: 'Beverages',
    price: 500,
    commission: '8%',
    image: '🍷',
    rating: 4.8,
    reviews: 167,
    description: 'Curated selection of premium wines'
  }
]

export default function WDMPage() {
  const [cart, setCart] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCommission = cart.reduce((sum, productId) => {
    const product = PRODUCTS.find(p => p.id === productId)
    return sum + (product ? parseFloat(product.commission) : 0)
  }, 0)

  const handleAddToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  return (
    <div style={{
      background: 'linear-gradient(to right bottom, #1a0f15, #2a1f28, #1a0f15)',
      color: '#f5f5dc'
    }} className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/ecosystem"
            style={{ color: '#d4af37' }}
            className="flex items-center gap-2 mb-6 hover:text-[#e8d4a2] transition"
          >
            <ArrowLeft size={20} />
            Back to Ecosystem
          </Link>

          <h1 style={{
            background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-5xl font-bold mb-4">
            World Domination Market
          </h1>
          <p style={{ color: '#e8e8d0' }} className="text-xl max-w-2xl">
            Luxury marketplace with 100% commission redistribution. Every purchase earns commissions for your entire network.
          </p>
        </div>

        {/* Search and Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div style={{
            backgroundColor: 'rgba(61, 44, 53, 0.3)',
            borderColor: '#d4af37',
            borderWidth: '1px'
          }} className="md:col-span-2 rounded-lg p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              style={{
                backgroundColor: 'rgba(26, 15, 21, 0.8)',
                borderColor: '#d4af37',
                color: '#f5f5dc',
                borderWidth: '1px'
              }}
              className="w-full rounded px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          {/* Cart Badge */}
          <div style={{
            backgroundColor: 'rgba(61, 44, 53, 0.3)',
            borderColor: '#d4af37',
            borderWidth: '1px'
          }} className="rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} style={{ color: '#d4af37' }} />
              <div>
                <p style={{ color: '#d4af37' }} className="font-bold text-lg">{cart.length}</p>
                <p style={{ color: '#e8e8d0' }} className="text-sm">items in cart</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'rgba(61, 44, 53, 0.3)',
                borderColor: '#d4af37',
                borderWidth: '1px'
              }}
              className="rounded-lg overflow-hidden hover:border-[#e8d4a2] transition cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Product Image */}
              <div style={{
                backgroundColor: 'rgba(26, 15, 21, 0.8)'
              }} className="p-12 text-center text-6xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p style={{ color: '#d4af37' }} className="text-sm font-semibold mb-2">{product.category}</p>
                <h3 style={{ color: '#f5f5dc' }} className="font-bold text-lg mb-2">{product.name}</h3>
                <p style={{ color: '#e8e8d0' }} className="text-sm mb-4">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        style={{
                          color: i < Math.floor(product.rating) ? '#d4af37' : '#666',
                          fill: i < Math.floor(product.rating) ? '#d4af37' : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ color: '#e8e8d0' }} className="text-sm">
                    {product.rating} ({product.reviews} reviews)
                  </p>
                </div>

                {/* Price and Commission */}
                <div className="flex justify-between items-center mb-4">
                  <p style={{ color: '#f5f5dc' }} className="text-2xl font-bold">€{product.price}</p>
                  <div className="flex items-center gap-1">
                    <Zap size={16} style={{ color: '#d4af37' }} />
                    <p style={{ color: '#d4af37' }} className="font-semibold">{product.commission}</p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product.id)
                  }}
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#1a0f15'
                  }}
                  className="w-full py-2 rounded font-bold hover:bg-[#e8d4a2] transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              style={{
                backgroundColor: 'rgba(61, 44, 53, 0.95)',
                borderColor: '#d4af37',
                borderWidth: '2px'
              }}
              className="rounded-lg p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-8">
                {/* Image */}
                <div style={{
                  backgroundColor: 'rgba(26, 15, 21, 0.8)'
                }} className="w-48 h-48 rounded-lg flex items-center justify-center text-7xl flex-shrink-0">
                  {selectedProduct.image}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <p style={{ color: '#d4af37' }} className="text-sm font-semibold mb-2">{selectedProduct.category}</p>
                  <h2 style={{ color: '#f5f5dc' }} className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
                  <p style={{ color: '#e8e8d0' }} className="text-lg mb-6">{selectedProduct.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p style={{ color: '#d4af37' }} className="text-sm">Rating</p>
                      <p style={{ color: '#f5f5dc' }} className="text-2xl font-bold">{selectedProduct.rating} ⭐</p>
                    </div>
                    <div>
                      <p style={{ color: '#d4af37' }} className="text-sm">Commission</p>
                      <p style={{ color: '#f5f5dc' }} className="text-2xl font-bold">{selectedProduct.commission}</p>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center mb-6">
                    <p style={{ color: '#f5f5dc' }} className="text-4xl font-bold">€{selectedProduct.price}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct.id)
                      setSelectedProduct(null)
                    }}
                    style={{
                      backgroundColor: '#d4af37',
                      color: '#1a0f15'
                    }}
                    className="w-full py-3 rounded-lg font-bold hover:bg-[#e8d4a2] transition text-lg"
                  >
                    Add to Cart - €{selectedProduct.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commission Tracker */}
        {cart.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: '#d4af37',
            borderWidth: '2px'
          }} className="rounded-lg p-8 text-center mb-16">
            <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-4">Your Cart Summary</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <p style={{ color: '#d4af37' }} className="text-sm mb-2">Items in Cart</p>
                <p style={{ color: '#f5f5dc' }} className="text-4xl font-bold">{cart.length}</p>
              </div>
              <div>
                <p style={{ color: '#d4af37' }} className="text-sm mb-2">Total Purchases</p>
                <p style={{ color: '#f5f5dc' }} className="text-4xl font-bold">
                  €{cart.reduce((sum, id) => sum + (PRODUCTS.find(p => p.id === id)?.price || 0), 0)}
                </p>
              </div>
              <div>
                <p style={{ color: '#d4af37' }} className="text-sm mb-2">Average Commission</p>
                <p style={{ color: '#f5f5dc' }} className="text-4xl font-bold">{(totalCommission / cart.length).toFixed(1)}%</p>
              </div>
            </div>

            <button
              style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }}
              className="px-12 py-3 rounded-lg font-bold hover:bg-[#e8d4a2] transition text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div style={{
            backgroundColor: 'rgba(61, 44, 53, 0.3)',
            borderColor: '#d4af37',
            borderWidth: '1px'
          }} className="rounded-lg p-8">
            <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-4">How It Works</h3>
            <ol style={{ color: '#e8e8d0' }} className="space-y-3">
              <li className="flex gap-3">
                <span style={{ color: '#d4af37' }} className="font-bold">1.</span>
                Browse premium luxury products
              </li>
              <li className="flex gap-3">
                <span style={{ color: '#d4af37' }} className="font-bold">2.</span>
                Add items to your cart
              </li>
              <li className="flex gap-3">
                <span style={{ color: '#d4af37' }} className="font-bold">3.</span>
                Complete your purchase
              </li>
              <li className="flex gap-3">
                <span style={{ color: '#d4af37' }} className="font-bold">4.</span>
                Earn commissions on the sale
              </li>
              <li className="flex gap-3">
                <span style={{ color: '#d4af37' }} className="font-bold">5.</span>
                Your network earns commissions too!
              </li>
            </ol>
          </div>

          <div style={{
            backgroundColor: 'rgba(61, 44, 53, 0.3)',
            borderColor: '#d4af37',
            borderWidth: '1px'
          }} className="rounded-lg p-8">
            <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-4">Commission Structure</h3>
            <div style={{ color: '#e8e8d0' }} className="space-y-3">
              <div className="flex justify-between">
                <span>Level 1 (Direct): </span>
                <span style={{ color: '#d4af37' }} className="font-bold">15-20%</span>
              </div>
              <div className="flex justify-between">
                <span>Level 2-5: </span>
                <span style={{ color: '#d4af37' }} className="font-bold">8-10%</span>
              </div>
              <div className="flex justify-between">
                <span>Level 6-10: </span>
                <span style={{ color: '#d4af37' }} className="font-bold">3-5%</span>
              </div>
              <div style={{
                borderTopColor: '#d4af37',
                borderTopWidth: '1px',
                borderTopStyle: 'solid'
              }} className="pt-4 mt-4">
                <p style={{ color: '#d4af37' }} className="font-bold">100% Commission Redistribution!</p>
                <p style={{ color: '#e8e8d0' }} className="text-sm mt-2">All commissions are redistributed to network members monthly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
