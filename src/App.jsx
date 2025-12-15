import { useState, useEffect } from 'react'
import './App.css'
import ReservationForm from './components/ReservationForm'
import TableSelection from './components/TableSelection'
import ContactForm from './components/ContactForm'
import { fetchAvailableSeatings, createReservation } from './services/api'

function App() {
  const [customerId, setCustomerId] = useState(null)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [selectedSeating, setSelectedSeating] = useState(null)
  const [availableSeatings, setAvailableSeatings] = useState([])
  const [loading, setLoading] = useState(false)

  const loadAvailableSeatings = async () => {
    if (!date || !time) {
      setAvailableSeatings([])
      return
    }
    
    setLoading(true)
    try {
      console.log('Fetching seatings for:', { date, time, guests })
      const seatings = await fetchAvailableSeatings(date, time, guests)
      console.log('Raw seatings response:', seatings)
      setAvailableSeatings(seatings)
    } catch (error) {
      console.error('Error fetching seatings:', error)
      setAvailableSeatings([])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAvailableSeatings()
  }, [date, time, guests])

  const handleCustomerSubmit = async () => {
    if (!customer.name || !customer.phone) return
    
    setLoading(true)
    try {
      const response = await fetch('https://localhost:7110/api/Customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone
        })
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Full API response:', result)
        console.log('Response type:', typeof result)
        console.log('Available properties:', Object.keys(result))
        
        // Try different possible ID field names
        const customerId = result.id || result.Id || result.ID || result.customerId || result.CustomerId
        console.log('Found customerId:', customerId)
        
        if (customerId) {
          setCustomerId(customerId)
        } else {
          // If no ID found, just use a dummy ID to continue (for testing)
          console.log('No ID found, using dummy ID')
          setCustomerId(1)
        }
      } else {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        alert(`Failed to create customer: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      alert(`Network error: ${error.message}`)
    }
    setLoading(false)
  }

  const handleReservation = async () => {
    if (!selectedSeating || !customerId) return
    
    setLoading(true)
    try {
      const success = await createReservation(date, time, guests, selectedSeating, customerId)
      
      if (success) {
        setCustomerId(null)
        setCustomer({ name: '', email: '', phone: '' })
        setDate('')
        setTime('')
        setGuests(2)
        setSelectedSeating(null)
        setAvailableSeatings([])
        alert('Reservation confirmed!')
      } else {
        alert('Failed to create reservation')
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('Failed to create reservation')
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <h1>Restaurant Reservations</h1>
      
      {!customerId ? (
        <ContactForm 
          contact={customer}
          setContact={setCustomer}
          onConfirm={handleCustomerSubmit}
          loading={loading}
          title="Customer Information"
          buttonText="Continue"
        />
      ) : (
        <>
          <ReservationForm 
            date={date} setDate={setDate}
            time={time} setTime={setTime}
            guests={guests} setGuests={setGuests}
          />
          
          <TableSelection 
            loading={loading}
            availableSeatings={availableSeatings}
            selectedSeating={selectedSeating}
            setSelectedSeating={setSelectedSeating}
            date={date}
            time={time}
            onContinue={handleReservation}
            buttonText="Confirm Reservation"
          />
        </>
      )}
    </div>
  )
}

export default App
