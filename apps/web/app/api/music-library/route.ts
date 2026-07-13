import { NextResponse } from 'next/server'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

type LibraryTrack = {
  title: string
  artist: string
  album: string
  src: string
}

const SUPPORTED_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'])

const KNOWN_METADATA: Record<string, Pick<LibraryTrack, 'artist' | 'album'>> = {
  "ASK DIANA DIAMONDS DON'T OWN ME": {
    artist: 'AIG Invest',
    album: 'Ask Diana Sessions',
  },
  'ASK DIANA THE NORTH STAR RISE': {
    artist: 'AIG Invest',
    album: 'Ask Diana Sessions',
  },
  'Verse 1': {
    artist: 'Matt Mertel, AIG Theme',
    album: 'AIG Theme Sessions',
  },
  'AIG Anthem Together We Rise': {
    artist: 'NorthStar',
    album: 'NorthStar Anthem',
  },
  'No Monkey Business': {
    artist: 'Mike and the Minions',
    album: 'No Monkey Business',
  },
}

const resolveMediaDirectory = (): string => {
  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, 'public', 'mediafiles'),
    path.join(cwd, 'apps', 'web', 'public', 'mediafiles'),
  ]

  const found = candidates.find((candidate) => existsSync(candidate))
  return found ?? candidates[0]
}

const toTrack = (fileName: string): LibraryTrack | null => {
  const extension = path.extname(fileName).toLowerCase()
  if (!SUPPORTED_EXTENSIONS.has(extension)) return null

  const title = path.basename(fileName, extension)
  const knownMetadata = KNOWN_METADATA[title]

  return {
    title,
    artist: knownMetadata?.artist ?? 'AIG Ecosystem',
    album: knownMetadata?.album ?? 'AIG Ecosystem Library',
    src: `/mediafiles/${encodeURIComponent(fileName)}`,
  }
}

export async function GET() {
  const mediaDirectory = resolveMediaDirectory()

  try {
    const entries = await readdir(mediaDirectory, { withFileTypes: true })

    const tracks = entries
      .filter((entry) => entry.isFile())
      .map((entry) => toTrack(entry.name))
      .filter((track): track is LibraryTrack => track !== null)
      .sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      total: tracks.length,
      items: tracks,
    })
  } catch {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        total: 0,
        items: [],
      },
      { status: 200 }
    )
  }
}
