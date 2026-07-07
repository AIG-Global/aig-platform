'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, User, Key } from 'lucide-react'

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'welcome' | 'signin' | 'signup' | 'invite'>('welcome')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    invitationCode: '',
    verificationCode: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Check for demo account
    if (formData.email === 'mikko.antila@me.com' && formData.password === 'Energia1') {
      // Direct login for demo account
      setTimeout(() => {
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userName', 'Triskelion')
        localStorage.setItem('userPackage', 'professional')
        window.location.href = '/dashboard'
        setIsLoading(false)
      }, 1000)
    } else {
      // Regular email verification flow
      setTimeout(() => {
        setVerificationSent(true)
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      // Save user data to localStorage
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userPackage', 'starter')
      // Redirect to dashboard
      window.location.href = '/dashboard'
      setIsLoading(false)
    }, 1500)
  }

  const handleInvitationCodeJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // In a real app, validate the invitation code against the backend
    // For now, any non-empty code is accepted
    if (formData.invitationCode.trim()) {
      setTimeout(() => {
        // Save user data to localStorage
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userPackage', 'starter')
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
      style={{
        background: 'linear-gradient(135deg, #1a0f15 0%, #2a1f28 50%, #1a0f15 100%)',
        color: '#f5f5dc'
      }}
      className="w-full min-h-screen flex items-center justify-center px-4 py-12"
    >
      {/* Welcome Screen */}
      {authMode === 'welcome' && (
        <div className="w-full max-w-md space-y-8">
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
        <div className="w-full max-w-md space-y-6">
          <button
            onClick={() => setAuthMode('welcome')}
            style={{ color: '#d4af37' }}
            className="text-sm hover:text-[#e8d4a2] transition"
          >
            ← Back
          </button>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p style={{ color: '#e8e8d0' }}>Sign in to your AIGINVEST account</p>
          </div>

          {!verificationSent ? (
            <form onSubmit={handleSignInWithEmail} className="space-y-4">
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

              <div>
                <label style={{ color: '#f5f5dc' }} className="block text-sm font-semibold mb-2">
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
        <div className="w-full max-w-md space-y-6">
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
        <div className="w-full max-w-md space-y-6">
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
      <div className="fixed bottom-6 right-6 z-40">
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
  )
}
