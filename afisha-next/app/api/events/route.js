import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

function getEvents() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function GET() {
  return NextResponse.json(getEvents());
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.date) {
    return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
  }

  const events = getEvents();
  const newEvent = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    title: body.title,
    date: body.date,
    time: body.time || '',
    location: body.location || 'Hotel Afisha',
    desc: body.desc || '',
    img: body.img || '',
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
  return NextResponse.json(newEvent, { status: 201 });
}
