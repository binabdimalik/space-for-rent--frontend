import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiMessageCircle } from 'react-icons/fi';
import Footer from '../components/common/Footer';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Booking",
            questions: [
                {
                    q: "How do I book a space?",
                    a: "Simply browse our available spaces, select your preferred dates and times, and complete the booking process. You'll receive a confirmation email with all the details."
                },
                {
                    q: "Can I cancel or modify my booking?",
                    a: "Yes, you can cancel or modify your booking up to 24 hours before the scheduled time. Go to your profile, find the booking, and select the appropriate option."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for larger bookings."
                },
                {
                    q: "Is there a minimum booking duration?",
                    a: "The minimum booking duration varies by space. Most spaces have a minimum of 1 hour for hourly bookings. Check the specific space listing for details."
                }
            ]
        },
        {
            category: "Spaces",
            questions: [
                {
                    q: "How are spaces verified?",
                    a: "All spaces go through a verification process by our team. We verify the location, amenities, and ensure the space meets our quality standards before listing."
                },
                {
                    q: "Can I list my own space?",
                    a: "Yes! If you have a space you'd like to rent out, click on 'List Your Space' in your profile. Our team will review your submission and get back to you."
                },
                {
                    q: "What amenities are typically included?",
                    a: "Common amenities include WiFi, parking, restrooms, and basic furniture. Each listing specifies the exact amenities available. Check the space details for a complete list."
                },
                {
                    q: "Are spaces available 24/7?",
                    a: "Availability varies by space. Each listing shows the available hours. Some spaces are available 24/7, while others have specific operating hours."
                }
            ]
        },
        {
            category: "Account & Payments",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Click 'Sign In' and select 'Create Account'. Fill in your details and verify your email. You can also sign up using your Google or social media accounts."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Absolutely. We use industry-standard encryption and never store your full payment details. All transactions are processed through secure payment gateways."
                },
                {
                    q: "How do refunds work?",
                    a: "Refunds for eligible cancellations are processed within 5-7 business days. The amount refunded depends on how far in advance you cancel."
                },
                {
                    q: "Can I get an invoice for my booking?",
                    a: "Yes, invoices are automatically generated and sent to your email after each booking. You can also download them from your profile."
                }
            ]
        },
        {
            category: "Support",
            questions: [
                {
                    q: "How can I contact support?",
                    a: "You can reach our support team via email at support@spacehub.com, by phone at +254 748 113 959, or through the Contact page on our website."
                },
                {
                    q: "What if there's an issue with my booked space?",
                    a: "Contact us immediately if you encounter any issues. We have a dedicated team to resolve problems quickly and ensure you have a great experience."
                },
                {
                    q: "Do you offer customer support in multiple languages?",
                    a: "Currently, we offer support in English. We're working on expanding our support to include more languages in the future."
                }
            ]
        }
    ];

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

