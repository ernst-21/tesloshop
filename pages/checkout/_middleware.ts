import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { origin } = req.nextUrl;

  console.log({ session });

  if (!session) {
    const requestedPage = req.page.name;
    return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`);
  }

  return NextResponse.next();
}
