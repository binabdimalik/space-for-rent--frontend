import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiEdit2,
  FiHome,
  FiPlus,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { BookingsContext } from "../context/BookingsContext";
import Footer from "../components/common/Footer";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { getBookingsByClient } = useContext(BookingsContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Redirect admins to admin dashboard - profile is for clients only
    const isAdmin =
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      user?.email === "superadmin@spacesforrent.com";
    if (isAdmin) {
      navigate("/admin");
      return;
    }

    // Get bookings for the current user by their email
    const userBookings = getBookingsByClient(user.email);
    setBookings(
      userBookings.map((b) => ({
        id: b.id,
        space_title: b.spaceTitle,
        space_location: b.location || "N/A",
        start_date: b.startDate,
        start_time: b.startTime || "09:00",
        end_time: b.endTime || "17:00",
        total_amount: b.totalAmount,
        status: b.status,
      })),
    );
    setLoading(false);
  }, [user, navigate, getBookingsByClient]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-available";
      case "pending":
        return "status-pending";
      case "completed":
        return "status-available";
      case "cancelled":
        return "status-booked";
      default:
        return "status-pending";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ background: "#f5f5f4", minHeight: "calc(100vh - 65px)" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Profile Header */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #3b5bdb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1e3a8a",
                  marginBottom: "4px",
                }}
              >
                {user.name || "User"}
              </h1>
              <p
                style={{
                  color: "#6a7282",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FiMail size={14} />
                {user.email}
              </p>
              {user.role === "admin" && (
                <span
                  className="status-badge status-pending"
                  style={{ marginTop: "8px", display: "inline-block" }}
                >
                  Admin
                </span>
              )}
            </div>
            <button className="btn btn-outline btn-sm">
              <FiEdit2 size={14} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* List Your Space Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
            borderRadius: "12px",
            padding: "24px 32px",
            marginBottom: "24px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiHome size={24} color="white" />
            </div>
            <div>
              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "18px",
                  marginBottom: "4px",
                }}
              >
                Own a Space?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                List your property and start earning from rentals
              </p>
            </div>
          </div>
          <Link
            to="/list-space"
            className="btn"
            style={{
              background: "white",
              color: "#2563eb",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiPlus size={16} />
            List Your Space
          </Link>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          <button
            className={`btn ${activeTab === "bookings" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
          <button
            className={`btn ${activeTab === "settings" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === "bookings" && (
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e3a8a",
                marginBottom: "16px",
              }}
            >
              Your Bookings
            </h2>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div
                className="empty-state"
                style={{ background: "white", borderRadius: "12px" }}
              >
                <div className="empty-state-icon">📅</div>
                <p>You haven't made any bookings yet.</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "16px" }}
                  onClick={() => navigate("/spaces")}
                >
                  Browse Spaces
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 700,
                          color: "#1e3a8a",
                          marginBottom: "8px",
                        }}
                      >
                        {booking.space_title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          color: "#6a7282",
                          fontSize: "14px",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiMapPin size={14} />
                          {booking.space_location}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiCalendar size={14} />
                          {booking.start_date}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiClock size={14} />
                          {booking.start_time} - {booking.end_time}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "20px",
                          color: "#2563eb",
                          marginBottom: "8px",
                        }}
                      >
                        ${booking.total_amount}
                      </div>
                      <span
                        className={`status-badge ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e3a8a",
                marginBottom: "24px",
              }}
            >
              Account Settings
            </h2>

            <div className="form-group">
              <label className="form-label">
                <FiUser size={16} />
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                defaultValue={user.name}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiMail size={16} />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                defaultValue={user.email}
                disabled
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button className="btn btn-primary">Save Changes</button>
              <button
                className="btn btn-outline"
                onClick={logout}
                style={{ color: "#dc2626", borderColor: "#dc2626" }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
