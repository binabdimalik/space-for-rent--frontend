import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMapPin,
  FiImage,
  FiDollarSign,
  FiCheck,
  FiX,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AuthContext } from "../../context/AuthContext";
import { SpacesContext } from "../../context/SpacesContext";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Map click handler component
const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const AdminSpaces = () => {
  const { user } = useContext(AuthContext);
  const {
    spaces,
    addSpace,
    updateSpace,
    deleteSpace,
    toggleStatus,
    verifySpace,
    rejectSpace,
    getPendingSpaces,
  } = useContext(SpacesContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'pending'
  const [showModal, setShowModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [mapPosition, setMapPosition] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price_per_hour: "",
    capacity: "",
    amenities: "",
    image_url: "",
    latitude: "",
    longitude: "",
    status: "available",
  });

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

  // Update form data when map position changes
  useEffect(() => {
    if (mapPosition) {
      setFormData((prev) => ({
        ...prev,
        latitude: mapPosition[0],
        longitude: mapPosition[1],
      }));
    }
  }, [mapPosition]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      deleteSpace(id);
    }
  };

  const handleEdit = (space) => {
    setEditingSpace(space);
    setFormData({
      title: space.title || "",
      description: space.description || "",
      location: space.location || "",
      price_per_hour: space.price_per_hour || "",
      capacity: space.capacity || "",
      amenities: space.amenities || "",
      image_url: space.image_url || "",
      latitude: space.latitude || "",
      longitude: space.longitude || "",
      status: space.status || "available",
    });
    if (space.latitude && space.longitude) {
      setMapPosition([space.latitude, space.longitude]);
    } else {
      setMapPosition(null);
    }
    setImagePreview(space.image_url || "");
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSpace(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      price_per_hour: "",
      capacity: "",
      amenities: "",
      image_url: "",
      latitude: "",
      longitude: "",
      status: "available",
    });
    setMapPosition(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleStatusToggle = (id) => {
    toggleStatus(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo, create a local URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, image_url: url });
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingSpace) {
      updateSpace(editingSpace.id, formData);
    } else {
      addSpace(formData, true);
    }

    setShowModal(false);
  };

  // Get pending spaces count
  const pendingSpaces = getPendingSpaces();

  // Filter spaces based on active tab and search term
  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "pending") {
      return matchesSearch && space.verification_status === "pending";
    }
    return matchesSearch && space.verification_status !== "pending";
  });

  const handleVerify = (id) => {
    if (
      window.confirm(
        "Approve this space listing? It will be visible to all clients.",
      )
    ) {
      verifySpace(id);
    }
  };

  const handleReject = (id) => {
    if (
      window.confirm(
        "Reject this space listing? It will not be visible to clients.",
      )
    ) {
      rejectSpace(id);
    }
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
          <Link to="/admin/spaces" className="admin-nav-link active">
            <FiHome size={18} />
            Spaces
          </Link>
          <Link to="/admin/users" className="admin-nav-link">
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
          <h1 className="admin-title">Manage Spaces</h1>
          <button onClick={handleAdd} className="btn btn-primary">
            <FiPlus size={16} />
            Add Space
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            className={`btn ${activeTab === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("all")}
          >
            <FiHome size={16} />
            All Spaces
          </button>
          <button
            className={`btn ${activeTab === "pending" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("pending")}
            style={{ position: "relative" }}
          >
            <FiClock size={16} />
            Pending Verification
            {pendingSpaces.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#dc2626",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pendingSpaces.length}
              </span>
            )}
          </button>
        </div>

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
            placeholder="Search spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "40px" }}
          />
        </div>

        {/* Spaces Table */}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Title</th>
                <th>Location</th>
                <th>Price/Hour</th>
                {activeTab === "pending" ? (
                  <th>Submitted By</th>
                ) : (
                  <th>Status</th>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpaces.map((space) => (
                <tr key={space.id}>
                  <td>
                    <img
                      src={
                        space.image_url ||
                        "https://via.placeholder.com/60x40?text=No+Image"
                      }
                      alt={space.title}
                      style={{
                        width: "60px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{space.title}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FiMapPin size={12} />
                      {space.location}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: "#2563eb" }}>
                    ${space.price_per_hour}
                  </td>
                  {activeTab === "pending" ? (
                    <td>
                      <div style={{ fontSize: "13px" }}>
                        <div style={{ fontWeight: 600 }}>
                          {space.submitted_by?.name || "Unknown"}
                        </div>
                        <div style={{ color: "#6a7282", fontSize: "12px" }}>
                          {space.submitted_by?.email || ""}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "11px" }}>
                          {space.submitted_at}
                        </div>
                      </div>
                    </td>
                  ) : (
                    <td>
                      <button
                        onClick={() => handleStatusToggle(space.id)}
                        className={`status-badge ${space.status === "available" ? "status-available" : "status-booked"}`}
                        style={{ cursor: "pointer", border: "none" }}
                        title="Click to toggle status"
                      >
                        {space.status === "available"
                          ? "✓ Available"
                          : "✗ Rented"}
                      </button>
                    </td>
                  )}
                  <td>
                    {activeTab === "pending" ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleVerify(space.id)}
                          className="btn btn-sm"
                          style={{
                            padding: "6px 12px",
                            background: "#059669",
                            color: "white",
                          }}
                          title="Approve"
                        >
                          <FiCheck size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(space.id)}
                          className="btn btn-sm"
                          style={{
                            padding: "6px 12px",
                            background: "#dc2626",
                            color: "white",
                          }}
                          title="Reject"
                        >
                          <FiX size={16} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(space)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "6px" }}
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(space.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "6px", color: "#dc2626" }}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSpaces.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              {activeTab === "pending" ? "📋" : "🏠"}
            </div>
            <p>
              {activeTab === "pending"
                ? "No pending spaces to verify."
                : "No spaces found."}
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px", maxHeight: "90vh", overflow: "auto" }}
          >
            <h2 className="modal-title">
              {editingSpace ? "Edit Space" : "Add New Rental Space"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Image Upload Section */}
              <div className="form-group">
                <label className="form-label">
                  <FiImage size={16} />
                  Space Photo
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "150px",
                      height: "100px",
                      border: "2px dashed #e5e7eb",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "#f9fafb",
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <FiImage size={32} color="#9ca3af" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline btn-sm"
                      style={{ marginBottom: "8px" }}
                    >
                      Upload Photo
                    </button>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6a7282",
                        margin: "8px 0",
                      }}
                    >
                      Or enter image URL:
                    </p>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="form-input"
                      placeholder="https://..."
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-input"
                  placeholder="e.g., Modern Meeting Room"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="form-input"
                  rows="3"
                  placeholder="Describe the space, its features, and what makes it special..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiMapPin size={16} />
                  Address / Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="form-input"
                  placeholder="e.g., 123 Main Street, New York, NY"
                  required
                />
              </div>

              {/* Map Location Picker */}
              <div className="form-group">
                <label className="form-label">
                  <FiMapPin size={16} />
                  Pin Location on Map (click to set)
                </label>
                <div
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <MapContainer
                    center={mapPosition || [39.8283, -98.5795]}
                    zoom={mapPosition ? 13 : 4}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap"
                    />
                    <LocationPicker
                      position={mapPosition}
                      setPosition={setMapPosition}
                    />
                  </MapContainer>
                </div>
                {mapPosition && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#059669",
                      marginTop: "4px",
                    }}
                  >
                    📍 Location set: {mapPosition[0].toFixed(4)},{" "}
                    {mapPosition[1].toFixed(4)}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    <FiDollarSign size={16} />
                    Price/Hour ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_hour: e.target.value,
                      })
                    }
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="form-input"
                    min="1"
                    placeholder="Max people"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  className="form-input"
                  placeholder="WiFi, Projector, Kitchen, Parking..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editingSpace ? "Update Space" : "Add Space"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpaces;
