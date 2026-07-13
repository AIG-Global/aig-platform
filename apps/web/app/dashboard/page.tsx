'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { LogOut, ChevronRight, Check, Lock, Star, Zap, Copy, Gift, ChevronDown, Globe, User, Wallet, History, FileText, Headphones, MessageCircle, Map, Users, TrendingUp, Users2, Target, BookOpen, Briefcase, Award, ArrowRight, Music2, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import maplibregl from 'maplibre-gl'
import { PMTiles, Protocol } from 'pmtiles'
import { layers, namedFlavor } from '@protomaps/basemaps'
import 'maplibre-gl/dist/maplibre-gl.css'

// Professional dashboard with TribeWin visual design aesthetic
// 100% AIGINVEST branded - no external branding or terminology

interface Package {
  id: string
  name: string
  monthlyPrice: number
  description: string
  earningCap: string | 'unlimited'
  investmentCapacity: string | 'unlimited'
  apps: string[]
  bonusFeatures: string[]
  highlight?: boolean
}

const PACKAGES: Package[] = [
  {
    id: 'packagea',
    name: 'Starter Business Pack',
    monthlyPrice: 399,
    description: 'Begin your wealth journey',
    earningCap: '€1,000/month',
    investmentCapacity: '€1,000',
    apps: ['WDM and AIG ecosystem access', 'AIG Investment platform', 'AIG MoneyGames App', 'AIG Investor Alerts', 'Marketplace seller access', 'Monthly webinars'],
    bonusFeatures: ['26% Level-1 commission rate', 'Full ecosystem access', 'Transfer fee 3.90% (80% network, 20% management)', 'AIG Cash transfers FREE'],
    highlight: false
  },
  {
    id: 'packageb',
    name: 'Start-Up Business Pack',
    monthlyPrice: 699,
    description: 'Scale your growth fast',
    earningCap: '€5,000/month',
    investmentCapacity: '€5,000',
    apps: ['All Starter Pack features', 'AIG HELO (emergency travel)', 'AIG Business Weather', 'Preferred seller status'],
    bonusFeatures: ['Enhanced earning potential', 'Priority support', 'Transfer fee 1.90%', 'AIG Cash transfers FREE'],
    highlight: false
  },
  {
    id: 'packagec',
    name: 'Premium Business Pack',
    monthlyPrice: 1099,
    description: "It's time to build",
    earningCap: '€10,000/month',
    investmentCapacity: '€10,000',
    apps: ['All Start-Up Pack features', 'AIG Me (relationship manager)', 'Exclusive VIP tools', 'Priority support'],
    bonusFeatures: ['High earning capacity', 'Transfer fee 0.90%', 'Exclusive events', 'AIG Cash transfers FREE'],
    highlight: true
  },
  {
    id: 'professional',
    name: 'Professional Business Pack',
    monthlyPrice: 2999,
    description: 'Reach the world',
    earningCap: 'unlimited',
    investmentCapacity: 'unlimited',
    apps: ['All current and future apps', 'AIG Record (organization management)', 'AIG Secure Sign', 'AIG Ask (Claude AI integration)', 'AIG ONE (premium dashboard)', 'Affiliate commissions up to 10 levels'],
    bonusFeatures: ['Unlimited earning potential', 'Transfer fee 0.15%', '24/7 VIP support', 'Strategic partnership opportunities', 'AIG Cash transfers FREE'],
    highlight: false
  }
]

// Enhanced members data with network details
const MEMBERS_DATA = [
  { id: 1, name: 'John Smith', circle: 1, status: 'Active', joinDate: '2024-01-15', directEarnings: 1250, networkEarnings: 5200, activeNetwork: 12 },
  { id: 2, name: 'Sarah Johnson', circle: 1, status: 'Active', joinDate: '2024-02-20', directEarnings: 2100, networkEarnings: 8900, activeNetwork: 18 },
  { id: 3, name: 'Michael Brown', circle: 2, status: 'Inactive', joinDate: '2024-03-10', directEarnings: 450, networkEarnings: 1200, activeNetwork: 3 },
  { id: 4, name: 'Emma Davis', circle: 1, status: 'Active', joinDate: '2024-04-05', directEarnings: 1890, networkEarnings: 6700, activeNetwork: 15 },
  { id: 5, name: 'James Wilson', circle: 1, status: 'Active', joinDate: '2024-05-12', directEarnings: 3200, networkEarnings: 12400, activeNetwork: 22 }
]

// Activity/transaction ledger
const ACTIVITIES_DATA = [
  { id: 1, date: '2024-12-20', type: 'Commission', amount: 450, balance: 15450, description: 'Monthly commission from network' },
  { id: 2, date: '2024-12-19', type: 'Withdrawal', amount: -2000, balance: 15000, description: 'Withdrawal to bank account' },
  { id: 3, date: '2024-12-18', type: 'Bonus', amount: 300, balance: 17000, description: 'Performance bonus' },
  { id: 4, date: '2024-12-17', type: 'Commission', amount: 650, balance: 16700, description: 'Weekly commission payout' },
  { id: 5, date: '2024-12-16', type: 'Deposit', amount: 5000, balance: 16050, description: 'Bank transfer deposit' }
]

const parseInvestmentCapacity = (capacity: string | 'unlimited'): number | null => {
  if (capacity === 'unlimited') return null
  const digits = capacity.replace(/[^\d]/g, '')
  if (!digits) return 0
  return parseInt(digits, 10)
}

const normalizeDashboardPackageId = (value: string | null | undefined): string => {
  const normalized = (value ?? '').trim().toLowerCase()

  if (normalized === 'professional' || normalized === 'pro+' || normalized === 'pro_plus') return 'professional'
  if (normalized === 'premium' || normalized === 'packagec' || normalized === 'pro') return 'packagec'
  if (normalized === 'startup' || normalized === 'packageb' || normalized === 'growth') return 'packageb'
  if (normalized === 'starter' || normalized === 'remittance' || normalized === 'packagea') return 'packagea'

  return 'packagea'
}

const INVESTMENT_OPTIONS = [
  { id: 'managed-funds', name: 'Managed Funds', description: 'Professional fund baskets managed by ecosystem strategy teams.' },
  { id: 'wdm-inventory', name: 'WDM Inventory', description: 'AIG Cash inventory reserved for World Domination Market operations.' },
  { id: 'token-strategies', name: 'Token Strategies', description: 'North Star and AIG Phone token strategy allocations.' },
  { id: 'liquidity-reserve', name: 'Liquidity Reserve', description: 'Reserve allocation for settlement stability and risk control.' },
]

interface AudioTrack {
  title: string
  artist: string
  album: string
  src: string
}

const DEFAULT_AUDIO_LIBRARY: AudioTrack[] = [
  {
    title: "ASK DIANA DIAMONDS DON'T OWN ME",
    artist: 'AIG Invest',
    album: 'Ask Diana Sessions',
    src: '/mediafiles/ASK%20DIANA%20DIAMONDS%20DON%27T%20OWN%20ME.wav'
  },
  {
    title: 'ASK DIANA THE NORTH STAR RISE',
    artist: 'AIG Invest',
    album: 'Ask Diana Sessions',
    src: '/mediafiles/ASK%20DIANA%20THE%20NORTH%20STAR%20RISE.wav'
  },
  {
    title: 'Verse 1',
    artist: 'Matt Mertel, AIG Theme',
    album: 'AIG Theme Sessions',
    src: '/mediafiles/Verse%201.wav'
  },
  {
    title: 'AIG Anthem Together We Rise',
    artist: 'NorthStar',
    album: 'NorthStar Anthem',
    src: '/mediafiles/AIG%20Anthem%20Together%20We%20Rise.wav'
  },
  {
    title: 'No Monkey Business',
    artist: 'Mike and the Minions',
    album: 'No Monkey Business',
    src: '/mediafiles/No%20Monkey%20Business.wav'
  },
]

const DashboardMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const frequencyDataRef = useRef<Uint8Array | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<'player' | 'playlist'>('player')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [isMuted, setIsMuted] = useState(false)
  const [beatLevels, setBeatLevels] = useState<number[]>(Array.from({ length: 28 }, () => 0.08))
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({})
  const [songSearch, setSongSearch] = useState('')
  const [audioLibrary, setAudioLibrary] = useState<AudioTrack[]>(DEFAULT_AUDIO_LIBRARY)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  const currentTrack = audioLibrary[currentTrackIndex]

  const filteredTracks = useMemo(() => {
    const query = songSearch.trim().toLowerCase()

    return audioLibrary
      .map((track, index) => ({ ...track, index }))
      .filter((track) => {
        if (!query) return true

        const searchable = `${track.title} ${track.artist} ${track.album}`.toLowerCase()
        return searchable.includes(query)
      })
  }, [songSearch, audioLibrary])

  useEffect(() => {
    let active = true

    const loadMusicLibrary = async () => {
      try {
        const response = await fetch('/api/music-library', { cache: 'no-store' })
        if (!response.ok) return

        const payload = await response.json() as { items?: AudioTrack[] }
        const items = Array.isArray(payload.items) ? payload.items : []
        if (!active || items.length === 0) return

        setAudioLibrary(items)
      } catch {
        // Keep fallback tracks if dynamic library is unavailable.
      }
    }

    void loadMusicLibrary()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setCurrentTrackIndex((previous) => {
      if (audioLibrary.length === 0) return 0
      return Math.min(previous, audioLibrary.length - 1)
    })
  }, [audioLibrary])

  const stopBeatAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const startBeatAnimation = () => {
    const analyser = analyserRef.current
    const frequencyData = frequencyDataRef.current
    if (!analyser || !frequencyData) return

    stopBeatAnimation()

    const tick = () => {
      analyser.getByteFrequencyData(frequencyData)
      const barCount = 28
      const step = Math.max(1, Math.floor(frequencyData.length / barCount))
      const nextLevels = Array.from({ length: barCount }, (_, index) => {
        const value = frequencyData[index * step] ?? 0
        return Math.max(0.08, value / 255)
      })
      setBeatLevels(nextLevels)
      animationFrameRef.current = requestAnimationFrame(tick)
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }

  const ensureVisualizer = () => {
    const audio = audioRef.current
    if (!audio) return null

    if (!audioContextRef.current) {
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.82

      const sourceNode = context.createMediaElementSource(audio)
      sourceNode.connect(analyser)
      analyser.connect(context.destination)

      audioContextRef.current = context
      analyserRef.current = analyser
      sourceNodeRef.current = sourceNode
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount)
    }

    return {
      context: audioContextRef.current,
      analyser: analyserRef.current,
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.src
    audio.load()
    setProgress(0)
    setDuration(0)
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      const visualizer = ensureVisualizer()
      if (visualizer?.context?.state === 'suspended') {
        void visualizer.context.resume()
      }
      startBeatAnimation()
      void audio.play()
        .then(() => setPlaybackError(null))
        .catch(() => {
          setIsPlaying(false)
          setPlaybackError('Playback blocked by browser policy. Click Start Player to begin audio.')
        })
      return
    }

    stopBeatAnimation()
    setBeatLevels(Array.from({ length: 28 }, () => 0.08))
    audio.pause()
  }, [isPlaying, currentTrack])

  useEffect(() => {
    let cancelled = false
    const disposers: Array<() => void> = []

    audioLibrary.forEach((track) => {
      if (trackDurations[track.src]) return

      const probe = new Audio(track.src)
      probe.preload = 'metadata'

      const handleLoadedMetadata = () => {
        if (cancelled) return
        setTrackDurations((prev) => ({
          ...prev,
          [track.src]: probe.duration || 0,
        }))
      }

      const handleError = () => {
        if (cancelled) return
        setTrackDurations((prev) => ({
          ...prev,
          [track.src]: 0,
        }))
      }

      probe.addEventListener('loadedmetadata', handleLoadedMetadata)
      probe.addEventListener('error', handleError)

      disposers.push(() => {
        probe.removeEventListener('loadedmetadata', handleLoadedMetadata)
        probe.removeEventListener('error', handleError)
      })
    })

    return () => {
      cancelled = true
      disposers.forEach((dispose) => dispose())
    }
  }, [trackDurations, audioLibrary])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0)
    }

    const handleEnded = () => {
      if (audioLibrary.length === 0) return
      setProgress(0)
      setCurrentTrackIndex((index) => (index + 1) % audioLibrary.length)
      setIsPlaying(true)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioLibrary.length])

  useEffect(() => {
    return () => {
      stopBeatAnimation()
      if (audioContextRef.current) {
        void audioContextRef.current.close()
      }
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setPlaybackError(null)
      stopBeatAnimation()
      setBeatLevels(Array.from({ length: 28 }, () => 0.08))
      return
    }

    const visualizer = ensureVisualizer()
    if (visualizer?.context?.state === 'suspended') {
      void visualizer.context.resume()
    }
    startBeatAnimation()
    void audio.play()
      .then(() => {
        setIsPlaying(true)
        setPlaybackError(null)
      })
      .catch(() => {
        setIsPlaying(false)
        setPlaybackError('Playback blocked by browser policy. Click Start Player to begin audio.')
      })
  }

  const startPlayer = () => {
    setPlaybackError(null)
    if (!isPlaying) {
      togglePlay()
    }
  }

  const goToPreviousTrack = () => {
    if (audioLibrary.length === 0) return
    setCurrentTrackIndex((index) => (index - 1 + audioLibrary.length) % audioLibrary.length)
    setIsPlaying(true)
  }

  const goToNextTrack = () => {
    if (audioLibrary.length === 0) return
    setCurrentTrackIndex((index) => (index + 1) % audioLibrary.length)
    setIsPlaying(true)
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setProgress(nextTime)
  }

  return (
    <div
      style={{
        backgroundColor: '#080808',
        border: 'none',
        boxShadow: 'none',
        width: '100%',
        maxWidth: '1150px',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="rounded-none p-4"
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold flex items-center gap-2">
          <Music2 size={24} /> AIG Music Player
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div style={{ color: '#c0c0c0' }} className="text-xs flex items-center gap-2">
            <Lock size={14} /> Locked playlist sourced only from mediafiles
          </div>
          <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: 'rgba(26, 15, 21, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <button
              onClick={() => setViewMode('player')}
              style={{
                backgroundColor: viewMode === 'player' ? '#d4af37' : 'transparent',
                color: viewMode === 'player' ? '#1a0f15' : '#c0c0c0'
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
            >
              Player
            </button>
            <button
              onClick={() => setViewMode('playlist')}
              style={{
                backgroundColor: viewMode === 'playlist' ? '#d4af37' : 'transparent',
                color: viewMode === 'playlist' ? '#1a0f15' : '#c0c0c0'
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
            >
              Playlist
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />

      {viewMode === 'player' ? (
        <div style={{ position: 'relative', minHeight: 'auto', overflow: 'hidden' }}>
          <div
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.08)',
              border: 'none',
              boxShadow: 'none',
              width: '100%',
              position: 'relative',
              minHeight: 'auto',
              overflow: 'hidden'
            }}
            className="rounded-lg p-0"
          >
          <div
            style={{
              height: '697px',
              width: '85%',
              backgroundImage: 'url("/images/aig-music-main-player.png")',
              backgroundSize: 'contain',
              backgroundPosition: 'top left',
              backgroundRepeat: 'no-repeat',
              filter: 'saturate(1.15) contrast(1.12)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: '16px',
              right: '16px',
              bottom: '16px'
            }}
          >
            <p style={{ color: playbackError ? '#fca5a5' : '#9ae6b4' }} className="text-xs font-semibold">
              {playbackError ?? (isPlaying ? 'Playing now' : 'Ready to play')}
            </p>

            {!isPlaying && (
              <button
                onClick={startPlayer}
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.22)',
                  border: '1px solid rgba(212, 175, 55, 0.44)',
                  color: '#f5f5dc'
                }}
                className="mt-2 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#d4af37]/30 transition"
              >
                Start Player
              </button>
            )}

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={goToPreviousTrack}
                style={{ backgroundColor: 'rgba(184, 184, 184, 0.12)', color: '#f5f5dc' }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#b8b8b8]/20 transition"
                aria-label="Previous track"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlay}
                style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#e8d4a2] transition font-bold"
                aria-label={isPlaying ? 'Pause track' : 'Play track'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={goToNextTrack}
                style={{ backgroundColor: 'rgba(184, 184, 184, 0.12)', color: '#f5f5dc' }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#b8b8b8]/20 transition"
                aria-label="Next track"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#c0c0c0' }}>
                <span>{formatPlayerTime(progress)}</span>
                <span>{formatPlayerTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(duration, 0)}
                value={Math.min(progress, duration || progress)}
                onChange={handleSeek}
                style={{ accentColor: '#d4af37' }}
                className="w-full"
              />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                aria-label={isMuted ? 'Unmute player' : 'Mute player'}
                style={{ backgroundColor: 'rgba(184, 184, 184, 0.12)', color: '#f5f5dc' }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b8b8b8]/20 transition"
              >
                {isMuted ? <VolumeX size={15} style={{ color: '#d4af37' }} /> : <Volume2 size={15} style={{ color: '#d4af37' }} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                style={{ accentColor: '#d4af37' }}
                className="w-full"
              />
            </div>
          </div>

          </div>

          <div
            style={{
              background: 'linear-gradient(160deg, rgba(10, 10, 10, 0.88) 0%, rgba(22, 20, 16, 0.86) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.32)',
              position: 'absolute',
              top: '118px',
              left: 'calc(120px + 5cm + 12ch - 12px)',
              right: 'auto',
              width: '32%',
              maxWidth: '260px',
              minWidth: '180px'
            }}
            className="rounded-lg p-4"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 style={{ color: '#f5f5dc' }} className="text-sm font-semibold tracking-wide">AIG Music Library</h3>
              <span style={{ color: '#8b8b8b' }} className="text-xs">Songs listed from your mediafiles folder</span>
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={songSearch}
                onChange={(event) => setSongSearch(event.target.value)}
                placeholder="Search music..."
                style={{
                  backgroundColor: 'rgba(12, 12, 12, 0.74)',
                  border: '1px solid rgba(212, 175, 55, 0.32)',
                  color: '#f5f5dc'
                }}
                className="w-full rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/50"
              />
            </div>

            <div style={{ borderColor: 'rgba(212, 175, 55, 0.22)' }} className="rounded-lg border overflow-hidden">
              <div
                style={{
                  background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.04) 100%)',
                  color: '#e7dcc0',
                  display: 'grid',
                  gridTemplateColumns: '44px minmax(0, 2fr) minmax(0, 1.3fr) minmax(0, 1.2fr) 62px',
                  columnGap: '8px'
                }}
                className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                <span>#</span>
                <span>Title</span>
                <span>Artist</span>
                <span>Album</span>
                <span className="text-right">Time</span>
              </div>
              <div
                className="aig-music-scroll max-h-[352px] overflow-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4af37 rgba(30, 24, 14, 0.8)' }}
              >
                {filteredTracks.map((track, index) => (
                  <button
                    key={track.src}
                    onClick={() => {
                      setCurrentTrackIndex(track.index)
                      setIsPlaying(true)
                    }}
                    style={{
                      background: track.index === currentTrackIndex
                        ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.24) 0%, rgba(212, 175, 55, 0.06) 100%)'
                        : 'linear-gradient(90deg, rgba(184, 184, 184, 0.03) 0%, rgba(184, 184, 184, 0.01) 100%)',
                      borderBottom: '1px solid rgba(184, 184, 184, 0.12)',
                      boxShadow: track.index === currentTrackIndex ? 'inset 0 0 14px rgba(212, 175, 55, 0.18)' : 'none'
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#d4af37]/10 transition items-center"
                    aria-label={`Play ${track.title} by ${track.artist}`}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px minmax(0, 2fr) minmax(0, 1.3fr) minmax(0, 1.2fr) 62px',
                        columnGap: '8px',
                        alignItems: 'center'
                      }}
                    >
                    <span style={{ color: '#8b8b8b' }} className="block text-sm tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ color: '#f5f5dc' }} className="block text-sm font-semibold truncate">{track.title}</span>
                    <span style={{ color: '#c0c0c0' }} className="block text-sm truncate">{track.artist}</span>
                    <span style={{ color: '#b7b7b7' }} className="block text-sm truncate">{track.album}</span>
                    <span style={{ color: track.index === currentTrackIndex ? '#f0c24d' : '#a0a0a0' }} className="block text-sm text-right tabular-nums">
                      {formatPlayerTime(trackDurations[track.src] ?? 0)}
                    </span>
                    </div>
                  </button>
                ))}
                {filteredTracks.length === 0 && (
                  <div className="px-4 py-6 text-sm" style={{ color: '#9a9a9a' }}>
                    No songs match your search.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(26, 15, 21, 0.55)', border: '1px solid rgba(212, 175, 55, 0.25)' }} className="rounded-lg p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 style={{ color: '#f5f5dc' }} className="text-sm font-semibold tracking-wide">AIG Music Library</h3>
            <span style={{ color: '#8b8b8b' }} className="text-xs">Select a song to play</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {audioLibrary.map((track, index) => (
              <button
                key={track.src}
                onClick={() => {
                  setCurrentTrackIndex(index)
                  setIsPlaying(true)
                  setViewMode('player')
                }}
                style={{
                  backgroundColor: index === currentTrackIndex ? 'rgba(212, 175, 55, 0.16)' : 'rgba(184, 184, 184, 0.06)',
                  borderColor: index === currentTrackIndex ? '#d4af37' : 'rgba(184, 184, 184, 0.18)'
                }}
                className="w-full text-left rounded-lg border px-4 py-4 hover:bg-[#d4af37]/10 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div style={{ color: '#f5f5dc' }} className="text-base font-semibold">{track.title}</div>
                    <div style={{ color: '#c0c0c0' }} className="text-sm mt-1">{track.artist}</div>
                    <div style={{ color: '#8b8b8b' }} className="text-xs mt-1">{track.album}</div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: index === currentTrackIndex ? '#d4af37' : '#8b8b8b' }} className="text-xs font-semibold uppercase tracking-[0.18em]">
                      {index === currentTrackIndex ? 'Selected' : 'Select'}
                    </div>
                    <div style={{ color: '#8b8b8b' }} className="text-[11px] mt-1 tabular-nums">{formatPlayerTime(trackDurations[track.src] ?? 0)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      <style jsx>{`
        .aig-music-scroll::-webkit-scrollbar {
          width: 10px;
        }

        .aig-music-scroll::-webkit-scrollbar-track {
          background: rgba(20, 16, 12, 0.8);
        }

        .aig-music-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f0ca68 0%, #d4af37 100%);
          border-radius: 999px;
          border: 2px solid rgba(20, 16, 12, 0.8);
        }
      `}</style>
      </div>
    </div>
  )
}

const formatPlayerTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'

  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Interactive World Map Component
const InteractiveWorldMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const protocolRef = useRef<Protocol | null>(null)
  const protomapsPmtilesUrl = 'https://build.protomaps.com/20260708.pmtiles'
  const initialCenter: [number, number] = [15, 22]
  const initialZoom = 1.45
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [showLeadersOnly, setShowLeadersOnly] = useState(false)

  // Member location data by city with levels breakdown
  const cities = [
    // Europe
    { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, members: 85, l1: 65, l2: 15, l3: 5, color: '#10b981' },
    { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, members: 72, l1: 50, l2: 18, l3: 4, color: '#10b981' },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, members: 68, l1: 48, l2: 15, l3: 5, color: '#10b981' },
    { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, members: 45, l1: 32, l2: 10, l3: 3, color: '#10b981' },
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, members: 50, l1: 35, l2: 12, l3: 3, color: '#10b981' },
    // Asia
    { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, members: 62, l1: 45, l2: 14, l3: 3, color: '#3b82f6' },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, members: 58, l1: 42, l2: 12, l3: 4, color: '#3b82f6' },
    { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, members: 55, l1: 38, l2: 14, l3: 3, color: '#3b82f6' },
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, members: 10, l1: 7, l2: 2, l3: 1, color: '#3b82f6' },
    // Africa
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, members: 48, l1: 35, l2: 10, l3: 3, color: '#1e3a8a' },
    { name: 'Johannesburg', country: 'South Africa', lat: -26.2023, lng: 28.0436, members: 44, l1: 32, l2: 9, l3: 3, color: '#1e3a8a' },
    // Americas
    { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, members: 78, l1: 55, l2: 18, l3: 5, color: '#b8860b' },
    { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, members: 42, l1: 30, l2: 9, l3: 3, color: '#b8860b' },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, members: 36, l1: 26, l2: 8, l3: 2, color: '#b8860b' }
  ]

  type MembershipPackage = 'Starter' | 'Growth' | 'Pro' | 'Pro+'
  type NetworkRank = 'Member' | 'General'
  type NetworkMember = {
    city: string
    nickname: string
    package: MembershipPackage
    monthlyEarnings: number
    rank: NetworkRank
    isLeader: boolean
    inYourNetwork: boolean
  }

  const packageColorMap: Record<MembershipPackage, string> = {
    'Starter': '#10b981',
    'Growth': '#3b82f6',
    'Pro': '#8b5cf6',
    'Pro+': '#d97706'
  }

  const cityNetworkMembers: NetworkMember[] = [
    { city: 'London', nickname: 'alpha_london', package: 'Pro', monthlyEarnings: 2450, rank: 'Member', isLeader: false, inYourNetwork: true },
    { city: 'London', nickname: 'mentor_thames', package: 'Pro+', monthlyEarnings: 4100, rank: 'General', isLeader: true, inYourNetwork: true },
    { city: 'London', nickname: 'city_hawk', package: 'Growth', monthlyEarnings: 1320, rank: 'Member', isLeader: false, inYourNetwork: false },
    { city: 'Berlin', nickname: 'berlin_bridge', package: 'Growth', monthlyEarnings: 1690, rank: 'Member', isLeader: false, inYourNetwork: true },
    { city: 'Berlin', nickname: 'mauer_growth', package: 'Pro', monthlyEarnings: 2280, rank: 'General', isLeader: true, inYourNetwork: true },
    { city: 'Paris', nickname: 'paris_node', package: 'Starter', monthlyEarnings: 780, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Amsterdam', nickname: 'delta_am', package: 'Starter', monthlyEarnings: 640, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Madrid', nickname: 'iberia_sync', package: 'Growth', monthlyEarnings: 1410, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Singapore', nickname: 'sg_hub', package: 'Pro+', monthlyEarnings: 5200, rank: 'General', isLeader: true, inYourNetwork: true },
    { city: 'Singapore', nickname: 'lion_sg', package: 'Pro', monthlyEarnings: 2640, rank: 'Member', isLeader: false, inYourNetwork: true },
    { city: 'Tokyo', nickname: 'tokyo_vector', package: 'Growth', monthlyEarnings: 1730, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Hong Kong', nickname: 'harbor_wave', package: 'Pro', monthlyEarnings: 2390, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Dubai', nickname: 'desert_axis', package: 'Pro+', monthlyEarnings: 4980, rank: 'General', isLeader: true, inYourNetwork: true },
    { city: 'Cairo', nickname: 'nile_flow', package: 'Starter', monthlyEarnings: 690, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Johannesburg', nickname: 'joburg_link', package: 'Growth', monthlyEarnings: 1290, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'New York', nickname: 'empire_grid', package: 'Pro+', monthlyEarnings: 6100, rank: 'General', isLeader: true, inYourNetwork: true },
    { city: 'New York', nickname: 'hudson_ops', package: 'Pro', monthlyEarnings: 2870, rank: 'Member', isLeader: false, inYourNetwork: true },
    { city: 'Miami', nickname: 'sunline_mia', package: 'Growth', monthlyEarnings: 1550, rank: 'Member', isLeader: true, inYourNetwork: true },
    { city: 'Toronto', nickname: 'northpulse', package: 'Starter', monthlyEarnings: 860, rank: 'Member', isLeader: true, inYourNetwork: true }
  ]

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)

  const getNetworkMembersByCity = (cityName: string) => cityNetworkMembers.filter((member) => member.city === cityName && member.inYourNetwork)
  const getNetworkLeadersByCity = (cityName: string) => getNetworkMembersByCity(cityName)
    .filter((member) => member.package === 'Pro' || member.package === 'Pro+' || member.rank === 'General')

  const getDominantPackage = (members: NetworkMember[]): MembershipPackage => {
    if (members.length === 0) return 'Starter'

    const counts = members.reduce<Record<MembershipPackage, number>>((acc, member) => {
      acc[member.package] += 1
      return acc
    }, {
      'Starter': 0,
      'Growth': 0,
      'Pro': 0,
      'Pro+': 0
    })

    return (Object.keys(counts) as MembershipPackage[]).reduce((best, current) => {
      return counts[current] > counts[best] ? current : best
    }, 'Starter')
  }

  const NETWORK_LINKS: Array<[string, string]> = [
    ['London', 'New York'],
    ['London', 'Berlin'],
    ['Berlin', 'Dubai'],
    ['Dubai', 'Singapore'],
    ['Singapore', 'Tokyo'],
    ['Tokyo', 'Hong Kong'],
    ['Cairo', 'Johannesburg'],
    ['New York', 'Toronto'],
    ['Miami', 'London'],
    ['Johannesburg', 'Dubai']
  ]

  // Keep city markers proportional so dense hubs read quickly at low zoom.
  const getMarkerSize = (members: number) => {
    return Math.min(14 + members / 8, 24)
  }

  const focusOnCity = (city: (typeof cities)[number], targetZoom = 4.25) => {
    setSelectedCity(city.name)
    mapInstanceRef.current?.flyTo({
      center: [city.lng, city.lat],
      zoom: targetZoom,
      speed: 0.8,
      curve: 1.2,
      essential: true
    })
  }

  useEffect(() => {
    const container = mapRef.current
    if (!container || mapInstanceRef.current) return

    setMapStatus('loading')

    const protocol = new Protocol()
    protocolRef.current = protocol
    maplibregl.addProtocol('pmtiles', protocol.tile)

    const source = new PMTiles(protomapsPmtilesUrl)
    protocol.add(source)

    const map = new maplibregl.Map({
      container,
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 1,
      maxZoom: 8,
      attributionControl: false,
      style: {
        version: 8,
        glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
        sources: {
          protomaps: {
            type: 'vector',
            url: `pmtiles://${protomapsPmtilesUrl}`,
            attribution: '<a href="https://protomaps.com">Protomaps</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: layers('protomaps', namedFlavor('grayscale'), { lang: 'en' })
      }
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapInstanceRef.current = map

    const buildPopupHtml = (city: (typeof cities)[number]) => {
      const networkMembers = getNetworkMembersByCity(city.name)
      const networkLeaders = getNetworkLeadersByCity(city.name)
      const displayMembers = showLeadersOnly ? networkLeaders : networkMembers

      const packageStats = displayMembers.reduce<Record<MembershipPackage, number>>((acc, member) => {
        acc[member.package] += 1
        return acc
      }, {
        'Starter': 0,
        'Growth': 0,
        'Pro': 0,
        'Pro+': 0
      })

      const packageSummaryRows = (Object.keys(packageStats) as MembershipPackage[])
        .filter((pkg) => packageStats[pkg] > 0)
        .map((pkg) => `<div style="display:flex; align-items:center; gap:6px; font-size:12px; color:#374151;"><span style="display:inline-block; width:9px; height:9px; border-radius:999px; background:${packageColorMap[pkg]};"></span>${pkg}: ${packageStats[pkg]}</div>`)
        .join('')

      const leaderRows = networkLeaders.length > 0
        ? networkLeaders
          .sort((a, b) => b.monthlyEarnings - a.monthlyEarnings)
          .map((leader) => `<div style="font-size:12px; color:#111827;">👑 @${leader.nickname} • ${leader.rank === 'General' ? 'General' : leader.package} • ${formatCurrency(leader.monthlyEarnings)} / month</div>`)
          .join('')
        : '<div style="font-size:12px; color:#6b7280;">No designated network leaders in this area.</div>'

      const memberRows = displayMembers.length > 0
        ? displayMembers
          .map((member) => `<div style="font-size:12px; color:#111827; padding:4px 0; border-bottom:1px dashed #e5e7eb;"><div style="font-weight:700;">@${member.nickname}</div><div>${member.package} • ${formatCurrency(member.monthlyEarnings)} / month</div></div>`)
          .join('')
        : '<div style="font-size:12px; color:#6b7280;">No visible members in this area for this filter.</div>'

      return `<div style="font-family: ui-sans-serif, system-ui; line-height:1.35; min-width: 170px;">
          <div style="font-weight:700; color:#0f1419;">${city.name}, ${city.country}</div>
          <div style="font-size:12px; color:#374151; margin-top:4px;">Your network members here: ${networkMembers.length}</div>
          <div style="font-size:12px; color:#374151; margin-top:2px; margin-bottom:8px;">Showing in pin: ${displayMembers.length}${showLeadersOnly ? ' (leaders only)' : ''}</div>
          <div style="display:grid; gap:2px; margin-bottom:8px;">${packageSummaryRows || '<div style="font-size:12px; color:#6b7280;">No package data for your network.</div>'}</div>
          <div style="font-size:11px; font-weight:700; color:#6b7280; margin-bottom:4px;">Local leaders (Pro / Pro+ / Generals)</div>
          <div style="display:grid; gap:2px; margin-bottom:8px;">${leaderRows}</div>
          <div style="font-size:11px; font-weight:700; color:#6b7280; margin-bottom:4px;">Visible profile details (your network only)</div>
          <div style="max-height:120px; overflow:auto; padding-right:2px;">${memberRows}</div>
        </div>`
    }

    const addMemberPins = () => {
      if (!map.isStyleLoaded()) return
      if (map.getSource('aig-member-pins')) return

      const visibleCities = cities
        .map((city) => {
          const networkMembers = getNetworkMembersByCity(city.name)
          if (networkMembers.length === 0) return null

          const networkLeaders = getNetworkLeadersByCity(city.name)
          const displayMembers = showLeadersOnly ? networkLeaders : networkMembers
          if (displayMembers.length === 0) return null

          const dominantPackage = getDominantPackage(displayMembers)
          const packageDiversityCount = new Set(displayMembers.map((member) => member.package)).size

          return {
            city,
            displayMembers,
            networkLeaders,
            dominantPackage,
            cityLabel: showLeadersOnly
              ? `${city.name} • leaders: ${networkLeaders.length}`
              : (packageDiversityCount > 1 ? `${city.name} • ${packageDiversityCount} pkg levels` : city.name)
          }
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

      const pinGeoJson = {
        type: 'FeatureCollection',
        features: visibleCities.map(({ city, displayMembers, networkLeaders, dominantPackage, cityLabel }) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [city.lng, city.lat]
          },
          properties: {
            cityName: city.name,
            displayCount: displayMembers.length,
            leadersCount: networkLeaders.length,
            dominantPackage,
            pinRadius: getMarkerSize(displayMembers.length) / 2,
            cityLabel
          }
        }))
      } as any

      try {
        map.addSource('aig-member-pins', {
          type: 'geojson',
          data: pinGeoJson
        })
      } catch {
        // Guard against style timing races during hot reload.
        map.once('load', addMemberPins)
        return
      }

      map.addLayer({
        id: 'aig-member-pins-ring',
        type: 'circle',
        source: 'aig-member-pins',
        paint: {
          'circle-radius': ['+', ['get', 'pinRadius'], 3],
          'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-width': ['case', ['>', ['get', 'leadersCount'], 0], 2.5, 0],
          'circle-stroke-color': 'rgba(250, 204, 21, 0.9)',
          'circle-stroke-opacity': 0.95
        }
      })

      map.addLayer({
        id: 'aig-member-pins-fill',
        type: 'circle',
        source: 'aig-member-pins',
        paint: {
          'circle-radius': ['get', 'pinRadius'],
          'circle-color': [
            'match',
            ['get', 'dominantPackage'],
            'Starter', packageColorMap.Starter,
            'Growth', packageColorMap.Growth,
            'Pro', packageColorMap.Pro,
            'Pro+', packageColorMap['Pro+'],
            packageColorMap.Starter
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.95)',
          'circle-opacity': 0.97
        }
      })

      map.addLayer({
        id: 'aig-member-pins-count',
        type: 'symbol',
        source: 'aig-member-pins',
        layout: {
          'text-field': ['to-string', ['get', 'displayCount']],
          'text-size': 11,
          'text-font': ['Noto Sans Bold'],
          'text-allow-overlap': true
        },
        paint: {
          'text-color': '#ffffff'
        }
      })

      map.addLayer({
        id: 'aig-member-pins-crown',
        type: 'symbol',
        source: 'aig-member-pins',
        filter: ['>', ['get', 'leadersCount'], 0],
        layout: {
          'text-field': '👑',
          'text-size': 12,
          'text-offset': [0.7, -0.8],
          'text-allow-overlap': true
        }
      })

      map.addLayer({
        id: 'aig-member-pins-label',
        type: 'symbol',
        source: 'aig-member-pins',
        layout: {
          'text-field': ['get', 'cityLabel'],
          'text-size': 10,
          'text-font': ['Noto Sans Bold'],
          'text-offset': [0, -2],
          'text-anchor': 'bottom',
          'text-allow-overlap': true
        },
        paint: {
          'text-color': '#f3f4f6',
          'text-halo-color': 'rgba(15, 23, 42, 0.9)',
          'text-halo-width': 1.5
        }
      })

      map.on('mouseenter', 'aig-member-pins-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'aig-member-pins-fill', () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', 'aig-member-pins-fill', (event) => {
        const feature = event.features?.[0]
        const cityName = feature?.properties?.cityName as string | undefined
        if (!cityName) return

        const city = cities.find((entry) => entry.name === cityName)
        if (!city) return

        setSelectedCity(city.name)
        popupRef.current?.remove()
        popupRef.current = new maplibregl.Popup({ offset: 16, closeButton: false, maxWidth: '290px' })
          .setLngLat([city.lng, city.lat])
          .setHTML(buildPopupHtml(city))
          .addTo(map)
      })
    }

    const addNetworkRoutes = () => {
      if (!map.isStyleLoaded() || map.getSource('aig-network-routes')) return

      const routeFeatures = NETWORK_LINKS.flatMap(([fromName, toName]) => {
        const fromCity = cities.find((city) => city.name === fromName)
        const toCity = cities.find((city) => city.name === toName)
        if (!fromCity || !toCity) return []

        return [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [fromCity.lng, fromCity.lat],
              [toCity.lng, toCity.lat]
            ]
          },
          properties: {
            from: fromCity.name,
            to: toCity.name
          }
        }]
      })

      map.addSource('aig-network-routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: routeFeatures
        } as any
      })

      map.addLayer({
        id: 'aig-network-routes-layer',
        type: 'line',
        source: 'aig-network-routes',
        paint: {
          'line-color': '#60a5fa',
          'line-width': 2,
          'line-opacity': 0.72,
          'line-dasharray': [2, 2]
        }
      })

    }

    const initializeMapOverlays = () => {
      addMemberPins()
      addNetworkRoutes()
      setMapStatus('ready')
    }

    map.once('load', initializeMapOverlays)

    map.on('error', () => {
      setMapStatus('error')
    })

    return () => {
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapInstanceRef.current = null
      try {
        maplibregl.removeProtocol('pmtiles')
      } catch {
        // protocol may already be removed during hot reload
      }
    }
  }, [showLeadersOnly])

  const resetMap = () => {
    setSelectedCity(null)
    setShowLeadersOnly(false)
    mapInstanceRef.current?.flyTo({ center: initialCenter, zoom: initialZoom, essential: true })
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(61, 44, 53, 0.3)',
        border: '2px solid #d4af37',
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
        width: '100%',
        maxWidth: '1000px'
      }}
      className="rounded-lg p-6"
    >
      <div className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold flex items-center gap-2">
          <Globe size={24} /> Global Network Distribution (Interactive)
        </h2>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          backgroundColor: '#111827',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(184, 184, 184, 0.2)'
        }}
      >
        {mapStatus === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 600, fontSize: '13px', backgroundColor: 'rgba(15, 23, 42, 0.38)' }}>
            Loading AIG Invest network...
          </div>
        )}
        {mapStatus === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5', fontWeight: 600, fontSize: '13px', backgroundColor: 'rgba(127, 29, 29, 0.32)' }}>
            Map failed to load. Please refresh and try again.
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          style={{
            backgroundColor: '#d4af37',
            color: '#0f1419',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          🔍+ Zoom In
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          style={{
            backgroundColor: '#d4af37',
            color: '#0f1419',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          🔍− Zoom Out
        </button>
        <button
          onClick={resetMap}
          style={{
            backgroundColor: '#b8b8b8',
            color: '#0f1419',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          ↺ Reset
        </button>
        <button
          onClick={() => setShowLeadersOnly((prev) => !prev)}
          style={{
            backgroundColor: showLeadersOnly ? '#f59e0b' : '#1f2937',
            color: showLeadersOnly ? '#111827' : '#f3f4f6',
            padding: '8px 12px',
            borderRadius: '4px',
            border: showLeadersOnly ? 'none' : '1px solid rgba(148,163,184,0.45)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700'
          }}
        >
          {showLeadersOnly ? '👑 Leaders Only: ON' : '👑 Leaders Only'}
        </button>
      </div>

      {/* Info text */}
      <div style={{ marginTop: '12px', color: '#8b8b8b', fontSize: '12px', textAlign: 'center' }}>
        <p>Protomaps on-site basemap | Scroll to zoom | Drag to pan | Click geotags to focus members</p>
        <p style={{ marginTop: '4px' }}>
          <span style={{ color: packageColorMap['Starter'] }}>●</span> Starter
          {'  '}
          <span style={{ color: packageColorMap['Growth'] }}>●</span> Growth
          {'  '}
          <span style={{ color: packageColorMap['Pro'] }}>●</span> Pro
          {'  '}
          <span style={{ color: packageColorMap['Pro+'] }}>●</span> Pro+
        </p>
        <p style={{ marginTop: '4px', color: '#fbbf24' }}>👑 Crown badge and gold ring indicate cities with network leaders.</p>
        {selectedCity && <p style={{ marginTop: '4px', color: '#d4af37' }}>Focused city: {selectedCity}</p>}
        <p style={{ marginTop: '8px', fontSize: '10px', opacity: 0.5 }}>
          Map attribution:{' '}
          <a href="https://maplibre.org/" target="_blank" rel="noreferrer" style={{ color: '#9ca3af' }}>MapLibre</a>
          {' · '}
          <a href="https://protomaps.com/" target="_blank" rel="noreferrer" style={{ color: '#9ca3af' }}>Protomaps</a>
          {' · '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={{ color: '#9ca3af' }}>OpenStreetMap contributors</a>
        </p>
      </div>
    </div>
  )
}

export default function DashboardEnhancedPage() {
  const BUY_RATE = 1
  const SELL_RATE = 5
  const [selectedPackage, setSelectedPackage] = useState('packagec')
  const [userName, setUserName] = useState('')
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [isLoadingUsername, setIsLoadingUsername] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [cashBalance, setCashBalance] = useState(15000)
  const [aigCashBalance, setAigCashBalance] = useState(22000)
  const [monthlyTransferredToAig, setMonthlyTransferredToAig] = useState(0)
  const [overallAllocatedToAig, setOverallAllocatedToAig] = useState(0)
  const [exchangeAmount, setExchangeAmount] = useState(250)
  const [withdrawAmount, setWithdrawAmount] = useState(250)
  const [ecosystemInflowAmount, setEcosystemInflowAmount] = useState(500)
  const [ecosystemInflowType, setEcosystemInflowType] = useState<'Commission' | 'Bonus' | 'Transfer' | 'General Earnings' | 'Management Pool'>('Commission')
  const [exchangeMessage, setExchangeMessage] = useState('')
  const [investmentOptionAllocations, setInvestmentOptionAllocations] = useState<Record<string, number>>(
    () => Object.fromEntries(INVESTMENT_OPTIONS.map((option) => [option.id, 0]))
  )
  const [allocationOptionId, setAllocationOptionId] = useState(INVESTMENT_OPTIONS[0].id)
  const [allocationAmount, setAllocationAmount] = useState(250)
  const [allocationMessage, setAllocationMessage] = useState('')
  const [coinAnimationDirection, setCoinAnimationDirection] = useState<'cash-to-aig' | 'aig-to-cash' | null>(null)
  const [animationPulse, setAnimationPulse] = useState(0)
  const [giftCerts, setGiftCerts] = useState({ professional: 25, starter: 25 })
  const [userEmail, setUserEmail] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  
  // Network metrics
  const [networkMetrics] = useState({
    totalMembers: 127,
    newThisWeek: 12,
    newThisMonth: 45,
    weeklyCommissions: 2850,
    monthlyCommissions: 11200,
    commissionGrowth: [
      { month: 'Jan', value: 3200 },
      { month: 'Feb', value: 3800 },
      { month: 'Mar', value: 4500 },
      { month: 'Apr', value: 5200 },
      { month: 'May', value: 6100 },
      { month: 'Jun', value: 7500 },
      { month: 'Jul', value: 8200 },
      { month: 'Aug', value: 9100 },
      { month: 'Sep', value: 10200 },
      { month: 'Oct', value: 10800 },
      { month: 'Nov', value: 11000 },
      { month: 'Dec', value: 11200 }
    ],
    recruitmentGrowth: [
      { month: 'Jan', value: 5 },
      { month: 'Feb', value: 8 },
      { month: 'Mar', value: 12 },
      { month: 'Apr', value: 9 },
      { month: 'May', value: 15 },
      { month: 'Jun', value: 11 },
      { month: 'Jul', value: 14 },
      { month: 'Aug', value: 13 },
      { month: 'Sep', value: 16 },
      { month: 'Oct', value: 12 },
      { month: 'Nov', value: 10 },
      { month: 'Dec', value: 12 }
    ]
  })

  const [members] = useState(MEMBERS_DATA)
  const [activities, setActivities] = useState(ACTIVITIES_DATA)

  const currentPackage = useMemo(
    () => PACKAGES.find((pkg) => pkg.id === selectedPackage) ?? PACKAGES[0],
    [selectedPackage]
  )
  const investmentCapacity = useMemo(
    () => parseInvestmentCapacity(currentPackage.investmentCapacity),
    [currentPackage]
  )
  const withdrawableCash = useMemo(
    () => (investmentCapacity === null ? cashBalance : Math.max(cashBalance - investmentCapacity, 0)),
    [cashBalance, investmentCapacity]
  )
  const monthlyTransferRemaining = useMemo(
    () => (investmentCapacity === null ? null : Math.max(investmentCapacity - monthlyTransferredToAig, 0)),
    [investmentCapacity, monthlyTransferredToAig]
  )
  const overallAllocationRemaining = useMemo(
    () => (investmentCapacity === null ? null : Math.max(investmentCapacity - overallAllocatedToAig, 0)),
    [investmentCapacity, overallAllocatedToAig]
  )
  const lockedForInvestment = useMemo(
    () => (investmentCapacity === null ? 0 : Math.min(cashBalance, investmentCapacity)),
    [cashBalance, investmentCapacity]
  )
  const totalOptionAllocated = useMemo(
    () => Object.values(investmentOptionAllocations).reduce((sum, value) => sum + value, 0),
    [investmentOptionAllocations]
  )
  const unassignedAllocated = useMemo(
    () => Math.max(overallAllocatedToAig - totalOptionAllocated, 0),
    [overallAllocatedToAig, totalOptionAllocated]
  )
  const allocationOverflow = useMemo(
    () => Math.max(totalOptionAllocated - overallAllocatedToAig, 0),
    [totalOptionAllocated, overallAllocatedToAig]
  )

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]

  const apps = [
    { name: 'App Store', icon: '🛍️', url: '/toolkit' },
    { name: 'Investment Hub', icon: '💰', url: '/ecosystem/investments' },
    { name: 'Analytics', icon: '📊', url: '/ecosystem/analytics' },
    { name: 'World Domination Market', icon: '🌍', url: '/ecosystem/wdm' },
    { name: 'Toolkit', icon: '🧰', url: '/toolkit' },
    { name: 'Profile', icon: '👤', url: '/profile' },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedPackage = localStorage.getItem('userPackage')
    const savedCode = localStorage.getItem('userInvitationCode')

    setUserEmail(email || '')
    
    const isDemoAccount = email === 'mikko.antila@me.com'

    if (isDemoAccount) {
      if (!savedPackage) {
        setSelectedPackage('professional')
        localStorage.setItem('userPackage', 'professional')
      } else {
        const normalizedSavedPackage = normalizeDashboardPackageId(savedPackage)
        setSelectedPackage(normalizedSavedPackage)
        localStorage.setItem('userPackage', normalizedSavedPackage)
      }
      
      setCashBalance(15000)
      setGiftCerts({ professional: 25, starter: 25 })
      localStorage.setItem('userCash', '15000')
      localStorage.setItem('userAigCash', '22000')
      localStorage.setItem('monthlyTransferredToAig', '0')
      localStorage.setItem('overallAllocatedToAig', '0')
      localStorage.setItem('monthlyTransferPeriod', new Date().toISOString().slice(0, 7))
      localStorage.setItem('userInvestmentOptionAllocations', JSON.stringify(Object.fromEntries(INVESTMENT_OPTIONS.map((option) => [option.id, 0]))))
      localStorage.setItem('userGiftCerts', JSON.stringify({ professional: 25, starter: 25 }))
      setInvestmentOptionAllocations(Object.fromEntries(INVESTMENT_OPTIONS.map((option) => [option.id, 0])))
    } else {
      if (savedPackage) {
        const normalizedSavedPackage = normalizeDashboardPackageId(savedPackage)
        setSelectedPackage(normalizedSavedPackage)
        localStorage.setItem('userPackage', normalizedSavedPackage)
      }
      
      const savedCash = localStorage.getItem('userCash')
      const savedAigCash = localStorage.getItem('userAigCash')
      const savedMonthlyTransferred = localStorage.getItem('monthlyTransferredToAig')
      const savedOverallAllocated = localStorage.getItem('overallAllocatedToAig')
      const savedTransferPeriod = localStorage.getItem('monthlyTransferPeriod')
      const savedOptionAllocations = localStorage.getItem('userInvestmentOptionAllocations')
      const savedGiftCerts = localStorage.getItem('userGiftCerts')
      if (savedCash) setCashBalance(parseInt(savedCash))
      if (savedAigCash) setAigCashBalance(parseInt(savedAigCash))
      if (savedOverallAllocated) setOverallAllocatedToAig(parseInt(savedOverallAllocated))
      if (savedOptionAllocations) {
        try {
          const parsed = JSON.parse(savedOptionAllocations) as Record<string, unknown>
          const normalized = Object.fromEntries(
            INVESTMENT_OPTIONS.map((option) => {
              const rawValue = parsed?.[option.id]
              const numeric = typeof rawValue === 'number' ? rawValue : Number(rawValue)
              return [option.id, Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 0]
            })
          )
          setInvestmentOptionAllocations(normalized)
        } catch {
          setInvestmentOptionAllocations(Object.fromEntries(INVESTMENT_OPTIONS.map((option) => [option.id, 0])))
        }
      }
      const currentPeriod = new Date().toISOString().slice(0, 7)
      if (savedTransferPeriod === currentPeriod) {
        if (savedMonthlyTransferred) setMonthlyTransferredToAig(parseInt(savedMonthlyTransferred))
      } else {
        setMonthlyTransferredToAig(0)
        localStorage.setItem('monthlyTransferredToAig', '0')
        localStorage.setItem('monthlyTransferPeriod', currentPeriod)
      }
      if (savedGiftCerts) setGiftCerts(JSON.parse(savedGiftCerts))
    }
    
    if (!savedName) {
      setShowUsernameForm(true)
    } else {
      setUserName(savedName)
    }

    if (!savedCode) {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      setInvitationCode(newCode)
      localStorage.setItem('userInvitationCode', newCode)
    } else {
      setInvitationCode(savedCode)
    }
  }, [])

  const handlePackageSelect = (packageId: string) => {
    const normalizedPackage = normalizeDashboardPackageId(packageId)
    setSelectedPackage(normalizedPackage)
    localStorage.setItem('userPackage', normalizedPackage)

    const email = localStorage.getItem('userEmail')
    if (email) {
      void fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          packageId: normalizedPackage,
          userName: localStorage.getItem('userName') ?? undefined,
          userPassword: localStorage.getItem('userPassword') ?? undefined,
        }),
      })
    }
  }

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nicknameInput.trim()) return

    setIsLoadingUsername(true)
    setTimeout(() => {
      localStorage.setItem('userName', nicknameInput.trim())
      setUserName(nicknameInput.trim())
      setShowUsernameForm(false)
      setNicknameInput('')
      setIsLoadingUsername(false)
    }, 500)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {
      // Continue local logout even if cookie clearing fails.
    }

    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPackage')
    localStorage.removeItem('userInvitationCode')
    localStorage.removeItem('userAigCash')
    localStorage.removeItem('userPassword')
    localStorage.removeItem('monthlyTransferredToAig')
    localStorage.removeItem('overallAllocatedToAig')
    localStorage.removeItem('monthlyTransferPeriod')
      localStorage.removeItem('userInvestmentOptionAllocations')
    window.location.href = '/auth'
  }

  const appendActivity = (type: string, amount: number, description: string) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type,
      amount,
      balance: cashBalance,
      description,
    }
    setActivities((prev) => [newEntry, ...prev])
  }

  const triggerCoinAnimation = (direction: 'cash-to-aig' | 'aig-to-cash') => {
    setCoinAnimationDirection(direction)
    setAnimationPulse((prev) => prev + 1)
    setTimeout(() => setCoinAnimationDirection(null), 950)
  }

  const handleBuyAigCash = () => {
    if (exchangeAmount <= 0 || Number.isNaN(exchangeAmount)) {
      setExchangeMessage('Enter a valid EUR amount to convert.')
      return
    }
    if (exchangeAmount > cashBalance) {
      setExchangeMessage('Insufficient Cash Wallet balance for this conversion.')
      return
    }
    if (investmentCapacity !== null && monthlyTransferredToAig + exchangeAmount > investmentCapacity) {
      setExchangeMessage(
        `Monthly transfer cap reached. Package allows up to EUR ${investmentCapacity.toLocaleString('en-US')} from Cash to AIG Cash per month.`
      )
      return
    }
    if (investmentCapacity !== null && overallAllocatedToAig + exchangeAmount > investmentCapacity) {
      setExchangeMessage(
        `Overall ecosystem allocation cap reached. Your package total allocation limit is EUR ${investmentCapacity.toLocaleString('en-US')}.`
      )
      return
    }

    const aigConverted = exchangeAmount * BUY_RATE
    setCashBalance((prev) => prev - exchangeAmount)
    setAigCashBalance((prev) => prev + aigConverted)
    setMonthlyTransferredToAig((prev) => prev + exchangeAmount)
    setOverallAllocatedToAig((prev) => prev + exchangeAmount)
    setExchangeMessage(`Converted EUR ${exchangeAmount.toLocaleString('en-US')} into ${aigConverted.toLocaleString('en-US')} AIGC.`)
    appendActivity('Exchange Buy', -exchangeAmount, `Bought ${aigConverted.toLocaleString('en-US')} AIGC via AIG Cash Exchange`)
    triggerCoinAnimation('cash-to-aig')
  }

  const handleSellAigCash = () => {
    if (exchangeAmount <= 0 || Number.isNaN(exchangeAmount)) {
      setExchangeMessage('Enter a valid EUR amount to settle from AIG Cash.')
      return
    }

    const aigNeeded = exchangeAmount * SELL_RATE
    if (aigNeeded > aigCashBalance) {
      setExchangeMessage('Insufficient AIG Cash Wallet balance to sell through exchange.')
      return
    }

    setAigCashBalance((prev) => prev - aigNeeded)
    setCashBalance((prev) => prev + exchangeAmount)
    setOverallAllocatedToAig((prev) => Math.max(0, prev - exchangeAmount))
    setExchangeMessage(`Sold ${aigNeeded.toLocaleString('en-US')} AIGC through AIG Cash Exchange and settled EUR ${exchangeAmount.toLocaleString('en-US')} to Cash Wallet.`)
    appendActivity('Exchange Sell', exchangeAmount, `Sold ${aigNeeded.toLocaleString('en-US')} AIGC to settle EUR ${exchangeAmount.toLocaleString('en-US')} in Cash Wallet`)
    triggerCoinAnimation('aig-to-cash')
  }

  const handleEcosystemInflow = () => {
    if (ecosystemInflowAmount <= 0 || Number.isNaN(ecosystemInflowAmount)) {
      setExchangeMessage('Enter a valid inflow amount before applying auto-split.')
      return
    }

    const cashPortion = Math.round(ecosystemInflowAmount * 0.8)
    const aigPortion = ecosystemInflowAmount - cashPortion

    setCashBalance((prev) => prev + cashPortion)
    setAigCashBalance((prev) => prev + aigPortion)
    setExchangeMessage(`${ecosystemInflowType} auto-split complete: EUR ${cashPortion.toLocaleString('en-US')} to Cash Wallet and ${aigPortion.toLocaleString('en-US')} AIGC to AIG Cash Wallet (80/20 rule).`)
    appendActivity(ecosystemInflowType, ecosystemInflowAmount, `${ecosystemInflowType} inflow auto-split 80% cash / 20% AIG Cash`)
    triggerCoinAnimation('cash-to-aig')
  }

  const handleWithdrawFromCash = () => {
    if (withdrawAmount <= 0 || Number.isNaN(withdrawAmount)) {
      setExchangeMessage('Enter a valid withdrawal amount.')
      return
    }
    if (withdrawAmount > withdrawableCash) {
      setExchangeMessage(
        investmentCapacity === null
          ? 'Withdrawal amount exceeds available cash balance.'
          : `Withdrawal blocked. Cash Wallet must remain at or above investment capacity floor EUR ${investmentCapacity.toLocaleString('en-US')}.`
      )
      return
    }

    setCashBalance((prev) => prev - withdrawAmount)
    setExchangeMessage(`Withdrawal approved: EUR ${withdrawAmount.toLocaleString('en-US')} moved out of Cash Wallet while preserving investment-capacity floor.`)
    appendActivity('Withdrawal', -withdrawAmount, 'Cash withdrawal above investment-capacity floor')
  }

  const handleAllocateToOption = () => {
    if (allocationAmount <= 0 || Number.isNaN(allocationAmount)) {
      setAllocationMessage('Enter a valid allocation amount.')
      return
    }
    if (allocationAmount > unassignedAllocated) {
      setAllocationMessage(
        `Insufficient unassigned allocation. Available: EUR ${unassignedAllocated.toLocaleString('en-US')}.`
      )
      return
    }

    const option = INVESTMENT_OPTIONS.find((item) => item.id === allocationOptionId)
    setInvestmentOptionAllocations((prev) => ({
      ...prev,
      [allocationOptionId]: (prev[allocationOptionId] ?? 0) + allocationAmount,
    }))
    setAllocationMessage(
      `Allocated EUR ${allocationAmount.toLocaleString('en-US')} to ${option?.name ?? 'selected option'}.`
    )
    appendActivity('Allocation', -allocationAmount, `Allocated EUR ${allocationAmount.toLocaleString('en-US')} to ${option?.name ?? 'investment option'}`)
  }

  const handleReleaseFromOption = () => {
    if (allocationAmount <= 0 || Number.isNaN(allocationAmount)) {
      setAllocationMessage('Enter a valid release amount.')
      return
    }

    const currentOptionAllocation = investmentOptionAllocations[allocationOptionId] ?? 0
    if (allocationAmount > currentOptionAllocation) {
      setAllocationMessage(
        `Release exceeds allocated amount. ${allocationOptionId} currently holds EUR ${currentOptionAllocation.toLocaleString('en-US')}.`
      )
      return
    }

    const option = INVESTMENT_OPTIONS.find((item) => item.id === allocationOptionId)
    setInvestmentOptionAllocations((prev) => ({
      ...prev,
      [allocationOptionId]: Math.max((prev[allocationOptionId] ?? 0) - allocationAmount, 0),
    }))
    setAllocationMessage(
      `Released EUR ${allocationAmount.toLocaleString('en-US')} from ${option?.name ?? 'selected option'} back to unassigned allocation.`
    )
    appendActivity('Allocation Release', allocationAmount, `Released EUR ${allocationAmount.toLocaleString('en-US')} from ${option?.name ?? 'investment option'}`)
  }

  useEffect(() => {
    localStorage.setItem('userCash', String(cashBalance))
    localStorage.setItem('userAigCash', String(aigCashBalance))
    localStorage.setItem('monthlyTransferredToAig', String(monthlyTransferredToAig))
    localStorage.setItem('overallAllocatedToAig', String(overallAllocatedToAig))
    localStorage.setItem('monthlyTransferPeriod', new Date().toISOString().slice(0, 7))
  }, [cashBalance, aigCashBalance, monthlyTransferredToAig, overallAllocatedToAig])

  useEffect(() => {
    localStorage.setItem('userInvestmentOptionAllocations', JSON.stringify(investmentOptionAllocations))
  }, [investmentOptionAllocations])

  return (
    <div
      style={{
        background: '#0f1419',
        backgroundImage: 'linear-gradient(rgba(15, 20, 25, 0.85), rgba(15, 20, 25, 0.85)), url(/images/WhatsApp%20Image%202026-06-10%20at%2013.27.50.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#f0f0f0'
      }}
      className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Nickname Selection Form */}
        {showUsernameForm && (
          <div
            style={{
              backgroundColor: 'rgba(61, 44, 53, 0.7)',
              borderColor: '#b8b8b8'
            }}
            className="border rounded-lg p-8 mb-12 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#b8b8b8' }}>
              Welcome! Let's Set Your Nickname
            </h2>
            <form onSubmit={handleSaveNickname}>
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: '#c0c0c0' }}>
                  Choose a Nickname
                </label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="e.g., Mikko"
                  style={{ backgroundColor: 'rgba(26, 15, 21, 0.8)' }}
                  className="w-full px-4 py-3 border rounded-lg text-[#f0f0f0] placeholder-[#c0c0c0]/50 focus:outline-none focus:ring-2 focus:ring-[#b8b8b8]"
                  maxLength={20}
                  required
                />
                <p style={{ color: '#c0c0c0' }} className="text-xs mt-2">
                  {nicknameInput.length}/20 characters
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoadingUsername || !nicknameInput.trim()}
                style={{
                  backgroundColor: '#b8b8b8',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoadingUsername ? 'Saving...' : 'Set Nickname & Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Main Dashboard Content */}
        {!showUsernameForm && (
          <>
            {/* SIMPLE HERO - Clean TribeWin Style with Logo and Welcome */}
            <div className="mb-12 flex items-center gap-6">
              {/* Welcome Text */}
              <div>
                <h1 className="text-5xl font-bold mb-2" style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
                  Welcome, <span style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>{userName}</span>
                </h1>
                <p style={{ color: '#8b8b8b' }} className="text-lg">
                  Your AIGINVEST network is thriving
                </p>
              </div>
            </div>

            {/* Navigation Bar - TribeWin Style Header */}
            <div style={{ marginBottom: '20px' }}>
              <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: `1px solid rgba(184, 184, 184, 0.2)` }}>
                <div className="flex items-center gap-4">
                  <div ref={languageMenuRef} className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      style={{
                        backgroundColor: 'rgba(184, 184, 184, 0.1)',
                        borderColor: '#b8b8b8'
                      }}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-[#b8b8b8]/20 transition text-sm font-medium"
                    >
                      <Globe size={16} />
                      {languages.find(l => l.code === selectedLanguage)?.flag} {selectedLanguage.toUpperCase()}
                      <ChevronDown size={14} />
                    </button>

                    {showLanguageMenu && (
                      <div
                        style={{
                          backgroundColor: 'rgba(26, 15, 21, 0.95)',
                          borderColor: '#b8b8b8'
                        }}
                        className="absolute top-full mt-2 right-0 border rounded-lg shadow-2xl min-w-max z-50"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code)
                              setShowLanguageMenu(false)
                            }}
                            style={{
                              backgroundColor: selectedLanguage === lang.code ? 'rgba(184, 184, 184, 0.15)' : 'transparent'
                            }}
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#b8b8b8]/10 transition border-b border-[#b8b8b8]/10 last:border-b-0 text-sm"
                          >
                            <span>{lang.flag}</span>
                            <span style={{ color: '#c0c0c0' }}>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div ref={accountMenuRef} className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      style={{
                        backgroundColor: 'rgba(184, 184, 184, 0.1)',
                        borderColor: '#b8b8b8',
                        color: '#b8b8b8'
                      }}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-[#b8b8b8]/20 transition text-sm font-medium"
                    >
                      <User size={16} />
                      {userName}
                      <ChevronDown size={14} />
                    </button>

                    {showAccountMenu && (
                      <div
                        style={{
                          backgroundColor: 'rgba(26, 15, 21, 0.95)',
                          borderColor: '#b8b8b8'
                        }}
                        className="absolute top-full mt-2 right-0 border rounded-lg shadow-2xl min-w-56 z-50"
                      >
                        <div style={{ borderBottomColor: '#b8b8b8' }} className="border-b px-4 py-3">
                          <p style={{ color: '#b8b8b8' }} className="text-xs font-semibold">ACCOUNT</p>
                          <p style={{ color: '#c0c0c0' }} className="text-sm mt-1">{userName}</p>
                        </div>

                        <a href="/profile" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <User size={16} style={{ color: '#2563eb' }} />
                          <span style={{ color: '#c0c0c0' }}>Profile</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <Wallet size={16} style={{ color: '#6b7280' }} />
                          <span style={{ color: '#c0c0c0' }}>Wallets</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <History size={16} style={{ color: '#9ca3af' }} />
                          <span style={{ color: '#c0c0c0' }}>Account History</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <Gift size={16} style={{ color: '#707070' }} />
                          <span style={{ color: '#c0c0c0' }}>Private Gift Cards</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <Headphones size={16} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#c0c0c0' }}>Support</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <MessageCircle size={16} style={{ color: '#06b6d4' }} />
                          <span style={{ color: '#c0c0c0' }}>Ask Diana</span>
                        </a>

                        <a href="/ecosystem/wdm" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <Map size={16} style={{ color: '#b8b8b8' }} />
                          <span style={{ color: '#c0c0c0' }}>World Domination Market</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#b8b8b8/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition border-b text-sm">
                          <Users size={16} style={{ color: '#2563eb' }} />
                          <span style={{ color: '#c0c0c0' }}>My Network</span>
                        </a>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#b8b8b8]/10 transition text-sm text-left"
                        >
                          <LogOut size={16} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#c0c0c0' }}>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* App Links */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {apps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    style={{
                      backgroundColor: 'rgba(184, 184, 184, 0.08)',
                      borderColor: '#b8b8b8'
                    }}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-[#b8b8b8]/20 transition text-sm font-medium whitespace-nowrap"
                  >
                    <span>{app.icon}</span>
                    <span style={{ color: '#c0c0c0' }}>{app.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* MUSIC PLAYER SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                position: 'relative',
                zIndex: 80,
                paddingTop: '20cm',
                marginBottom: '-0.5cm'
              }}
              className="gap-4"
            >
              <DashboardMusicPlayer />
            </div>

            {/* WALLET SECTION - Cash + AIG Cash Exchange */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
                <div
                  style={{
                    border: '2px solid #d4af37',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.3)',
                    width: '100%',
                    maxWidth: '1000px',
                    minHeight: '240px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 1.15fr) minmax(220px, 1fr)',
                    gap: '12px',
                    padding: '14px'
                  }}
                  className="backdrop-blur-sm hover:border-opacity-80 transition-all duration-300"
                >
                  {/* Cash Wallet */}
                  <div style={{ border: '1px solid rgba(184,184,184,0.25)', borderRadius: '10px', backgroundColor: 'rgba(26,15,21,0.45)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)' }} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <div style={{ color: '#6b7280', fontSize: '16px' }}>€</div>
                        </div>
                        <p style={{ color: '#c0c0c0' }} className="text-xs font-bold tracking-wide">CASH WALLET (FIAT)</p>
                      </div>
                      <p className="text-3xl font-bold mb-2" style={{ color: '#d4af37' }} suppressHydrationWarning>
                        €{cashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                      <p style={{ color: '#8b8b8b' }} className="text-xs">Source for buying AIG Cash tokens and receiving 80% of inflows</p>
                      <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px' }} suppressHydrationWarning>
                        Monthly Cash → AIG Cash cap: {investmentCapacity === null ? 'Unlimited (Professional)' : `EUR ${investmentCapacity.toLocaleString('en-US')}`}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }} suppressHydrationWarning>
                        This month used: EUR {monthlyTransferredToAig.toLocaleString('en-US')} | Remaining: {monthlyTransferRemaining === null ? 'Unlimited' : `EUR ${monthlyTransferRemaining.toLocaleString('en-US')}`}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }} suppressHydrationWarning>
                        Overall ecosystem allocation: {overallAllocationRemaining === null ? 'Unlimited' : `EUR ${overallAllocatedToAig.toLocaleString('en-US')} / EUR ${investmentCapacity?.toLocaleString('en-US')}`}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }} suppressHydrationWarning>
                        Locked: EUR {lockedForInvestment.toLocaleString('en-US')} | Withdrawable: EUR {withdrawableCash.toLocaleString('en-US')}
                      </p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          min={1}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                          style={{
                            width: '110px',
                            backgroundColor: 'rgba(26,15,21,0.8)',
                            border: '1px solid rgba(184,184,184,0.35)',
                            color: '#f0f0f0',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '12px'
                          }}
                        />
                        <button
                          onClick={handleWithdrawFromCash}
                          disabled={withdrawableCash <= 0}
                          style={{
                            backgroundColor: withdrawableCash > 0 ? 'rgba(107,114,128,0.9)' : 'rgba(107,114,128,0.35)',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            opacity: withdrawableCash > 0 ? 1 : 0.5,
                          }}
                        >
                          Withdraw EUR
                        </button>
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 600, marginTop: '6px' }}>
                        {investmentCapacity === null
                          ? 'Professional package: no investment-capacity withdrawal restriction on Cash Wallet.'
                          : 'Fiat can be withdrawn only when Cash Wallet exceeds your package investment capacity.'}
                      </div>
                    </div>
                  </div>

                  {/* AIG Cash Exchange */}
                  <div style={{ border: '1px solid rgba(212,175,55,0.35)', borderRadius: '10px', backgroundColor: 'rgba(15,20,25,0.55)', padding: '16px', position: 'relative' }}>
                    <div className="text-center">
                      <p style={{ color: '#d4af37' }} className="text-xs font-bold tracking-wide">AIG CASH EXCHANGE</p>
                      <p style={{ color: '#8b8b8b' }} className="text-xs mt-1">Only route for Cash Wallet ⇄ AIG Cash Wallet transfers</p>
                    </div>

                    <div style={{ marginTop: '10px', position: 'relative', height: '28px', borderRadius: '999px', border: '1px solid rgba(184,184,184,0.25)', backgroundColor: 'rgba(184,184,184,0.07)', overflow: 'hidden' }}>
                      {[0, 1, 2, 3, 4, 5].map((coin) => {
                        const baseLeft = coinAnimationDirection === 'aig-to-cash' ? 260 : -22
                        const targetLeft = coinAnimationDirection === 'aig-to-cash' ? -22 : 260
                        return (
                          <span
                            key={`${animationPulse}-${coin}`}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              left: `${baseLeft}px`,
                              fontSize: '16px',
                              opacity: coinAnimationDirection ? 1 : 0,
                              transition: `left 820ms cubic-bezier(0.25, 0.9, 0.3, 1), opacity 180ms ease`,
                              transitionDelay: `${coin * 70}ms`,
                              pointerEvents: 'none',
                            }}
                            ref={(el) => {
                              if (el && coinAnimationDirection) {
                                requestAnimationFrame(() => {
                                  el.style.left = `${targetLeft}px`
                                })
                              }
                            }}
                          >
                            🪙
                          </span>
                        )
                      })}
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <label style={{ color: '#c0c0c0', fontSize: '11px', fontWeight: 600 }}>EUR Order</label>
                      <input
                        type="number"
                        min={1}
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(Number(e.target.value))}
                        style={{
                          width: '130px',
                          backgroundColor: 'rgba(26,15,21,0.8)',
                          border: '1px solid rgba(184,184,184,0.35)',
                          color: '#f0f0f0',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '12px'
                        }}
                      />
                    </div>

                    <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '7px', textAlign: 'center' }}>
                      Buy rate (Cash to AIG Cash): 1 EUR = {BUY_RATE} AIGC (fixed) | Sell reference: 1 EUR = {SELL_RATE} AIGC
                    </p>

                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={handleBuyAigCash}
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.22)', border: '1px solid rgba(16,185,129,0.55)', color: '#2d7c5f', borderRadius: '6px', padding: '8px', fontSize: '11px', fontWeight: 700 }}
                      >
                        Buy AIG Cash
                      </button>
                      <button
                        onClick={handleSellAigCash}
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59,130,246,0.5)', color: '#2563eb', borderRadius: '6px', padding: '8px', fontSize: '11px', fontWeight: 700 }}
                      >
                        Sell To Cash
                      </button>
                    </div>

                    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(184,184,184,0.18)', paddingTop: '10px' }}>
                      <p style={{ color: '#d4af37', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                        Auto-Split Rule: Commission / Bonus / Ecosystem Transfer / General Earnings / Management Pool = 80% Cash + 20% AIG Cash
                      </p>
                      <div style={{ marginTop: '7px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <select
                          value={ecosystemInflowType}
                          onChange={(e) => setEcosystemInflowType(e.target.value as 'Commission' | 'Bonus' | 'Transfer' | 'General Earnings' | 'Management Pool')}
                          style={{
                            backgroundColor: 'rgba(26,15,21,0.8)',
                            border: '1px solid rgba(184,184,184,0.35)',
                            color: '#f0f0f0',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '11px'
                          }}
                        >
                          <option value="Commission">Commission</option>
                          <option value="Bonus">Bonus</option>
                          <option value="Transfer">Ecosystem Transfer</option>
                          <option value="General Earnings">General Earnings</option>
                          <option value="Management Pool">Management Pool Earnings</option>
                        </select>
                        <input
                          type="number"
                          min={1}
                          value={ecosystemInflowAmount}
                          onChange={(e) => setEcosystemInflowAmount(Number(e.target.value))}
                          style={{
                            backgroundColor: 'rgba(26,15,21,0.8)',
                            border: '1px solid rgba(184,184,184,0.35)',
                            color: '#f0f0f0',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '11px'
                          }}
                        />
                      </div>
                      <button
                        onClick={handleEcosystemInflow}
                        style={{
                          marginTop: '7px',
                          width: '100%',
                          backgroundColor: 'rgba(212, 175, 55, 0.2)',
                          border: '1px solid rgba(212,175,55,0.55)',
                          color: '#d4af37',
                          borderRadius: '6px',
                          padding: '7px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        Apply 80/20 Auto-Split
                      </button>
                    </div>

                    <p style={{ color: '#c0c0c0', fontSize: '11px', marginTop: '9px', textAlign: 'center', minHeight: '16px' }}>{exchangeMessage}</p>

                    <p style={{ color: '#8b8b8b', fontSize: '10px', textAlign: 'center' }}>
                      AIG Cash cannot be moved directly to fiat. 80/20 flow and exchange conversion keep WDM active with AIG Cash as the operating currency.
                    </p>
                  </div>

                  {/* AIG Cash Wallet */}
                  <div style={{ border: '1px solid rgba(184,184,184,0.25)', borderRadius: '10px', backgroundColor: 'rgba(26,15,21,0.45)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-2" style={{ justifyContent: 'flex-start' }}>
                        <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)' }} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                          <div style={{ color: '#2563eb', fontSize: '16px' }}>🟡</div>
                        </div>
                        <p style={{ color: '#c0c0c0' }} className="text-xs font-bold tracking-wide">AIG CASH WALLET</p>
                      </div>
                      <p className="text-3xl font-bold mb-2" style={{ color: '#d4af37' }} suppressHydrationWarning>
                        {aigCashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} AIGC
                      </p>
                      <p style={{ color: '#8b8b8b' }} className="text-xs">Used for all ecosystem purchases and settlements</p>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 600 }}>Spending wallet for ecosystem services, packages, and marketplace orders.</div>
                  </div>
                </div>
            </div>

            {/* INVESTMENT OPTIONS ALLOCATION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-2">
                  Investment Options Allocation
                </h2>
                <p style={{ color: '#9ca3af' }} className="text-sm mb-4">
                  Allocate your existing ecosystem allocation pool across active options. This does not bypass monthly or overall package limits.
                </p>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div style={{ border: '1px solid rgba(184,184,184,0.25)', borderRadius: '10px', padding: '12px', backgroundColor: 'rgba(15,20,25,0.5)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '11px' }}>Overall Allocated</p>
                    <p style={{ color: '#d4af37', fontWeight: 700, fontSize: '18px' }}>EUR {overallAllocatedToAig.toLocaleString('en-US')}</p>
                  </div>
                  <div style={{ border: '1px solid rgba(184,184,184,0.25)', borderRadius: '10px', padding: '12px', backgroundColor: 'rgba(15,20,25,0.5)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '11px' }}>Assigned To Options</p>
                    <p style={{ color: '#c0c0c0', fontWeight: 700, fontSize: '18px' }}>EUR {totalOptionAllocated.toLocaleString('en-US')}</p>
                  </div>
                  <div style={{ border: '1px solid rgba(184,184,184,0.25)', borderRadius: '10px', padding: '12px', backgroundColor: 'rgba(15,20,25,0.5)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '11px' }}>Unassigned Allocation</p>
                    <p style={{ color: unassignedAllocated > 0 ? '#10b981' : '#c0c0c0', fontWeight: 700, fontSize: '18px' }}>
                      EUR {unassignedAllocated.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>

                <div style={{ border: '1px solid rgba(184,184,184,0.2)', borderRadius: '10px', padding: '12px', backgroundColor: 'rgba(15,20,25,0.55)' }}>
                  <div className="grid md:grid-cols-[1fr_150px_auto_auto] gap-2 items-center">
                    <select
                      value={allocationOptionId}
                      onChange={(e) => setAllocationOptionId(e.target.value)}
                      style={{
                        backgroundColor: 'rgba(26,15,21,0.8)',
                        border: '1px solid rgba(184,184,184,0.35)',
                        color: '#f0f0f0',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '12px'
                      }}
                    >
                      {INVESTMENT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={allocationAmount}
                      onChange={(e) => setAllocationAmount(Number(e.target.value))}
                      style={{
                        backgroundColor: 'rgba(26,15,21,0.8)',
                        border: '1px solid rgba(184,184,184,0.35)',
                        color: '#f0f0f0',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '12px'
                      }}
                    />
                    <button
                      onClick={handleAllocateToOption}
                      disabled={unassignedAllocated <= 0}
                      style={{
                        backgroundColor: unassignedAllocated > 0 ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.55)',
                        color: '#2d7c5f',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        opacity: unassignedAllocated > 0 ? 1 : 0.5
                      }}
                    >
                      Allocate
                    </button>
                    <button
                      onClick={handleReleaseFromOption}
                      style={{
                        backgroundColor: 'rgba(59,130,246,0.2)',
                        border: '1px solid rgba(59,130,246,0.5)',
                        color: '#2563eb',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      Release
                    </button>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px' }}>
                    {investmentCapacity === null
                      ? 'Professional plan: overall package allocation cap is unlimited, while monthly transfer usage still tracks policy telemetry.'
                      : `Package cap: EUR ${investmentCapacity.toLocaleString('en-US')} total overall allocation.`}
                  </p>
                  <p style={{ color: '#c0c0c0', fontSize: '11px', marginTop: '4px', minHeight: '16px' }}>{allocationMessage}</p>
                </div>

                {allocationOverflow > 0 && (
                  <div style={{ marginTop: '10px', border: '1px solid rgba(239,68,68,0.5)', backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: '8px', padding: '10px' }}>
                    <p style={{ color: '#fca5a5', fontSize: '11px', fontWeight: 700 }}>
                      Allocated options exceed current overall allocation by EUR {allocationOverflow.toLocaleString('en-US')}. Release some option allocation or increase allocation pool through Cash → AIG Cash transfer.
                    </p>
                  </div>
                )}

                <div className="mt-4 grid md:grid-cols-2 gap-3">
                  {INVESTMENT_OPTIONS.map((option) => {
                    const value = investmentOptionAllocations[option.id] ?? 0
                    const allocationShare = overallAllocatedToAig > 0 ? (value / overallAllocatedToAig) * 100 : 0
                    return (
                      <div
                        key={option.id}
                        style={{ border: '1px solid rgba(184,184,184,0.22)', borderRadius: '10px', padding: '12px', backgroundColor: 'rgba(26,15,21,0.45)' }}
                      >
                        <p style={{ color: '#d4af37', fontSize: '13px', fontWeight: 700 }}>{option.name}</p>
                        <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '3px' }}>{option.description}</p>
                        <p style={{ color: '#c0c0c0', fontSize: '12px', marginTop: '8px' }}>
                          Assigned: EUR {value.toLocaleString('en-US')} ({allocationShare.toFixed(1)}% of overall allocation)
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* NETWORK ANALYTICS - Clean Table */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6">My Network</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottomColor: '#b8b8b8', backgroundColor: 'rgba(184, 184, 184, 0.05)' }} className="border-b">
                      <th style={{ color: '#b8b8b8' }} className="text-left py-3 px-4 font-bold text-xs">Member</th>
                      <th style={{ color: '#b8b8b8' }} className="text-center py-3 px-4 font-bold text-xs">Level</th>
                      <th style={{ color: '#b8b8b8' }} className="text-center py-3 px-4 font-bold text-xs">Status</th>
                      <th style={{ color: '#b8b8b8' }} className="text-right py-3 px-4 font-bold text-xs">Direct</th>
                      <th style={{ color: '#b8b8b8' }} className="text-right py-3 px-4 font-bold text-xs">Network</th>
                      <th style={{ color: '#b8b8b8' }} className="text-right py-3 px-4 font-bold text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        style={{
                          borderBottomColor: 'rgba(184, 184, 184, 0.1)'
                        }}
                        className="border-b hover:bg-[#b8b8b8]/5 transition"
                      >
                        <td style={{ color: '#f0f0f0' }} className="py-3 px-4 font-medium text-sm">
                          {member.name}
                        </td>
                        <td style={{ color: '#c0c0c0' }} className="py-3 px-4 text-center text-xs">
                          L{member.circle}
                        </td>
                        <td style={{ color: '#c0c0c0' }} className="py-3 px-4 text-center">
                          <span
                            style={{
                              backgroundColor: member.status === 'Active'
                                ? 'rgba(107, 114, 128, 0.15)'
                                : 'rgba(107, 114, 128, 0.15)',
                              color: member.status === 'Active' ? '#6b7280' : '#9ca3af'
                            }}
                            className="px-2 py-1 rounded text-xs font-bold"
                          >
                            {member.status === 'Active' ? '✓' : '○'}
                          </span>
                        </td>
                        <td style={{ color: '#6b7280' }} className="py-3 px-4 text-right font-bold text-xs">
                          €{member.directEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ color: '#2563eb' }} className="py-3 px-4 text-right font-bold text-xs">
                          €{member.networkEarnings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ color: '#b8b8b8' }} className="py-3 px-4 text-right font-bold text-xs">
                          €{(member.directEarnings + member.networkEarnings).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>

            {/* ACTIVITY LEDGER - Clean */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6">Recent Activity</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottomColor: '#b8b8b8', backgroundColor: 'rgba(184, 184, 184, 0.05)' }} className="border-b">
                      <th style={{ color: '#b8b8b8' }} className="text-left py-3 px-4 font-bold text-xs">Date</th>
                      <th style={{ color: '#b8b8b8' }} className="text-left py-3 px-4 font-bold text-xs">Type</th>
                      <th style={{ color: '#b8b8b8' }} className="text-left py-3 px-4 font-bold text-xs">Description</th>
                      <th style={{ color: '#b8b8b8' }} className="text-right py-3 px-4 font-bold text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr
                        key={activity.id}
                        style={{
                          border: '1px solid #d4af37',
                          backgroundColor: 'rgba(212, 175, 55, 0.05)',
                          boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)',
                          borderRadius: '6px'
                        }}
                        className="hover:bg-[#d4af37]/10 transition mb-2"
                      >
                        <td style={{ color: '#c0c0c0' }} className="py-3 px-4 text-xs font-medium">
                          {activity.date}
                        </td>
                        <td style={{ color: '#c0c0c0' }} className="py-3 px-4">
                          <span
                            style={{
                              backgroundColor:
                                activity.type === 'Commission'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : activity.type === 'Withdrawal'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : activity.type === 'Bonus'
                                  ? 'rgba(168, 85, 247, 0.15)'
                                  : 'rgba(59, 130, 246, 0.15)',
                              color:
                                activity.type === 'Commission'
                                  ? '#2d7c5f'
                                  : activity.type === 'Withdrawal'
                                  ? '#ef4444'
                                  : activity.type === 'Bonus'
                                  ? '#1e3a8a'
                                  : '#2563eb'
                            }}
                            className="px-2 py-1 rounded text-xs font-bold"
                          >
                            {activity.type}
                          </span>
                        </td>
                        <td style={{ color: '#c0c0c0' }} className="py-2 px-3 text-xs">
                          {activity.description}
                        </td>
                        <td
                          style={{
                            color: activity.amount < 0 ? '#ef4444' : '#2d7c5f'
                          }}
                          className="py-2 px-3 text-right font-bold text-xs"
                        >
                          {activity.amount > 0 ? '+' : ''}€{activity.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>

            {/* ANALYTICS & PERFORMANCE GRAPHS SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={24} /> Network Growth Analytics
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Growth Line Chart */}
                  <div className="flex flex-col items-center">
                    <h3 style={{ color: '#c0c0c0' }} className="text-sm font-semibold mb-4">Monthly Growth</h3>
                    <div style={{ width: '100%', height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                        {/* Grid lines */}
                        {[0, 50, 100, 150, 200].map((y) => (
                          <line key={`grid-${y}`} x1="40" y1={y} x2="380" y2={y} stroke="#b8b8b8" strokeWidth="0.5" opacity="0.2" />
                        ))}
                        
                        {/* Y-axis */}
                        <line x1="40" y1="0" x2="40" y2="200" stroke="#b8b8b8" strokeWidth="1" opacity="0.5" />
                        
                        {/* X-axis */}
                        <line x1="40" y1="200" x2="380" y2="200" stroke="#b8b8b8" strokeWidth="1" opacity="0.5" />
                        
                        {/* Y-axis labels */}
                        <text x="35" y="205" textAnchor="end" style={{ fontSize: '10px', fill: '#8b8b8b' }}>0%</text>
                        <text x="35" y="155" textAnchor="end" style={{ fontSize: '10px', fill: '#8b8b8b' }}>25%</text>
                        <text x="35" y="105" textAnchor="end" style={{ fontSize: '10px', fill: '#8b8b8b' }}>50%</text>
                        <text x="35" y="55" textAnchor="end" style={{ fontSize: '10px', fill: '#8b8b8b' }}>75%</text>
                        <text x="35" y="5" textAnchor="end" style={{ fontSize: '10px', fill: '#8b8b8b' }}>100%</text>
                        
                        {/* Line chart data: [40, 55, 45, 70, 60, 80, 75] */}
                        {/* Calculate path */}
                        <polyline
                          points="55,160 105,110 155,130 205,60 255,80 305,40 355,65"
                          fill="none"
                          stroke="#b8b8b8"
                          strokeWidth="2.5"
                          opacity="0.8"
                        />
                        
                        {/* Data points */}
                        {[40, 55, 45, 70, 60, 80, 75].map((val, i) => {
                          const x = 55 + i * 50;
                          const y = 200 - (val * 1.6);
                          return (
                            <circle
                              key={`point-${i}`}
                              cx={x}
                              cy={y}
                              r="3.5"
                              fill="#d4af37"
                              opacity="0.9"
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        })}
                        
                        {/* X-axis labels (months) */}
                        {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'].map((label, i) => (
                          <text
                            key={`label-${i}`}
                            x={55 + i * 50}
                            y="215"
                            textAnchor="middle"
                            style={{ fontSize: '10px', fill: '#8b8b8b' }}
                          >
                            {label}
                          </text>
                        ))}
                      </svg>
                    </div>
                    <div style={{ color: '#8b8b8b', marginTop: '8px' }} className="text-xs">Last 7 Months</div>
                  </div>

                  {/* Commission Breakdown */}
                  <div
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.04)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      boxShadow: '0 0 14px rgba(212, 175, 55, 0.18)'
                    }}
                    className="flex flex-col items-center rounded-lg p-4"
                  >
                    <h3 style={{ color: '#c0c0c0' }} className="text-sm font-semibold mb-4">Commission Breakdown</h3>
                    <div style={{ width: '100%', height: '200px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="rgba(184, 184, 184, 0.15)" stroke="#b8b8b8" strokeWidth="2" />
                        {/* Own Production: 35% (green) - 122.5 degrees */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#2d7c5f" strokeWidth="30" strokeDasharray="76.97 219.8" strokeLinecap="round" />
                        {/* 1st Level: 40% (blue) - 140 degrees */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#2563eb" strokeWidth="30" strokeDasharray="87.92 219.8" strokeDashoffset="-76.97" strokeLinecap="round" />
                        {/* Rest of Organization: 25% (amber) - 87.5 degrees */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#d4af37" strokeWidth="30" strokeDasharray="54.95 219.8" strokeDashoffset="-164.89" strokeLinecap="round" />
                        <text x="100" y="110" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', fill: '#b8b8b8' }}>€11.2K</text>
                      </svg>
                    </div>
                    <div style={{ color: '#8b8b8b', marginTop: '12px', fontSize: '12px', width: '100%', textAlign: 'left' }}>
                      <div style={{ marginBottom: '6px' }}><span style={{ color: '#2d7c5f', fontWeight: 'bold' }}>●</span> Own Production: €3.9K (35%)</div>
                      <div style={{ marginBottom: '6px' }}><span style={{ color: '#2563eb', fontWeight: 'bold' }}>●</span> 1st Level Commissions: €4.5K (40%)</div>
                      <div><span style={{ color: '#d4af37', fontWeight: 'bold' }}>●</span> Rest of Organization: €2.8K (25%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WORLD MAP SECTION - INTERACTIVE */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <InteractiveWorldMap />
            </div>

            {/* MONTHLY INCOME GROWTH SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={24} /> Monthly Commission Growth
                </h2>

                <div style={{ width: '100%', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px', padding: '20px', minHeight: '350px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', border: '1px solid rgba(212, 175, 55, 0.2)', position: 'relative' }}>
                  {/* Y-axis scale */}
                  <div style={{ position: 'absolute', left: '0', top: '0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#8b8b8b', paddingRight: '5px', paddingTop: '10px', paddingBottom: '30px' }}>
                    <span>€12,000</span>
                    <span>€9,000</span>
                    <span>€6,000</span>
                    <span>€3,000</span>
                    <span>€0</span>
                  </div>

                  {/* Chart area */}
                  <svg style={{ width: 'calc(100% - 40px)', height: '300px', marginLeft: '40px' }} viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={`grid-${i}`} x1="0" y1={i * 75} x2="1200" y2={i * 75} stroke="#d4af37" strokeWidth="0.5" opacity="0.1" />
                    ))}

                    {/* Line chart path */}
                    {(() => {
                      const data = networkMetrics.commissionGrowth
                      const maxValue = 12000
                      const points = data.map((item, idx) => {
                        const x = (idx / (data.length - 1)) * 1200
                        const y = 300 - (item.value / maxValue) * 280
                        return { x, y, ...item }
                      })

                      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                      return (
                        <>
                          {/* Line */}
                          <path d={pathD} stroke="#d4af37" strokeWidth="3" fill="none" opacity="0.8" style={{ filter: 'drop-shadow(0 0 8px #d4af37)' }} />
                          
                          {/* Area under line */}
                          <path d={`${pathD} L 1200 300 L 0 300 Z`} fill="#d4af37" opacity="0.08" />

                          {/* Data points */}
                          {points.map((p, i) => (
                            <g key={`point-${i}`}>
                              <circle cx={p.x} cy={p.y} r="5" fill="#d4af37" opacity="0.8" />
                              <circle cx={p.x} cy={p.y} r="8" fill="#d4af37" opacity="0.3" />
                            </g>
                          ))}
                        </>
                      )
                    })()}

                    {/* X-axis labels */}
                    {networkMetrics.commissionGrowth.map((item, idx) => (
                      <text
                        key={`label-${idx}`}
                        x={(idx / (networkMetrics.commissionGrowth.length - 1)) * 1200}
                        y="290"
                        textAnchor="middle"
                        style={{ fontSize: '11px', fill: '#c0c0c0' }}
                      >
                        {item.month}
                      </text>
                    ))}
                  </svg>
                </div>

                {/* Stats */}
                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: '#8b8b8b' }}>Starting</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d4af37' }}>€3,200</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: '#8b8b8b' }}>Current</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d4af37' }}>€11,200</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: '#8b8b8b' }}>Growth</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>+250%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* GIFT CERTIFICATES SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  borderColor: '#b8b8b8',
                  border: '1px solid',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Gift size={24} /> Gift Certificates & Rewards
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Professional Package */}
                  <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: '#1e3a8a', border: '2px solid', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ color: '#1e3a8a', fontSize: '28px', fontWeight: 'bold' }}>25</div>
                    <div style={{ color: '#b8b8b8', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>Professional Package</div>
                    <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '8px' }}>Available to Share</div>
                    <button style={{ backgroundColor: '#1e3a8a', color: '#f0f0f0', marginTop: '12px', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', width: '100%' }}>
                      Share Certificate
                    </button>
                  </div>

                  {/* Starter Package */}
                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#2563eb', border: '2px solid', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ color: '#2563eb', fontSize: '28px', fontWeight: 'bold' }}>15</div>
                    <div style={{ color: '#b8b8b8', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>Starter Package</div>
                    <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '8px' }}>Available to Share</div>
                    <button style={{ backgroundColor: '#2563eb', color: '#f0f0f0', marginTop: '12px', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', width: '100%' }}>
                      Share Certificate
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#2d7c5f', border: '1px solid', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ color: '#2d7c5f', fontSize: '12px', fontWeight: '600' }}>💡 Tip: Share gift certificates with prospects to convert them into active members</div>
                </div>
              </div>
            </div>

            {/* INVITATION CODE & DIRECT SHARING */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  borderColor: '#b8b8b8',
                  border: '1px solid',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText size={24} /> Invitation Code & Direct Link
                </h2>
                
                <div className="space-y-4">
                  {/* Invitation Code */}
                  <div>
                    <label style={{ color: '#c0c0c0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Your Personal Invitation Code</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value="AIG-USER-K4X9M2P"
                        readOnly
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(184, 184, 184, 0.05)',
                          borderColor: '#b8b8b8',
                          border: '1px solid',
                          borderRadius: '6px',
                          padding: '10px',
                          color: '#b8b8b8',
                          fontFamily: 'monospace',
                          fontWeight: 'bold'
                        }}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('AIG-USER-K4X9M2P')
                          setCopiedCode(true)
                          setTimeout(() => setCopiedCode(false), 2000)
                        }}
                        style={{
                          backgroundColor: '#b8b8b8',
                          color: '#0f1419',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Copy size={16} /> {copiedCode ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div>
                    <label style={{ color: '#c0c0c0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Direct Invitation Link</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value="https://aiginvest.com/join/K4X9M2P"
                        readOnly
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(184, 184, 184, 0.05)',
                          borderColor: '#b8b8b8',
                          border: '1px solid',
                          borderRadius: '6px',
                          padding: '10px',
                          color: '#b8b8b8',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                      />
                      <button
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#f0f0f0',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <ArrowRight size={16} /> Share Link
                      </button>
                    </div>
                  </div>

                  {/* Share Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#2d7c5f', fontSize: '20px', fontWeight: 'bold' }}>28</div>
                      <div style={{ color: '#8b8b8b', fontSize: '11px', marginTop: '4px' }}>Shares This Month</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#2563eb', fontSize: '20px', fontWeight: 'bold' }}>12</div>
                      <div style={{ color: '#8b8b8b', fontSize: '11px', marginTop: '4px' }}>Active Joins</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(184, 184, 184, 0.1)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#b8b8b8', fontSize: '20px', fontWeight: 'bold' }}>43%</div>
                      <div style={{ color: '#8b8b8b', fontSize: '11px', marginTop: '4px' }}>Conversion Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DIRECTLY INVITED MEMBERS */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  borderColor: '#b8b8b8',
                  border: '1px solid',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users2 size={24} /> Your Direct Referrals (Level 1)
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottomColor: '#b8b8b8', backgroundColor: 'rgba(184, 184, 184, 0.05)' }} className="border-b">
                        <th style={{ color: '#b8b8b8' }} className="text-left py-2 px-3 font-bold text-xs">Member Name</th>
                        <th style={{ color: '#b8b8b8' }} className="text-left py-2 px-3 font-bold text-xs">Join Date</th>
                        <th style={{ color: '#b8b8b8' }} className="text-left py-2 px-3 font-bold text-xs">Package</th>
                        <th style={{ color: '#b8b8b8' }} className="text-center py-2 px-3 font-bold text-xs">Status</th>
                        <th style={{ color: '#b8b8b8' }} className="text-right py-2 px-3 font-bold text-xs">Total Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'John Smith', joinDate: '2024-01-15', package: 'Premium Business Pack', status: 'Active', earned: 5200 },
                        { name: 'Sarah Johnson', joinDate: '2024-02-20', package: 'Start-Up Business Pack', status: 'Active', earned: 8900 },
                        { name: 'Emma Davis', joinDate: '2024-04-05', package: 'Premium Business Pack', status: 'Active', earned: 6700 },
                        { name: 'James Wilson', joinDate: '2024-05-12', package: 'Professional Business Pack', status: 'Active', earned: 12400 },
                        { name: 'Michael Brown', joinDate: '2024-03-10', package: 'Starter Business Pack', status: 'Inactive', earned: 1200 }
                      ].map((member, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottomColor: 'rgba(184, 184, 184, 0.1)'
                          }}
                          className="border-b hover:bg-[#b8b8b8]/5 transition"
                        >
                          <td style={{ color: '#ffffff' }} className="py-2 px-3 font-medium text-sm">
                            {member.name}
                          </td>
                          <td style={{ color: '#c0c0c0' }} className="py-2 px-3 text-xs">
                            {member.joinDate}
                          </td>
                          <td style={{ color: '#b8b8b8' }} className="py-2 px-3 text-xs font-semibold">
                            {member.package}
                          </td>
                          <td style={{ color: '#c0c0c0' }} className="py-2 px-3 text-center">
                            <span
                              style={{
                                backgroundColor: member.status === 'Active'
                                  ? 'rgba(212, 175, 55, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                                color: member.status === 'Active' ? '#d4af37' : '#ef4444'
                              }}
                              className="px-2 py-1 rounded text-xs font-bold"
                            >
                              {member.status === 'Active' ? '✓ Active' : '○ Inactive'}
                            </span>
                          </td>
                          <td style={{ color: '#d4af37' }} className="py-2 px-3 text-right font-bold text-xs">
                            €{member.earned.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DOCUMENTS SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  border: '2px solid #d4af37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText size={24} /> Documents
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'AIG Business Packages',
                      description: 'Full overview of all membership tiers, earning caps, investment minimums, and transfer fees.',
                      url: '/AIG_Investment_Business_Packs.pdf',
                      category: 'Membership',
                      date: 'Jul 2026',
                      color: '#d4af37'
                    }
                  ].map((doc) => (
                    <a
                      key={doc.name}
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.06)',
                        border: '1px solid rgba(212, 175, 55, 0.28)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = '#d4af37';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.2)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(212, 175, 55, 0.06)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212, 175, 55, 0.28)';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div
                          style={{
                            backgroundColor: 'rgba(212, 175, 55, 0.14)',
                            borderRadius: '10px',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={22} color="#d4af37" />
                        </div>
                        <span
                          style={{
                            backgroundColor: 'rgba(212, 175, 55, 0.14)',
                            color: '#d4af37',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '20px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {doc.category}
                        </span>
                      </div>
                      <div>
                        <div style={{ color: '#f5f5dc', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                          {doc.name}
                        </div>
                        <div style={{ color: '#b9b5aa', fontSize: '12px', lineHeight: '1.5' }}>
                          {doc.description}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span style={{ color: '#8f887b', fontSize: '11px' }}>{doc.date} · PDF</span>
                        <span style={{ color: '#d4af37', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Download ↓
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* GETTING STARTED SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
              className="gap-4 mb-12"
            >
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.3)',
                  borderColor: '#b8b8b8',
                  border: '1px solid',
                  width: '100%',
                  maxWidth: '1000px'
                }}
                className="rounded-lg p-6"
              >
                <h2 style={{ color: '#d4af37', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen size={24} /> Getting Started Guide
                </h2>

                <div className="space-y-4">
                  {[
                    { icon: '📝', title: 'Complete Your Profile', desc: 'Add business details and verification documents', done: true },
                    { icon: '📱', title: 'Download Mobile App', desc: 'Get the AIGINVEST app on iOS and Android', done: true },
                    { icon: '🎯', title: 'Invite Your First Member', desc: 'Share your code with 1-3 people to get started', done: false },
                    { icon: '💼', title: 'Create a Business Plan', desc: 'Set your network growth and earnings goals', done: false },
                    { icon: '📊', title: 'Monitor Analytics', desc: 'Track your network performance weekly', done: false },
                    { icon: '🏆', title: 'Reach Milestone Rewards', desc: 'Unlock bonuses at 10, 25, and 50 members', done: false }
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: step.done ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                        borderColor: step.done ? '#2d7c5f' : '#2563eb',
                        border: '1px solid',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginTop: '2px' }}>{step.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#f0f0f0', fontWeight: '600', fontSize: '14px' }}>
                          {step.title}
                          {step.done && <span style={{ marginLeft: '8px', color: '#2d7c5f' }}>✓</span>}
                        </div>
                        <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '4px' }}>
                          {step.desc}
                        </div>
                      </div>
                      {!step.done && (
                        <button
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#f0f0f0',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Start
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diana Widget */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                style={{
                  background: 'transparent',
                  color: '#1a0f15',
                  padding: 0,
                  border: 'none',
                  width: '64px',
                  height: '64px'
                }}
                className="rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-110"
                title="Chat with Diana"
              >
                <img 
                  src="/images/diana-logo.png" 
                  alt="Diana" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '50%',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
                  }}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
