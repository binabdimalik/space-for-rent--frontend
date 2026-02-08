import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiLock, FiCheck, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { BookingsContext } from '../context/BookingsContext';
import Footer from '../components/common/Footer';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addBooking } = useContext(BookingsContext);
    const booking = location.state?.booking;

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    // Redirect if no booking data
    if (!booking) {
        return (
            <div className="payment-page">
                <div className="payment-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h2>No Booking Found</h2>
                    <p style={{ marginBottom: '20px', color: '#6a7282' }}>Please select a space and complete the booking form first.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/spaces')}>
                        Browse Spaces
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleCardChange = (e) => {
        let { name, value } = e.target;
        
        // Format card number with spaces
        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            value = value.substring(0, 19);
        }
        
        // Format expiry
        if (name === 'expiry') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
        }

        // Format CVV
        if (name === 'cvv') {
            value = value.substring(0, 4);
        }

        setCardData({ ...cardData, [name]: value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (paymentMethod === 'card') {
            if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
                alert('Please fill in all card details');
                return;
            }
        }

        setProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Save booking to context - use logged-in user's info for proper filtering
            addBooking({
                spaceId: booking.spaceId,
                spaceTitle: booking.spaceTitle,
                location: booking.location || 'N/A',
                clientName: user?.name || booking.fullName,
                clientEmail: user?.email || booking.email,
                clientId: user?.id,
                clientPhone: booking.phone,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime || null,
                endTime: booking.endTime || null,
                bookingType: booking.bookingType,
                totalAmount: booking.totalAmount,
                paymentMethod: paymentMethod
            });
            
            setProcessing(false);
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        const confirmationNumber = `SFR-${Date.now().toString().slice(-8)}`;
        
        return (
            <div className="payment-page">
                <div className="payment-container">
                    {/* Success Notification Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '24px',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FiCheck size={48} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                            🎉 Successfully Booked!
                        </h2>
                        <p style={{ fontSize: '18px', opacity: 0.9 }}>
                            Payment Complete - Your reservation is confirmed
                        </p>
                    </div>

                    {/* Reservation Ticket */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        border: '2px dashed #e5e7eb',
                        position: 'relative'
                    }}>
                        {/* Ticket Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
                            padding: '24px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, marginBottom: '8px' }}>
                                Reservation Ticket
                            </h3>
                            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
                                {booking.spaceTitle}
                            </h2>
                            <p style={{ opacity: 0.8, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <FiMapPin size={14} />
                                {booking.location || 'Location on file'}
                            </p>
                        </div>

                        {/* Ticket Body */}
                        <div style={{ padding: '24px' }}>
                            {/* Confirmation Number */}
                            <div style={{
                                background: '#f0f9ff',
                                borderRadius: '8px',
                                padding: '16px',
                                textAlign: 'center',
                                marginBottom: '24px'
                            }}>
                                <p style={{ fontSize: '12px', color: '#6a7282', marginBottom: '4px' }}>Confirmation Number</p>
                                <p style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb', letterSpacing: '2px' }}>
                                    {confirmationNumber}
                                </p>
                            </div>

                            {/* Ticket Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '16px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiCalendar size={16} />
                                        <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Date</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a8a' }}>
                                        {booking.startDate}
                                        {booking.startDate !== booking.endDate && ` - ${booking.endDate}`}
                                    </p>
                                </div>

                                <div style={{ padding: '16px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiClock size={16} />
                                        <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Time</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a8a' }}>
                                        {booking.bookingType === 'hourly' 
                                            ? `${booking.startTime} - ${booking.endTime}`
                                            : 'Full Day Access'
                                        }
                                    </p>
                                </div>

                                <div style={{ padding: '16px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiUser size={16} />
                                        <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Guest</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a8a' }}>
                                        {user?.name || booking.fullName}
                                    </p>
                                </div>

                                <div style={{ padding: '16px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiCreditCard size={16} />
                                        <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>Amount Paid</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '16px', color: '#10b981' }}>
                                        ${booking.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <span style={{
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    padding: '8px 24px',
                                    borderRadius: '20px',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}>
                                    ✓ CONFIRMED & PAID
                                </span>
                            </div>

                            {/* Note */}
                            <p style={{ 
                                textAlign: 'center', 
                                marginTop: '24px', 
                                fontSize: '14px', 
                                color: '#6a7282',
                                padding: '16px',
                                background: '#fefce8',
                                borderRadius: '8px'
                            }}>
                                📧 A confirmation email has been sent to <strong>{user?.email || booking.email}</strong>
                                <br />
                                <span style={{ fontSize: '12px' }}>Please show this ticket upon arrival</span>
                            </p>
                        </div>

                        {/* Ticket Footer */}
                        <div style={{
                            borderTop: '2px dashed #e5e7eb',
                            padding: '24px',
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                                View My Bookings
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/spaces')}>
                                Browse More Spaces
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-grid">
                    {/* Payment Form */}
                    <div className="payment-form-section">
                        <h2 className="payment-title">Complete Payment</h2>
                        <p className="payment-subtitle">Choose your payment method</p>

                        {/* Payment Method Selection */}
                        <div className="payment-methods">
                            <label className={`payment-method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <FiCreditCard size={20} />
                                <span>Credit/Debit Card</span>
                            </label>
                            <label className={`payment-method-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span style={{ fontWeight: 700, color: '#003087' }}>Pay</span>
                                <span style={{ fontWeight: 700, color: '#009cde' }}>Pal</span>
                            </label>
                            <label className={`payment-method-option ${paymentMethod === 'mpesa' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="mpesa"
                                    checked={paymentMethod === 'mpesa'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span style={{ fontWeight: 700, color: '#4caf50' }}>M-Pesa</span>
                            </label>
                        </div>

                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                            <form onSubmit={handlePayment} className="card-form">
                                <div className="form-group">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={cardData.cardNumber}
                                        onChange={handleCardChange}
                                        className="form-input"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={cardData.cardName}
                                        onChange={handleCardChange}
                                        className="form-input"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardData.expiry}
                                            onChange={handleCardChange}
                                            className="form-input"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={cardData.cvv}
                                            onChange={handleCardChange}
                                            className="form-input"
                                            placeholder="123"
                                            maxLength="4"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary payment-btn"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <FiLock size={16} />
                                            Pay ${booking.totalAmount.toFixed(2)}
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* PayPal */}
                        {paymentMethod === 'paypal' && (
                            <div className="paypal-section">
                                <p style={{ marginBottom: '16px', color: '#6a7282' }}>
                                    You will be redirected to PayPal to complete your payment securely.
                                </p>
                                <button 
                                    className="btn payment-btn"
                                    style={{ background: '#003087', color: 'white' }}
                                    onClick={handlePayment}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : `Pay with PayPal - $${booking.totalAmount.toFixed(2)}`}
                                </button>
                            </div>
                        )}

                        {/* M-Pesa */}
                        {paymentMethod === 'mpesa' && (
                            <div className="mpesa-section">
                                <p style={{ marginBottom: '16px', color: '#6a7282' }}>
                                    Enter your M-Pesa phone number to receive a payment prompt.
                                </p>
                                <div className="form-group">
                                    <label className="form-label">M-Pesa Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="+254 7XX XXX XXX"
                                        defaultValue={booking.phone}
                                    />
                                </div>
                                <button 
                                    className="btn payment-btn"
                                    style={{ background: '#4caf50', color: 'white' }}
                                    onClick={handlePayment}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : `Pay with M-Pesa - $${booking.totalAmount.toFixed(2)}`}
                                </button>
                            </div>
                        )}

                        <div className="security-note">
                            <FiLock size={14} />
                            <span>Your payment information is secure and encrypted</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3 className="summary-title">Booking Summary</h3>
                        
                        <div className="summary-space">
                            <img 
                                src={booking.spaceImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'} 
                                alt={booking.spaceTitle}
                                className="summary-image"
                            />
                            <div>
                                <h4>{booking.spaceTitle}</h4>
                                <p className="summary-type">{booking.bookingType === 'hourly' ? 'Hourly Booking' : 'Daily Booking'}</p>
                            </div>
                        </div>

                        <div className="summary-details">
                            <div className="summary-row">
                                <FiUser size={14} />
                                <span>{booking.fullName}</span>
                            </div>
                            <div className="summary-row">
                                <FiMail size={14} />
                                <span>{booking.email}</span>
                            </div>
                            <div className="summary-row">
                                <FiPhone size={14} />
                                <span>{booking.phone}</span>
                            </div>
                            <div className="summary-row">
                                <FiCalendar size={14} />
                                <span>{booking.startDate} - {booking.endDate}</span>
                            </div>
                            {booking.bookingType === 'hourly' && (
                                <div className="summary-row">
                                    <FiClock size={14} />
                                    <span>{booking.startTime} - {booking.endTime}</span>
                                </div>
                            )}
                        </div>

                        <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span className="total-amount">${booking.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentPage;
