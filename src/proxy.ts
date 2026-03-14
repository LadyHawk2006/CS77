import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

/**
 * Next.js 16 Proxy Convention (2026)
 * This replaces the legacy middleware.ts for Supabase session management.
 * The 'proxy' export is the new standard for handling cross-cutting concerns.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - common image/asset formats
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
