import React, { useState, useEffect, useContext } from "react";
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
  FiSearch,
  FiShield,
  FiMessageCircle,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { AdminsContext } from "../../context/AdminsContext";
import { ClientsContext } from "../../context/ClientsContext";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const {
    admins,
    addAdmin,
    deleteAdmin: deleteAdminFromContext,
  } = useContext(AdminsContext);
  const { clients, deleteClient: deleteClientFromContext } =
    useContext(ClientsContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  // Check if current user is super_admin (check both role and email)
  const isSuperAdmin =
    user?.role === "super_admin" ||
    user?.email === "superadmin@spacesforrent.com";

  useEffect(() => {
    const isAdmin =
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      user?.email === "superadmin@spacesforrent.com";
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  const handleDeleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClientFromContext(id);
    }
  };

  const handleDeleteAdmin = (id) => {
    if (!isSuperAdmin) {
      alert("Only the Super Admin can delete administrators.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this admin?")) {
      deleteAdminFromContext(id);
    }
  };

  const handleEdit = (userData) => {
    setEditingUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      password: "",
      role: userData.role || "user",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    if (!isSuperAdmin) {
      alert("Only the Super Admin can add new administrators.");
      return;
    }
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser) {
      // Adding new admin - use AdminsContext
      if (!isSuperAdmin) {
        alert("Only the Super Admin can add new administrators.");
        setShowModal(false);
        return;
      }
      addAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }

    setShowModal(false);
  };

  // Filter admins and clients based on search term
  const filteredAdmins = (admins || []).filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredClients = (clients || []).filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: "80vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

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
          <Link to="/admin/users" className="admin-nav-link active">
            <FiUsers size={18} />
            Users
          </Link>
          <Link to="/admin/bookings" className="admin-nav-link">
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
          <h1 className="admin-title">Manage Users</h1>
          {isSuperAdmin && (
            <button onClick={handleAdd} className="btn btn-primary">
              <FiPlus size={16} />
              Add Admin
            </button>
          )}
        </div>

        {/* Super Admin Notice */}
        {isSuperAdmin && (
          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiShield size={18} style={{ color: "#d97706" }} />
            <span style={{ color: "#92400e", fontSize: "14px" }}>
              You are logged in as <strong>Super Admin</strong>. You can add and
              manage other administrators.
            </span>
          </div>
        )}

        {/* Search */}
        <div
          style={{
            marginBottom: "24px",
            position: "relative",
            maxWidth: "400px",
          }}
        >
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "40px" }}
          />
        </div>

        {/* Admin Users Section */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1f2937",
                margin: 0,
              }}
            >
              Administrators
            </h2>
            <span
              style={{
                background: "#dbeafe",
                color: "#1d4ed8",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {filteredAdmins.length}
            </span>
          </div>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  {isSuperAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isSuperAdmin ? 5 : 4}
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        padding: "24px",
                      }}
                    >
                      No administrators found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((adminData) => (
                    <tr key={adminData.id}>
                      <td style={{ fontWeight: 600 }}>{adminData.name}</td>
                      <td>{adminData.email}</td>
                      <td>
                        <span
                          style={{
                            background:
                              adminData.role === "super_admin"
                                ? "#fef3c7"
                                : "#dbeafe",
                            color:
                              adminData.role === "super_admin"
                                ? "#d97706"
                                : "#1d4ed8",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {adminData.role === "super_admin"
                            ? "Super Admin"
                            : "Admin"}
                        </span>
                      </td>
                      <td>{adminData.created_at}</td>
                      {isSuperAdmin && (
                        <td>
                          {adminData.role !== "super_admin" && (
                            <button
                              onClick={() => handleDeleteAdmin(adminData.id)}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: "6px", color: "#dc2626" }}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Users Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1f2937",
                margin: 0,
              }}
            >
              Clients
            </h2>
            <span
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {filteredClients.length}
            </span>
          </div>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        padding: "24px",
                      }}
                    >
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((clientData) => (
                    <tr key={clientData.id}>
                      <td style={{ fontWeight: 600 }}>{clientData.name}</td>
                      <td>{clientData.email}</td>
                      <td>{clientData.created_at}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleDeleteClient(clientData.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: "6px", color: "#dc2626" }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingUser ? "Edit Admin" : "Add New Admin"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  {editingUser
                    ? "New Password (leave blank to keep current)"
                    : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="form-input"
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  value="Admin"
                  className="form-input"
                  disabled
                  style={{ background: "#f3f4f6", cursor: "not-allowed" }}
                />
                <small
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Only admin accounts can be created from this panel
                </small>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
