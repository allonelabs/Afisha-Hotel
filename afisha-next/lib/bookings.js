import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

export function getBookings() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getBookingById(id) {
  const bookings = getBookings();
  return bookings.find(b => b.id === id) || null;
}

export function createBooking(booking) {
  const bookings = getBookings();
  const newBooking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    ...booking,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return newBooking;
}

export function updateBooking(id, updates) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return bookings[index];
}

export function deleteBooking(id) {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== id);
  if (filtered.length === bookings.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
