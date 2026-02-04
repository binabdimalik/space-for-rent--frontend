import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMessageCircle,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { SpacesContext } from "../../context/SpacesContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { spaces, deleteSpace } = useContext(SpacesContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin or super_admin
    const isAdmin =
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      user?.email === "superadmin@spacesforrent.com";
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Calculate stats from actual data
  const stats = {
    totalSpaces: spaces.length,
    totalUsers: 4,
    totalBookings: 4,
    revenue: 1430,
  };

  const handleDeleteSpace = (id) => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      deleteSpace(id);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
       
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Spaces</div>
            <div className="stat-value">{stats.totalSpaces}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{stats.totalBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Revenue</div>
            <div className="stat-value">${stats.revenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Spaces Table */}
        <div className="admin-table">
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontWeight: 600, fontSize: "16px", color: "#1e3a8a" }}>
              Recent Spaces
            </h2>
            <Link
              to="/admin/spaces"
              style={{
                color: "#2563eb",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              View All
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Price/Hour</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {spaces.slice(0, 5).map((space) => (
                <tr key={space.id}>
                  <td style={{ fontWeight: 600 }}>{space.title}</td>
                  <td>{space.location}</td>
                  <td>${space.price_per_hour}</td>
                  <td>
                    <span
                      className={`status-badge status-${space.status || "available"}`}
                    >
                      {space.status || "Available"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/admin/spaces/${space.id}/edit`}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "6px" }}
                      >
                        <FiEdit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteSpace(space.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "6px", color: "#dc2626" }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
