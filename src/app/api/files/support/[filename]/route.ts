import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join, extname, basename } from 'path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
}

interface RouteParams { params: Promise<{ filename: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { filename } = await params
  // Strip any path traversal attempts
  const safe = basename(filename)
  const ext = extname(safe).toLowerCase()
  const mime = MIME[ext]
  if (!mime) return new NextResponse('Not found', { status: 404 })

  try {
    const filePath = join(process.cwd(), 'uploads', 'support', safe)
    const buf = await readFile(filePath)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
