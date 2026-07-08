'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/js'
import React from 'react'

interface PaymentButtonProps {
  userId: string
  packId: string
  packName: string
  price: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  userId,
  packId,
  packName,
  price,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Create checkout session on backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          packId,
          packPrice: price,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // 2. Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // 3. Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      onSuccess?.()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#999' : '#d4af37',
          color: '#1a0f15',
        }}
        className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : `Upgrade to ${packName} - €${price}/month`}
      </button>
      {error && (
        <p style={{ color: '#ff6b6b' }} className="text-sm">
          {error}
        </p>
      )}
    </div>
  )
}

export default PaymentButton
