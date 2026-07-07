'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userEmail = localStorage.getItem('userEmail')
    
    if (userEmail) {
      // Logged in - go to dashboard
      router.push('/dashboard')
    } else {
      // Not logged in - go to auth
      router.push('/auth')
    }
  }, [router])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a0f15 0%, #2a1f28 50%, #1a0f15 100%)',
      color: '#f5f5dc'
    }} className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div style={{
          background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }} className="text-4xl font-bold">
          AIGINVEST
        </div>
        <p style={{ color: '#e8e8d0' }}>Loading...</p>
      </div>
    </div>
  )
}
