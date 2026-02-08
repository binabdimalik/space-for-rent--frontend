<<<<<<< HEAD
// src/App.js - Spaces for Rent
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import SpacesPage from "./pages/SpacesPage";
import SpaceDetailsPage from "./pages/SpaceDetailsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ListSpacePage from "./pages/ListSpacePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSpaces from "./pages/admin/AdminSpaces";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminChat from "./pages/admin/AdminChat";
import FloatingChat from "./components/chat/FloatingChat";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { SpacesProvider } from "./context/SpacesContext";
import { BookingsProvider } from "./context/BookingsContext";
import { AdminsProvider } from "./context/AdminsContext";
import { ClientsProvider } from "./context/ClientsContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <AuthProvider>
      <AdminsProvider>
      <ClientsProvider>
      <SpacesProvider>
      <BookingsProvider>
      <ChatProvider>
      <Router>
        <div className="App">
          <Navbar />
          <FloatingChat />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/spaces" element={<SpacesPage />} />
            <Route path="/spaces/:id" element={<SpaceDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/list-space" element={<ListSpacePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/spaces" element={<AdminSpaces />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/chat" element={<AdminChat />} />
          </Routes>
        </div>
      </Router>
      </ChatProvider>
      </BookingsProvider>
      </SpacesProvider>
      </ClientsProvider>
      </AdminsProvider>
    </AuthProvider>
  );
}

export default App;
=======
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
