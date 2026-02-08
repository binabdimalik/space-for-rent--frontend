import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiMessageCircle,
} from "react-icons/fi";
import Footer from "../components/common/Footer";

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  }
`;

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Booking",
      questions: [
        {
          q: "How do I book a space?",
          a: "Simply browse our available spaces, select your preferred dates and times, and complete the booking process. You'll receive a confirmation email with all the details.",
        },
        {
          q: "Can I cancel or modify my booking?",
          a: "Yes, you can cancel or modify your booking up to 24 hours before the scheduled time. Go to your profile, find the booking, and select the appropriate option.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for larger bookings.",
        },
        {
          q: "Is there a minimum booking duration?",
          a: "The minimum booking duration varies by space. Most spaces have a minimum of 1 hour for hourly bookings. Check the specific space listing for details.",
        },
      ],
    },
    {
      category: "Spaces",
      questions: [
        {
          q: "How are spaces verified?",
          a: "All spaces go through a verification process by our team. We verify the location, amenities, and ensure the space meets our quality standards before listing.",
        },
        {
          q: "Can I list my own space?",
          a: "Yes! If you have a space you'd like to rent out, click on 'List Your Space' in your profile. Our team will review your submission and get back to you.",
        },
        {
          q: "What amenities are typically included?",
          a: "Common amenities include WiFi, parking, restrooms, and basic furniture. Each listing specifies the exact amenities available. Check the space details for a complete list.",
        },
        {
          q: "Are spaces available 24/7?",
          a: "Availability varies by space. Each listing shows the available hours. Some spaces are available 24/7, while others have specific operating hours.",
        },
      ],
    },
    {
      category: "Account & Payments",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign In' and select 'Create Account'. Fill in your details and verify your email. You can also sign up using your Google or social media accounts.",
        },
        {
          q: "Is my payment information secure?",
          a: "Absolutely. We use industry-standard encryption and never store your full payment details. All transactions are processed through secure payment gateways.",
        },
        {
          q: "How do refunds work?",
          a: "Refunds for eligible cancellations are processed within 5-7 business days. The amount refunded depends on how far in advance you cancel.",
        },
        {
          q: "Can I get an invoice for my booking?",
          a: "Yes, invoices are automatically generated and sent to your email after each booking. You can also download them from your profile.",
        },
      ],
    },
    {
      category: "Support",
      questions: [
        {
          q: "How can I contact support?",
          a: "You can reach our support team via email at support@spacehub.com, by phone at +254 748 113 959, or through the Contact page on our website.",
        },
        {
          q: "What if there's an issue with my booked space?",
          a: "Contact us immediately if you encounter any issues. We have a dedicated team to resolve problems quickly and ensure you have a great experience.",
        },
        {
          q: "Do you offer customer support in multiple languages?",
          a: "Currently, we offer support in English. We're working on expanding our support to include more languages in the future.",
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#f5f5f4", minHeight: "calc(100vh - 70px)" }}>
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
            padding: "clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <FiHelpCircle />
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              opacity: 0.9,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Find answers to common questions about SpaceHub. Can't find what
            you're looking for? Contact us!
          </p>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)",
          }}
        >
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1e3a8a",
                  marginBottom: "20px",
                  paddingBottom: "12px",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                {category.category}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {category.questions.map((item, questionIndex) => {
                  const isOpen =
                    openIndex === `${categoryIndex}-${questionIndex}`;
                  return (
                    <div
                      key={questionIndex}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "all 0.3s",
                      }}
                    >
                      <button
                        onClick={() =>
                          toggleQuestion(categoryIndex, questionIndex)
                        }
                        style={{
                          width: "100%",
                          padding: "20px 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: isOpen ? "#eff6ff" : "white",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: isOpen ? "#2563eb" : "#1e3a8a",
                            fontSize: "16px",
                            paddingRight: "16px",
                          }}
                        >
                          {item.q}
                        </span>
                        {isOpen ? (
                          <FiChevronUp size={20} color="#2563eb" />
                        ) : (
                          <FiChevronDown size={20} color="#6a7282" />
                        )}
                      </button>
                      {isOpen && (
                        <div
                          style={{
                            padding: "0 24px 20px",
                            color: "#6a7282",
                            lineHeight: 1.7,
                            animation: "fadeIn 0.2s ease",
                          }}
                        >
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
              color: "white",
              marginTop: "48px",
            }}
          >
            <FiMessageCircle size={40} style={{ marginBottom: "16px" }} />
            <h3
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Still Have Questions?
            </h3>
            <p
              style={{
                opacity: 0.9,
                marginBottom: "24px",
                maxWidth: "400px",
                margin: "0 auto 24px",
              }}
            >
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <Link
              to="/contact"
              className="btn"
              style={{
                background: "white",
                color: "#2563eb",
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
