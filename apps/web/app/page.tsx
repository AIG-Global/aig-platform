'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <html>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
      }}>
        <main style={{ textAlign: 'center' }}>
          <p>Loading Diana...</p>
        </main>
      </body>
    </html>
  )
}
