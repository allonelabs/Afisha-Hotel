import { NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking } from '@/lib/bookings';

export async function GET(request, { params }) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateBooking(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = deleteBooking(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
