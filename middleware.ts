import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware temporairement désactivé pour résoudre la boucle de refresh
  return NextResponse.next()
}

export const config = {
  matcher: [] // Aucune route protégée pour l'instant
}
