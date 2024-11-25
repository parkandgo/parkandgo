import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Store a session token in cookies
    return NextResponse.json({ success: true }, {
      headers: { 'Set-Cookie': `token=valid; Path=/; HttpOnly` },
    });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
