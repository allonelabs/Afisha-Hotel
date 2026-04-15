import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getMenu() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(getMenu(), { headers: corsHeaders });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.category) {
    return NextResponse.json({ error: 'Name and category are required' }, { status: 400, headers: corsHeaders });
  }

  const menu = getMenu();
  const newItem = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: body.name,
    category: body.category,
    meal: body.meal || 'Breakfast',
    restaurant: body.restaurant || 'Brasserie',
    price: body.price || '',
    desc: body.desc || '',
    img: body.img || '',
    createdAt: new Date().toISOString(),
  };
  menu.push(newItem);
  fs.writeFileSync(DATA_FILE, JSON.stringify(menu, null, 2));
  return NextResponse.json(newItem, { status: 201, headers: corsHeaders });
}
