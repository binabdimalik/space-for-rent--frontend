import React from "react";
import { FiShield, FiLock, FiEye, FiDatabase, FiMail } from "react-icons/fi";
import Footer from "../components/common/Footer";

const PrivacyPage = () => {
  const formatContent = (text) => {
    const parts = text.split("**");
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
    );
  };

  const sections = [
    {
      icon: <FiDatabase size={24} />,
      title: "Information We Collect",
      content: [
        "**Personal Information:** When you create an account, we collect your name, email address, phone number, and payment information.",
        "**Usage Data:** We automatically collect information about how you interact with our platform, including pages visited, searches made, and bookings completed.",
        "**Device Information:** We collect information about the device you use to access our service, including device type, operating system, and browser type.",
        "**Location Data:** With your permission, we may collect location data to show you nearby spaces and improve our services.",
      ],
    },
    {
      icon: <FiEye size={24} />,
      title: "How We Use Your Information",
      content: [
        "**Provide Services:** To process bookings, payments, and provide customer support.",
        "**Improve Experience:** To personalize your experience and recommend relevant spaces.",
        "**Communication:** To send booking confirmations, updates, and promotional offers (which you can opt out of).",
        "**Security:** To detect and prevent fraud, unauthorized access, and other illegal activities.",
        "**Legal Compliance:** To comply with legal obligations and respond to lawful requests.",
      ],
    },
    {
      icon: <FiLock size={24} />,
      title: "How We Protect Your Information",
      content: [
        "**Encryption:** All data transmitted between your device and our servers is encrypted using SSL/TLS technology.",
        "**Secure Storage:** Your personal information is stored on secure servers with restricted access.",
        "**Payment Security:** We use PCI-compliant payment processors and never store your full credit card details.",
        "**Regular Audits:** We conduct regular security audits and vulnerability assessments.",
        "**Employee Training:** Our team is trained on data protection and privacy best practices.",
      ],
    },
    {
      icon: <FiShield size={24} />,
      title: "Your Rights & Choices",
      content: [
        "**Access:** You can request a copy of your personal data at any time.",
        "**Correction:** You can update or correct your information through your account settings.",
        "**Deletion:** You can request deletion of your account and associated data.",
        "**Opt-Out:** You can unsubscribe from marketing emails at any time.",
        "**Data Portability:** You can request your data in a portable format.",
      ],
    },
  ];

  return (
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
          <FiShield />
          Privacy Policy
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Your privacy is important to us. Learn how we collect, use, and
          protect your information.
        </p>
        <p
          style={{
            fontSize: "14px",
            opacity: 0.7,
            marginTop: "16px",
          }}
        >
          Last updated: February 1, 2026
        </p>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)",
        }}
      >
        {/* Introduction */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              color: "#4a5565",
              lineHeight: 1.8,
              fontSize: "16px",
            }}
          >
            At SpaceHub, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform. By using SpaceHub, you agree
            to the collection and use of information in accordance with this
            policy.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1e3a8a",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ color: "#2563eb" }}>{section.icon}</span>
              {section.title}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {section.content.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  style={{
                    padding: "12px 0",
                    borderBottom:
                      itemIndex < section.content.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                    color: "#4a5565",
                    lineHeight: 1.7,
                  }}
                >
                  {formatContent(item)}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cookies Section */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1e3a8a",
              marginBottom: "20px",
            }}
          >
            🍪 Cookies & Tracking
          </h2>
          <p
            style={{
              color: "#4a5565",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            We use cookies and similar tracking technologies to track activity
            on our platform and hold certain information. Cookies are files with
            a small amount of data that may include an anonymous unique
            identifier.
          </p>
          <p style={{ color: "#4a5565", lineHeight: 1.8 }}>
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our service.
          </p>
        </div>

        {/* Third Parties */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1e3a8a",
              marginBottom: "20px",
            }}
          >
            Third-Party Services
          </h2>
          <p
            style={{
              color: "#4a5565",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            We may employ third-party companies and individuals to facilitate
            our service, provide the service on our behalf, perform
            service-related functions, or assist us in analyzing how our service
            is used. These third parties have access to your personal data only
            to perform these tasks on our behalf and are obligated not to
            disclose or use it for any other purpose.
          </p>
          <p style={{ color: "#4a5565", lineHeight: 1.8 }}>
            Our partners include payment processors, analytics providers, and
            cloud hosting services. We ensure all partners meet our strict
            privacy and security standards.
          </p>
        </div>

        {/* Contact Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            color: "white",
          }}
        >
          <FiMail size={40} style={{ marginBottom: "16px" }} />
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Questions About Our Privacy Policy?
          </h3>
          <p
            style={{
              opacity: 0.9,
              marginBottom: "24px",
              maxWidth: "500px",
              margin: "0 auto 24px",
            }}
          >
            If you have any questions or concerns about our Privacy Policy,
            please do not hesitate to contact us.
          </p>
          <a
            href="mailto:privacy@spacehub.com"
            className="btn"
            style={{
              background: "white",
              color: "#2563eb",
              display: "inline-flex",
            }}
          >
            <FiMail size={16} />
            privacy@spacehub.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
