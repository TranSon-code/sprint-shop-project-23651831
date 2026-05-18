import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  // Protected user routes
  const protectedUserRoutes = ['/cart', '/checkout', '/orders', '/profile']
  // Protected admin routes
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isProtectedUser = protectedUserRoutes.some((r) =>
    nextUrl.pathname.startsWith(r)
  )

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', nextUrl))
    if (session?.user?.role !== 'admin') return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (isProtectedUser && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
