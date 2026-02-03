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
  ];

  return (
    <div style={{ background: "#f5f5f4", minHeight: "calc(100vh - 70px)" }}>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
