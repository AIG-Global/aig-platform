'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Mail, User, Key } from 'lucide-react'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [authMode, setAuthMode] = useState<'welcome' | 'signin' | 'signup' | 'invite'>(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signin') return 'signin'
    if (mode === 'signup') return 'signup'
    if (mode === 'invitation') return 'invite'
    return 'welcome'
  })

  const resolveRequestedPackage = () => {
    const requested = (searchParams.get('pack') ?? '').trim().toLowerCase()
    const allowed = new Set(['remittance', 'starter', 'startup', 'premium', 'professional', 'packagea', 'packageb', 'packagec'])
    return allowed.has(requested) ? requested : 'starter'
  }

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signin') setAuthMode('signin')
    else if (mode === 'signup') setAuthMode('signup')
    else if (mode === 'invitation') setAuthMode('invite')
  }, [searchParams])
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    invitationCode: '',
    verificationCode: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const syncAuthSession = async (email: string, packageId: string, userName?: string, userPassword?: string) => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          packageId,
          userName,
          userPassword,
        }),
      })
    } catch {
      // localStorage flow still keeps dashboard login functional if session sync fails.
    }
  }

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const email = formData.email.trim()
    const password = formData.password
    const isDemoCredentials = email === 'mikko.antila@me.com' && password === 'Energia1'
    const storedEmail = localStorage.getItem('userEmail')
    const storedPassword = localStorage.getItem('userPassword')
    const isStoredCredentials = !!storedEmail && !!storedPassword && email === storedEmail && password === storedPassword

    // Direct login for either demo credentials or a previously registered local account.
    if (isDemoCredentials || isStoredCredentials) {
      setTimeout(async () => {
        const selectedPackage = isDemoCredentials ? 'professional' : (localStorage.getItem('userPackage') || 'starter')
        const normalizedName = (formData.name || localStorage.getItem('userName') || email.split('@')[0]).trim()
        await syncAuthSession(email, selectedPackage, normalizedName, password)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userPackage', selectedPackage)
        localStorage.setItem('userName', normalizedName)
        localStorage.setItem('userPassword', password)
        window.location.href = '/dashboard'
        setIsLoading(false)
      }, 1000)
    } else {
      // Fallback local sign-in so entered credentials can always open dashboard.
      setTimeout(async () => {
        const selectedPackage = localStorage.getItem('userPackage') || 'starter'
        const normalizedName = (formData.name || localStorage.getItem('userName') || email.split('@')[0]).trim()
        await syncAuthSession(email, selectedPackage, normalizedName, password)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userPackage', selectedPackage)
        localStorage.setItem('userName', normalizedName)
        localStorage.setItem('userPassword', password)
        window.location.href = '/dashboard'
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const selectedPack = resolveRequestedPackage()
    // Simulate registration
    setTimeout(async () => {
      // Save user data to localStorage
      const normalizedName = (formData.name || formData.email.split('@')[0]).trim()
      await syncAuthSession(formData.email, selectedPack, normalizedName, formData.password)
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userPackage', selectedPack)
      localStorage.setItem('userName', normalizedName)
      if (formData.password) localStorage.setItem('userPassword', formData.password)
      // Redirect to dashboard
      window.location.href = '/dashboard'
      setIsLoading(false)
    }, 1500)
  }

  const handleInvitationCodeJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const selectedPack = resolveRequestedPackage()
    
    // In a real app, validate the invitation code against the backend
    // For now, any non-empty code is accepted
    if (formData.invitationCode.trim()) {
      setTimeout(async () => {
        // Save user data to localStorage
        const normalizedName = (formData.name || formData.email.split('@')[0]).trim()
        await syncAuthSession(formData.email, selectedPack, normalizedName, formData.password)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userPackage', selectedPack)
        localStorage.setItem('userName', normalizedName)
        if (formData.password) localStorage.setItem('userPassword', formData.password)
        localStorage.setItem('invitedBy', formData.invitationCode)
        // Redirect to dashboard where they can set their nickname
        window.location.href = '/dashboard'
        setIsLoading(false)
      }, 1500)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="relative w-screen overflow-hidden"
      style={{
        height: '100vh',
        backgroundImage: `url('/images/vault.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}>

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/25" />

      {/* Content centered */}
      <div className="relative z-10" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Semi-transparent box */}
        <div
          style={{
            maxWidth: '400px',
            padding: '32px',
            margin: '0 16px',
            backgroundColor: 'rgba(26, 15, 21, 0.65)',
            backdropFilter: 'blur(16px)',
            borderColor: '#d4af37',
            color: '#f5f5dc',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(212, 175, 55, 0.1)',
            border: '1.5px solid',
            background: 'linear-gradient(135deg, rgba(26, 15, 21, 0.65) 0%, rgba(42, 31, 40, 0.65) 100%)',
            borderRadius: '48px',
            boxSizing: 'border-box'
          }}
        >
      {/* Welcome Screen */}
      {authMode === 'welcome' && (
        <div className="space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div
              style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto"
            >
              AIG
            </div>
            <div>
              <h1
                style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                className="text-4xl font-bold mb-2"
              >
                AIGINVEST
              </h1>
              <p style={{ color: '#e8e8d0' }} className="text-lg">
                The AI-Powered Business Operating System
              </p>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-3">
            <p style={{ color: '#f5f5dc' }} className="text-xl font-light">
              Welcome to the future of wealth building
            </p>
            <p style={{ color: '#e8e8d0' }} className="text-sm">
              Join thousands earning passive income through AI-powered apps and commission networks
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setAuthMode('signin')}
              style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#e8d4a2] transition"
            >
              Sign In with Email <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setAuthMode('signup')}
              style={{
                borderColor: '#d4af37',
                color: '#f5f5dc'
              }}
              className="w-full py-3 rounded-lg font-semibold border-2 hover:bg-[#d4af37]/10 transition"
            >
              Create New Account
            </button>

            <button
              onClick={() => setAuthMode('invite')}
              style={{
                borderColor: '#d4af37',
                color: '#f5f5dc'
              }}
              className="w-full py-3 rounded-lg font-semibold border-2 hover:bg-[#d4af37]/10 transition"
            >
              Enter Invitation Code
            </button>
          </div>

          {/* Footer Info */}
          <div style={{ borderTopColor: '#d4af37' }} className="border-t pt-4">
            <p style={{ color: '#e8e8d0' }} className="text-xs text-center">
              By joining AIGINVEST, you agree to our{' '}
              <a href="#" className="hover:text-[#d4af37] transition">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="hover:text-[#d4af37] transition">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Sign In Screen */}
      {authMode === 'signin' && (
        <div className="space-y-6">
          <button
            onClick={() => setAuthMode('welcome')}
            style={{ color: '#d4af37' }}
            className="text-sm hover:text-[#e8d4a2] transition"
          >
            ← Back
          </button>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Welcome to Your Business Vault</h2>
            <p style={{ color: '#e8e8d0' }} className="text-sm">Keep your passwords safe.</p>
            <p style={{ color: '#d4af37' }} className="italic font-light text-center">"You Can Watch Me, Mock Me, Try To Block Me But You Cannot Stop Me."</p>
            <p style={{ color: '#e8e8d0' }} className="text-xs text-center">— Jordan Belfort</p>
          </div>

          {!verificationSent ? (
            <form onSubmit={handleSignInWithEmail} className="space-y-4">
              <div>
                <label htmlFor="signin-email" style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <Mail size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signin-password" style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <Key size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    id="signin-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault()
                  void handleSignInWithEmail(e)
                }}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <p style={{ color: '#e8e8d0' }} className="text-sm">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>

              <div>
                <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Verification Code
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <Key size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none text-center tracking-widest"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>

              <button
                type="button"
                onClick={() => setVerificationSent(false)}
                style={{ color: '#d4af37' }}
                className="w-full text-sm hover:text-[#e8d4a2] transition"
              >
                Resend Code
              </button>
            </form>
          )}
        </div>
      )}

      {/* Sign Up Screen */}
      {authMode === 'signup' && (
        <div style={{ width: '100%' }} className="space-y-6">
          <button
            onClick={() => setAuthMode('welcome')}
            style={{ color: '#d4af37' }}
            className="text-sm hover:text-[#e8d4a2] transition"
          >
            ← Back
          </button>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p style={{ color: '#e8e8d0' }}>Join AIGINVEST today</p>
          </div>

          {!verificationSent ? (
            <form onSubmit={handleSignInWithEmail} className="space-y-4">
              <div>
                <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <User size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <Mail size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <p style={{ color: '#e8e8d0' }} className="text-sm">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>

              <div>
                <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                  Verification Code
                </label>
                <div
                  style={{
                    backgroundColor: 'rgba(61, 44, 53, 0.5)',
                    borderColor: '#d4af37'
                  }}
                  className="relative border rounded-lg"
                >
                  <Key size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none text-center tracking-widest"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <button
                type="button"
                onClick={() => setVerificationSent(false)}
                style={{ color: '#d4af37' }}
                className="w-full text-sm hover:text-[#e8d4a2] transition"
              >
                Resend Code
              </button>
            </form>
          )}

          <p style={{ color: '#e8e8d0' }} className="text-sm text-center">
            Already have an account?{' '}
            <button
              onClick={() => setAuthMode('signin')}
              style={{ color: '#d4af37' }}
              className="hover:text-[#e8d4a2] transition"
            >
              Sign In
            </button>
          </p>
        </div>
      )}

      {/* Invitation Code Screen */}
      {authMode === 'invite' && (
        <div style={{ width: '100%' }} className="space-y-6">
          <button
            onClick={() => setAuthMode('welcome')}
            style={{ color: '#d4af37' }}
            className="text-sm hover:text-[#e8d4a2] transition"
          >
            ← Back
          </button>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Have an Invitation?</h2>
            <p style={{ color: '#e8e8d0' }}>Enter your invitation code to join AIGINVEST</p>
          </div>

          <form onSubmit={handleInvitationCodeJoin} className="space-y-4">
            <div>
              <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                Invitation Code
              </label>
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.5)',
                  borderColor: '#d4af37'
                }}
                className="relative border rounded-lg"
              >
                <Key size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.invitationCode}
                  onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., A1B2C3D4"
                  className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none uppercase tracking-wider"
                  maxLength={8}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.5)',
                  borderColor: '#d4af37'
                }}
                className="relative border rounded-lg"
              >
                <Mail size={18} style={{ color: '#d4af37' }} className="absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 bg-transparent text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.invitationCode.trim()}
              style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }}
              className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join with Invitation Code'}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={{ color: '#d4af37' }}
              className="w-full text-sm hover:text-[#e8d4a2] transition"
            >
              Already have an account? Sign In
            </button>
          </form>
        </div>
      )}

      {/* Diana Widget */}
      <div className="fixed bottom-0 right-6 z-40">
        <button
          style={{
            background: 'linear-gradient(to br, #d4af37, #e8d4a2)',
            color: '#1a0f15'
          }}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-110 border-2"
          title="Chat with Diana"
        >
          💬
        </button>
      </div>
        </div>
      </div>
    </div>
  )
}
