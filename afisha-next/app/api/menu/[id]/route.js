import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

function getMenu() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const menu = getMenu();
  const index = menu.findIndex(m => m.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  menu[index] = { ...menu[index], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(menu, null, 2));
  return NextResponse.json(menu[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const menu = getMenu();
  const filtered = menu.filter(m => m.id !== id);
  if (filtered.length === menu.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
