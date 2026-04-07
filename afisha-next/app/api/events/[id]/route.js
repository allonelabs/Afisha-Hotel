import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

function getEvents() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  events[index] = { ...events[index], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
  return NextResponse.json(events[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
