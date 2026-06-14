import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-CHANGE-IN-PRODUCTION-12345'
)

const COOKIE = 'crm_session'

export async function createCrmSession(userId: string, email: string) {
  const token = await new SignJWT({ sub: userId, email, type: 'crm' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function deleteCrmSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function getCrmSession(): Promise<{ userId: string; email: string } | null> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret)
    if (payload.type !== 'crm') return null
    return { userId: payload.sub as string, email: payload.email as string }
  } catch {
    return null
  }
}
