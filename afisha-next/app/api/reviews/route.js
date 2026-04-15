import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getReviews() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(getReviews(), { headers: corsHeaders });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.text) {
    return NextResponse.json({ error: 'Name and review text are required' }, { status: 400, headers: corsHeaders });
  }

  const reviews = getReviews();
  const newReview = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: body.name,
    country: body.country || '',
    text: body.text,
    rating: body.rating || 5,
    status: body.status || 'pending',
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
  return NextResponse.json(newReview, { status: 201, headers: corsHeaders });
}
