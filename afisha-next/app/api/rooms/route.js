import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'rooms.json');

function getRooms() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function GET() {
  return NextResponse.json(getRooms());
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
  }

  const rooms = getRooms();
  const newRoom = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: body.name,
    price: Number(body.price),
    img: body.img || '',
    desc: body.desc || '',
  };
  rooms.push(newRoom);
  fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2));
  return NextResponse.json(newRoom, { status: 201 });
}
