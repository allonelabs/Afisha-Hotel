import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

function getSubscribers() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function GET() {
  return NextResponse.json(getSubscribers());
}

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const subscribers = getSubscribers();

  if (subscribers.some(s => s.email === email)) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));

  return NextResponse.json({ success: true }, { status: 201 });
}
