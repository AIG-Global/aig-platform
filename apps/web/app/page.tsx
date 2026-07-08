'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0f15 0%, #2a1f28 50%, #1a0f15 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Background Image - centered and full width */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <img
          src="/images/landing-bg.png"
          alt="background"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.6) saturate(0.8)'
          }}
        />
      </div>

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5), rgba(0,0,0,0.6))',
        zIndex: 2
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>

        {/* Transparent Join Box */}
        <div
          style={{
            backgroundColor: 'rgba(26, 15, 21, 0.35)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #d4af37',
            borderRadius: '1.5rem',
            padding: '1.25rem 1.25rem',
            maxWidth: '36rem',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            marginTop: '13rem'
          }}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <p style={{ 
                  color: '#d4af37',
                  fontSize: 'clamp(0.875rem, 4vw, 1.125rem)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  lineHeight: 1.4,
                  margin: 0
                }}>
                  "The only thing standing between you and your goal is the story<br />you keep telling yourself as to why you can't achieve it."
                </p>
                <p style={{ 
                  color: '#d4af37',
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  fontWeight: 700,
                  marginTop: '0.5rem',
                  margin: '0.5rem 0 0 0'
                }}>
                  – Jordan Belfort
                </p>
              </div>
            </div>

            {/* Image-Based Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              paddingTop: '0rem'
            }}>
              <Link
                href="/auth?mode=signin"
                style={{
                  backgroundImage: "url('/images/ChatGPT Image 8.7.2026 klo 01.23.28.png')",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: '#d4af37',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  transition: 'opacity 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Already a Wolf
              </Link>

              <Link
                href="/join"
                style={{
                  backgroundImage: "url('/images/ChatGPT Image 8.7.2026 klo 01.23.28.png')",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: '#d4af37',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  transition: 'opacity 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                I Want To Join!
              </Link>

              <Link
                href="/invite"
                style={{
                  backgroundImage: "url('/images/ChatGPT Image 8.7.2026 klo 01.23.28.png')",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: '#d4af37',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  transition: 'opacity 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Got a Code.
              </Link>
            </div>

            {/* Gold divider line */}
            <div style={{
              width: 'calc(100% + 2.5rem)',
              height: '1px',
              backgroundColor: '#d4af37',
              marginTop: '0.3rem',
              marginBottom: '0.5rem',
              marginLeft: '-1.25rem',
              marginRight: '-1.25rem'
            }} />

            {/* Tagline under buttons */}
            <div style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>
              <p style={{ 
                color: '#d4af37',
                fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                fontWeight: 600,
                margin: 0
              }}>
                AIGINVEST | Premium Wealth Platform
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem',
          paddingTop: '0.3rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          maxWidth: '42rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#d4af37',
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              fontWeight: 700,
              margin: 0
            }}>
              6-10
            </p>
            <p style={{ 
              color: '#e8e8d0',
              fontSize: '0.75rem',
              margin: '0.25rem 0 0 0'
            }}>
              Tier Levels
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#d4af37',
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              fontWeight: 700,
              margin: 0
            }}>
              ∞
            </p>
            <p style={{ 
              color: '#e8e8d0',
              fontSize: '0.75rem',
              margin: '0.25rem 0 0 0'
            }}>
              Earning Power
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#d4af37',
              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
              fontWeight: 700,
              margin: 0
            }}>
              24/7
            </p>
            <p style={{ 
              color: '#e8e8d0',
              fontSize: '0.75rem',
              margin: '0.25rem 0 0 0'
            }}>
              Support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
