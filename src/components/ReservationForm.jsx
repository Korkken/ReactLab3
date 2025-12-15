function ReservationForm({ date, setDate, time, setTime, guests, setGuests }) {
  return (
    <div className="reservation-form">
      <h2>Make a Reservation</h2>
      
      <div className="form-group">
        <label>Date:</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="form-group">
        <label>Time:</label>
        <input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label>Guests:</label>
        <input 
          type="number" 
          value={guests} 
          onChange={(e) => setGuests(parseInt(e.target.value))}
          min="1" 
          max="8"
        />
      </div>
    </div>
  )
}

export default ReservationForm