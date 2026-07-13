import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

const ROOT_DIR = path.resolve(process.cwd(), '..', '..', 'ecosysteme-apps', 'AIG-MoneyGames', 'aig-moneygames')

export async function GET(
  req: NextRequest,
  { params }: { params: { filePath?: string[] } }
) {
  const requestedRelativePath = params.filePath && params.filePath.length > 0
    ? params.filePath.join('/')
    : 'index.html'

  const targetAbsolute = path.resolve(ROOT_DIR, requestedRelativePath)

  if (!targetAbsolute.startsWith(ROOT_DIR)) {
    return new NextResponse('Invalid file path', { status: 400 })
  }

  try {
    const fileBuffer = await fs.readFile(targetAbsolute)
    const ext = path.extname(targetAbsolute).toLowerCase()
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

    if (ext === '.html') {
      const html = fileBuffer.toString('utf8')
      return new NextResponse(html, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache',
        },
      })
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-cache',
      },
    })
  } catch {
    return new NextResponse('File not found', { status: 404 })
  }
}