function TableSelection({ loading, availableSeatings, selectedSeating, setSelectedSeating, date, time, onContinue, buttonText = "Continue to Contact Info" }) {
  if (loading) return <p>Loading...</p>
  
  if (!loading && date && time && availableSeatings.length === 0) {
    return <p>No available tables for selected date and time.</p>
  }
  
  if (availableSeatings.length === 0) return null
  
  return (
    <>
      <div className="available-tables">
        <h3>Available Tables</h3>
        {availableSeatings.map(seating => (
          <button 
            key={seating.id}
            className={`table-btn ${selectedSeating?.id === seating.id ? 'selected' : ''}`}
            onClick={() => setSelectedSeating(seating)}
          >
            Table {seating.tableNumber} (seats {seating.capacity})
          </button>
        ))}
      </div>
      
      {selectedSeating && (
        <button className="continue-btn" onClick={onContinue}>
          {buttonText}
        </button>
      )}
    </>
  )
}

export default TableSelection