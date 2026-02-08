import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageCircle } from 'react-icons/fi';
import Footer from '../components/common/Footer';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <FiMail size={24} />,
            title: "Email Us",
            content: "support@spacehub.com",
            description: "We'll respond within 24 hours"
        },
        {
            icon: <FiPhone size={24} />,
            title: "Call Us",
            content: "+254 748 113 959",
            description: "Mon-Fri, 9am-6pm EAT"
        },
        {
            icon: <FiMapPin size={24} />,
            title: "Visit Us",
            content: "JW Marriott 6th Floor, Office 6001",
            description: "Westlands, Nairobi"
        }
    ];

    return (
        <div style={{ background: '#f5f5f4', minHeight: 'calc(100vh - 70px)' }}>
            {/* Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
                padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ 
                    fontSize: 'clamp(32px, 5vw, 48px)', 
                    fontWeight: 700, 
                    marginBottom: '16px' 
                }}>
                    Contact Us
                </h1>
                <p style={{ 
                    fontSize: 'clamp(16px, 2vw, 20px)', 
                    opacity: 0.9,
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)'
            }}>
                {/* Contact Info Cards */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '24px',
                    marginBottom: '48px'
                }}>
                    {contactInfo.map((info, index) => (
                        <div key={index} style={{ 
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}
                        className="card"
                        >
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: '#eff6ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: '#2563eb'
                            }}>
                                {info.icon}
                            </div>
                            <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: 700, 
                                color: '#1e3a8a',
                                marginBottom: '8px'
                            }}>
                                {info.title}
                            </h3>
                            <p style={{ 
                                color: '#2563eb', 
                                fontWeight: 600,
                                marginBottom: '4px'
                            }}>
                                {info.content}
                            </p>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#6a7282'
                            }}>
                                {info.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '48px',
                    alignItems: 'start'
                }}>
                    <div style={{ 
                        background: 'white',
                        borderRadius: '16px',
                        padding: '40px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: 700, 
                            color: '#1e3a8a',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <FiMessageCircle />
                            Send us a Message
                        </h2>

                        {submitted ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px',
                                background: '#dcfce7',
                                borderRadius: '12px'
                            }}>
                                <div style={{ 
                                    fontSize: '48px', 
                                    marginBottom: '16px' 
                                }}>✓</div>
                                <h3 style={{ 
                                    color: '#166534', 
                                    marginBottom: '8px',
                                    fontWeight: 700
                                }}>
                                    Message Sent!
                                </h3>
                                <p style={{ color: '#15803d' }}>
                                    Thank you for contacting us. We'll get back to you soon.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="btn btn-primary"
                                    style={{ marginTop: '20px' }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={5}
                                        style={{ resize: 'vertical' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-full">
                                    <FiSend size={16} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Office Hours & Map Placeholder */}
                    <div>
                        <div style={{ 
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: 700, 
                                color: '#1e3a8a',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FiClock />
                                Office Hours
                            </h3>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '12px' 
                            }}>
                                {[
                                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                                    { day: 'Sunday', hours: 'Closed' }
                                ].map((item, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        background: '#f9fafb',
                                        borderRadius: '8px'
                                    }}>
                                        <span style={{ fontWeight: 600, color: '#364153' }}>
                                            {item.day}
                                        </span>
                                        <span style={{ color: '#6a7282' }}>
                                            {item.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ 
                            background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
                            borderRadius: '16px',
                            padding: '32px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: 700,
                                marginBottom: '12px'
                            }}>
                                Need Immediate Help?
                            </h3>
                            <p style={{ 
                                opacity: 0.9, 
                                marginBottom: '20px',
                                fontSize: '14px'
                            }}>
                                Our support team is available 24/7 for urgent inquiries.
                            </p>
                            <a 
                                href="tel:+254748113959" 
                                className="btn"
                                style={{ 
                                    background: 'white', 
                                    color: '#2563eb',
                                    width: '100%',
                                    justifyContent: 'center'
                                }}
                            >
                                <FiPhone />
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage;
