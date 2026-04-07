import { NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/bookings';

export async function GET() {
  const bookings = getBookings();
  return NextResponse.json(bookings);
}

export async function POST(request) {
  const body = await request.json();

  const required = ['firstName', 'lastName', 'email', 'phone', 'room', 'checkin', 'checkout'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const booking = createBooking({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    countryCode: body.countryCode || '+995',
    room: body.room,
    price: body.price,
    checkin: body.checkin,
    checkout: body.checkout,
    adults: body.adults || 2,
    children: body.children || 0,
    arrivalTime: body.arrivalTime || '03:00 pm',
    specialRequest: body.specialRequest || '',
    cardLast4: body.cardNumber ? body.cardNumber.replace(/\s/g, '').slice(-4) : '',
    promoCode: body.promoCode || '',
  });

  return NextResponse.json(booking, { status: 201 });
}
