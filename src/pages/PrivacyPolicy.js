import React from "react";
import { FiShield, FiLock, FiEye, FiDatabase, FiMail } from "react-icons/fi";
import Footer from "../components/common/Footer";

const PrivacyPage = () => {
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
      <Footer />
    </div>
  );
};

export default PrivacyPage;
