import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiCalendar,
  FiSearch,
  FiEye,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiX,
  FiMessageCircle,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { BookingsContext } from "../../context/BookingsContext";

const AdminBookings = () => {
  const { user } = useContext(AuthContext);
  const { bookings: contextBookings, updateBookingStatus } =
    useContext(BookingsContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const isAdmin =
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      user?.email === "superadmin@spacesforrent.com";
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Transform context bookings to match expected format
  const bookings = contextBookings.map((b) => ({
    id: b.id,
    space_title: b.spaceTitle,
    user_name: b.clientName,
    user_email: b.clientEmail,
    user_phone: b.clientPhone,
    start_date: b.startDate,
    end_date: b.endDate,
    start_time: b.startTime,
    end_time: b.endTime,
    total_amount: b.totalAmount,
    status: b.status,
    payment_status: b.paymentStatus,
    payment_method: b.paymentMethod || "Credit Card",
    payment_date: b.createdAt,
  }));

  const handleStatusChange = async (id, newStatus) => {
    updateBookingStatus(id, newStatus);
  };



  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
        <nav>
          <Link to="/admin" className="admin-nav-link">
            <FiGrid size={18} />
            Dashboard
          </Link>
          <Link to="/admin/spaces" className="admin-nav-link">
            <FiHome size={18} />
            Spaces
          </Link>
          <Link to="/admin/users" className="admin-nav-link">
            <FiUsers size={18} />
            Users
          </Link>
          <Link to="/admin/bookings" className="admin-nav-link active">
            <FiCalendar size={18} />
            Bookings
          </Link>
          <Link to="/admin/payments" className="admin-nav-link">
            <FiDollarSign size={18} />
            Payments
          </Link>
          <Link to="/admin/chat" className="admin-nav-link">
            <FiMessageCircle size={18} />
            Live Chat
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Manage Bookings</h1>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6a7282",
              }}
            />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "40px" }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input"
            style={{ width: "180px" }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Space</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Date & Time</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{booking.space_title}</td>
                  <td>{booking.user_name}</td>
                  <td>
                    <div style={{ fontSize: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "2px",
                        }}
                      >
                        <FiMail size={12} color="#6a7282" />
                        <a
                          href={`mailto:${booking.user_email}`}
                          style={{ color: "#2563eb", textDecoration: "none" }}
                        >
                          {booking.user_email}
                        </a>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiPhone size={12} color="#6a7282" />
                        <a
                          href={`tel:${booking.user_phone}`}
                          style={{ color: "#1e3a8a", textDecoration: "none" }}
                        >
                          {booking.user_phone}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px" }}>
                      <div style={{ fontWeight: 600 }}>
                        {booking.start_date}
                      </div>
                      <div style={{ color: "#6a7282" }}>
                        {booking.start_time} - {booking.end_time}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px" }}>
                      <div style={{ fontWeight: 700, color: "#2563eb" }}>
                        ${booking.total_amount}
                      </div>
                      <span
                        className={`status-badge ${booking.payment_status === "paid" ? "status-available" : "status-pending"}`}
                        style={{ fontSize: "10px", padding: "2px 6px" }}
                      >
                        {booking.payment_status === "paid"
                          ? "✓ Paid"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                        className="form-input"
                        style={{
                          padding: "6px 10px",
                          fontSize: "12px",
                          width: "auto",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "6px" }}
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p>No bookings found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2 className="modal-title" style={{ margin: 0 }}>
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn btn-ghost btn-sm"
                style={{ padding: "4px" }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Space Info */}
            <div
              style={{
                background: "#f5f5f4",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  color: "#1e3a8a",
                  marginBottom: "4px",
                }}
              >
                {selectedBooking.space_title}
              </h3>
              <p style={{ color: "#6a7282", fontSize: "14px" }}>
                {selectedBooking.start_date} • {selectedBooking.start_time} -{" "}
                {selectedBooking.end_time}
              </p>
            </div>

            {/* Client Info */}
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                <FiUsers size={14} style={{ marginRight: "6px" }} />
                Client Information
              </h4>
              <div
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: "8px" }}>
                  {selectedBooking.user_name}
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                    fontSize: "14px",
                  }}
                >
                  <FiMail size={14} color="#2563eb" />
                  <a
                    href={`mailto:${selectedBooking.user_email}`}
                    style={{ color: "#2563eb" }}
                  >
                    {selectedBooking.user_email}
                  </a>
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <FiPhone size={14} color="#059669" />
                  <a
                    href={`tel:${selectedBooking.user_phone}`}
                    style={{ color: "#059669" }}
                  >
                    {selectedBooking.user_phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                <FiDollarSign size={14} style={{ marginRight: "6px" }} />
                Payment Information
              </h4>
              <div
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6a7282" }}>Amount:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#2563eb",
                      fontSize: "18px",
                    }}
                  >
                    ${selectedBooking.total_amount}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6a7282" }}>Payment Status:</span>
                  <span
                    className={`status-badge ${selectedBooking.payment_status === "paid" ? "status-available" : "status-pending"}`}
                  >
                    {selectedBooking.payment_status === "paid"
                      ? "✓ Paid"
                      : "⏳ Pending"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6a7282" }}>Payment Method:</span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedBooking.payment_method}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#6a7282" }}>Payment Date:</span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedBooking.payment_date}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Status */}
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  fontWeight: 600,
                  color: "#1e3a8a",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                <FiCalendar size={14} style={{ marginRight: "6px" }} />
                Booking Status
              </h4>
              <select
                value={selectedBooking.status}
                onChange={(e) => {
                  handleStatusChange(selectedBooking.id, e.target.value);
                  setSelectedBooking({
                    ...selectedBooking,
                    status: e.target.value,
                  });
                }}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="btn btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
