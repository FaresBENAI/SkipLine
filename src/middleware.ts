import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Passer les routes publiques
  if (req.nextUrl.pathname.startsWith('/auth') || 
      req.nextUrl.pathname === '/' ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/api')) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session }, error } = await supabase.auth.getSession()

    console.log('🔍 Middleware - Session check:', { 
      path: req.nextUrl.pathname,
      hasSession: !!session,
      userId: session?.user?.id,
      error: error?.message
    })

    // Si pas de session et que l'utilisateur essaie d'accéder au dashboard
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('❌ Pas de session, redirection vers login')
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Session valide, accès autorisé')
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // En cas d'erreur, laisser passer
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}
