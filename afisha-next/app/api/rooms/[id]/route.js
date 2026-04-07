import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'rooms.json');

function getRooms() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const rooms = getRooms();
  const index = rooms.findIndex(r => r.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  rooms[index] = { ...rooms[index], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2));
  return NextResponse.json(rooms[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const rooms = getRooms();
  const filtered = rooms.filter(r => r.id !== id);
  if (filtered.length === rooms.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
