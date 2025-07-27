import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Passer les routes publiques et de test
  if (req.nextUrl.pathname.startsWith('/auth') || 
      req.nextUrl.pathname === '/' ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/test-session')) {
    return res
  }

  // Ne protéger QUE les routes dashboard
  if (!req.nextUrl.pathname.startsWith('/dashboard')) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Si pas de session pour une route dashboard
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // En cas d'erreur, rediriger vers login plutôt que de laisser passer
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}
