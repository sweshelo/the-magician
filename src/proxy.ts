import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const DISABLE_DISCORD_LOGIN = process.env.DISABLE_DISCORD_LOGIN === 'true';
  const DISABLE_SUPABASE = process.env.DISABLE_SUPABASE === 'true';

  // 1. DISABLE_DISCORD_LOGIN: /login へのアクセスをブロック
  if (DISABLE_DISCORD_LOGIN && pathname === '/login') {
    return NextResponse.redirect(new URL('/entrance', request.url));
  }

  // 2. DISABLE_SUPABASE: セッション管理不要
  if (DISABLE_SUPABASE) {
    return NextResponse.next();
  }

  // 3. Supabase 未設定チェック
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // 本番環境では認証なしのアクセスを禁止
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
