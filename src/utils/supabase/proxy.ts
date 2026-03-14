import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 2026 Proxy-based session management for Supabase + Next.js 16.
 * Uses getClaims() for performance and getUser() for security validation.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  /**
   * Performance check (getClaims): Verifies JWT signature locally (Asymmetric RS256).
   * introduced in 2025/2026 for high-traffic apps.
   */
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  /**
   * Security check (getUser): Re-validates with Supabase Auth server.
   * This is critical to prevent session spoofing and ensures the user is still active.
   */
  const { data: { user }, error } = await supabase.auth.getUser()

  const protectedPaths = ['/dashboard', '/chat', '/friends', '/notifications']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If the path is protected and we don't have a valid user/session
  if (isProtected && (!user || error || !claims)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
