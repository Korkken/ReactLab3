const API_BASE = 'https://localhost:7110'

export const fetchAvailableSeatings = async (date, time, guests) => {
  const response = await fetch(`${API_BASE}/api/Seating?date=${date}&time=${time}`)
  const seatings = await response.json()
  return seatings.filter(seating => !seating.isBooked && seating.capacity >= guests)
}

export const createReservation = async (date, time, guests, seating, customerId) => {
  const bookingDateTime = new Date(`${date}T${time}:00`)
  
  const response = await fetch(`${API_BASE}/api/Reservation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingDate: bookingDateTime.toISOString(),
      guestAmount: guests,
      fK_SeatingId: seating.id,
      fK_CustomerId: customerId
    })
  })
  
  if (response.ok) {
    // Update seating to mark as booked
    await fetch(`${API_BASE}/api/Seating/${seating.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: seating.id,
        capacity: seating.capacity,
        tableNumber: seating.tableNumber,
        isBooked: true,
        date: seating.date,
        startTime: seating.startTime
      })
    })
  }
  
  return response.ok
}