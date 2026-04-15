import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getSubscribers() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(getSubscribers(), { headers: corsHeaders });
}

export async function DELETE(request) {
  const { email } = await request.json();
  const subscribers = getSubscribers();
  const filtered = subscribers.filter(s => s.email !== email);
  if (filtered.length === subscribers.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400, headers: corsHeaders });
  }

  const subscribers = getSubscribers();

  if (subscribers.some(s => s.email === email)) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 409, headers: corsHeaders });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));

  return NextResponse.json({ success: true }, { status: 201, headers: corsHeaders });
}
