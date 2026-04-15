import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json');

function getReviews() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  reviews[index] = { ...reviews[index], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
  return NextResponse.json(reviews[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  if (filtered.length === reviews.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
