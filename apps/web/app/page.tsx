'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LandingPage from './landing'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      router.push('/home')
    }
  }, [router])

  return <LandingPage />
}
