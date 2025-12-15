function ContactForm({ contact, setContact, onConfirm, loading, title = "Contact Information", buttonText = "Confirm Reservation" }) {
  return (
    <div className="contact-form">
      <h3>{title}</h3>
      
      <div className="form-group">
        <label>Name:</label>
        <input 
          type="text" 
          value={contact.name}
          onChange={(e) => setContact({...contact, name: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={contact.email}
          onChange={(e) => setContact({...contact, email: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Phone:</label>
        <input 
          type="tel" 
          value={contact.phone}
          onChange={(e) => setContact({...contact, phone: e.target.value})}
          required
        />
      </div>
      
      <button 
        className="confirm-btn"
        onClick={onConfirm}
        disabled={!contact.name || !contact.phone || loading}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  )
}

export default ContactForm