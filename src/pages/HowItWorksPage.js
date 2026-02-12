import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiKey, FiCheckCircle, FiShield, FiClock, FiDollarSign, FiHeadphones } from 'react-icons/fi';
import Footer from '../components/common/Footer';

const HowItWorksPage = () => {
    const steps = [
        {
            icon: <FiSearch size={32} />,
            title: "Browse & Search",
            description: "Explore our wide variety of spaces. Use filters to find the perfect location, size, and amenities that match your needs."
        },
        {
            icon: <FiCalendar size={32} />,
            title: "Select Dates & Book",
            description: "Choose your preferred dates and times. Our real-time availability system ensures you can book instantly."
        },
        {
            icon: <FiDollarSign size={32} />,
            title: "Secure Payment",
            description: "Pay securely through our platform. We support multiple payment methods for your convenience."
        },
        {
            icon: <FiKey size={32} />,
            title: "Access Your Space",
            description: "Receive confirmation and access details. Show up and enjoy your perfectly booked space!"
        }
    ];

    const benefits = [
        {
            icon: <FiCheckCircle size={24} />,
            title: "Verified Spaces",
            description: "All spaces are verified by our team to ensure quality and accuracy."
        },
        {
            icon: <FiShield size={24} />,
            title: "Secure Booking",
            description: "Your payments and personal information are protected with industry-standard security."
        },
        {
            icon: <FiClock size={24} />,
            title: "Flexible Options",
            description: "Book by the hour or for the whole day - whatever works best for you."
        },
        {
            icon: <FiHeadphones size={24} />,
            title: "24/7 Support",
            description: "Our customer support team is always ready to help with any questions."
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
                    How SpaceHub Works
                </h1>
                <p style={{ 
                    fontSize: 'clamp(16px, 2vw, 20px)', 
                    opacity: 0.9,
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Finding and booking the perfect space has never been easier. Follow these simple steps to get started.
                </p>
            </div>

            {/* Steps Section */}
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '32px' 
                }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{ 
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            position: 'relative',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}
                        className="card"
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-1px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '40px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '16px',
                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                                zIndex: 10
                            }}>
                                {index + 1}
                            </div>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: '#eff6ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '24px auto 24px',
                                color: '#2563eb'
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{ 
                                fontSize: '20px', 
                                fontWeight: 700, 
                                color: '#1e3a8a',
                                marginBottom: '12px'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{ color: '#6a7282', lineHeight: 1.6 }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div style={{ 
                background: 'white',
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ 
                        textAlign: 'center',
                        fontSize: 'clamp(24px, 4vw, 32px)',
                        fontWeight: 700,
                        color: '#1e3a8a',
                        marginBottom: '48px'
                    }}>
                        Why Choose SpaceHub?
                    </h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                        gap: '24px' 
                    }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '24px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ 
                                    color: '#2563eb',
                                    flexShrink: 0
                                }}>
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h4 style={{ 
                                        fontWeight: 700, 
                                        color: '#1e3a8a',
                                        marginBottom: '6px'
                                    }}>
                                        {benefit.title}
                                    </h4>
                                    <p style={{ 
                                        fontSize: '14px', 
                                        color: '#6a7282',
                                        lineHeight: 1.5
                                    }}>
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <h2 style={{ 
                    color: 'white', 
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 700,
                    marginBottom: '16px'
                }}>
                    Ready to Find Your Perfect Space?
                </h2>
                <p style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    marginBottom: '24px',
                    fontSize: '16px'
                }}>
                    Join thousands of satisfied customers who have found their ideal spaces.
                </p>
                <Link to="/spaces" className="btn btn-secondary btn-lg">
                    Browse Spaces Now
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default HowItWorksPage;
