<<<<<<< HEAD
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiShield, FiHome } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../context/AuthContext';
import { AdminsContext } from '../context/AdminsContext';
import { ClientsContext } from '../context/ClientsContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { validateAdminLogin } = useContext(AdminsContext);
    const { validateClientLogin, registerClient } = useContext(ClientsContext);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState('client'); // 'client' or 'admin'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Handle login or registration
        if (formData.email && formData.password) {
            try {
                if (isLogin) {
                    // LOGIN FLOW
                    
                    // Check for super admin first (regardless of selected role)
                    if (formData.email === 'superadmin@spacesforrent.com' && formData.password === 'admin123') {
                        login({
                            id: 1,
                            name: 'Super Admin',
                            email: 'superadmin@spacesforrent.com',
                            role: 'super_admin'
                        }, 'demo-token');
                        setTimeout(() => navigate('/admin'), 100);
                        return;
                    }
                    
                    // Check for other registered admins
                    const adminUser = validateAdminLogin ? validateAdminLogin(formData.email, formData.password) : null;
                    if (adminUser) {
                        login(adminUser, 'demo-token');
                        setTimeout(() => navigate('/admin'), 100);
                        return;
                    }
                    
                    // If admin role selected but credentials invalid
                    if (selectedRole === 'admin') {
                        setError('Invalid admin credentials. Only registered admins can access the admin panel.');
                        setLoading(false);
                        return;
                    }
                    
                    // Client login - validate against registered clients
                    const clientUser = validateClientLogin ? validateClientLogin(formData.email, formData.password) : null;
                    if (clientUser) {
                        login(clientUser, 'demo-token');
                        setTimeout(() => navigate('/spaces'), 100);
                        return;
                    } else {
                        setError('Invalid email or password. Please check your credentials or sign up.');
                        setLoading(false);
                        return;
                    }
                } else {
                    // REGISTRATION FLOW
                    if (!formData.name) {
                        setError('Please enter your full name.');
                        setLoading(false);
                        return;
                    }
                    
                    // Register new client
                    const result = registerClient({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    });
                    
                    if (result.success) {
                        // Auto-login after registration
                        login({
                            id: result.client.id,
                            name: result.client.name,
                            email: result.client.email,
                            role: 'user'
                        }, 'demo-token');
                        setTimeout(() => navigate('/spaces'), 100);
                        return;
                    } else {
                        setError(result.message || 'Registration failed. Please try again.');
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error('Login error:', err);
                setError('Something went wrong. Please try again.');
                setLoading(false);
            }
        } else {
            setError('Please fill in all fields');
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Social login would redirect to OAuth provider
        alert(`${provider} login will be implemented with OAuth!`);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="login-subtitle">
                        {isLogin 
                            ? 'Sign in to continue to Spaces for Rent' 
                            : 'Join us to find or list your perfect space'}
                    </p>

                    {/* Role Selection */}
                    <div className="role-selection" style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '14px', color: '#6a7282', marginBottom: '12px', textAlign: 'center' }}>
                            I am signing in as:
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('client')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    border: selectedRole === 'client' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    background: selectedRole === 'client' ? '#eff6ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FiHome size={24} color={selectedRole === 'client' ? '#2563eb' : '#6a7282'} style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: 600, color: selectedRole === 'client' ? '#2563eb' : '#1e3a8a' }}>Client</div>
                                <div style={{ fontSize: '12px', color: '#6a7282' }}>Browse & book spaces</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('admin')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    border: selectedRole === 'admin' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    background: selectedRole === 'admin' ? '#eff6ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FiShield size={24} color={selectedRole === 'admin' ? '#2563eb' : '#6a7282'} style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: 600, color: selectedRole === 'admin' ? '#2563eb' : '#1e3a8a' }}>Admin</div>
                                <div style={{ fontSize: '12px', color: '#6a7282' }}>Manage spaces & users</div>
                            </button>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="social-login">
                        <button 
                            className="social-btn"
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <FcGoogle size={20} />
                            Continue with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">or</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{ 
                            background: '#fee2e2', 
                            color: '#991b1b', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            marginBottom: '16px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">
                                    <FiUser size={16} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">
                                <FiMail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiLock size={16} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">
                                    <FiLock size={16} />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full"
                            disabled={loading}
                            style={{ marginTop: '8px' }}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>

                        {isLogin && selectedRole === 'client' && (
                            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                <Link 
                                    to="/forgot-password" 
                                    style={{ 
                                        color: '#2563eb', 
                                        fontSize: '14px', 
                                        textDecoration: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        )}
                    </form>

                    {/* Toggle Login/Register */}
                    <p className="login-link">
                        {isLogin ? (
                            <>Don't have an account? <button onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Sign up</button></>
                        ) : (
                            <>Already have an account? <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Sign in</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
=======
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiShield, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { AdminsContext } from "../context/AdminsContext";
import { ClientsContext } from "../context/ClientsContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { validateAdminLogin } = useContext(AdminsContext);
  const { validateClientLogin, registerClient } = useContext(ClientsContext);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("client"); // 'client' or 'admin'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Handle login or registration
    if (formData.email && formData.password) {
      try {
        if (isLogin) {
          // LOGIN FLOW

          // Check for super admin first (regardless of selected role)
          if (
            formData.email === "superadmin@spacesforrent.com" &&
            formData.password === "admin123"
          ) {
            login(
              {
                id: 1,
                name: "Super Admin",
                email: "superadmin@spacesforrent.com",
                role: "super_admin",
              },
              "demo-token",
            );
            setTimeout(() => navigate("/admin"), 100);
            return;
          }

          // Check for other registered admins
          const adminUser = validateAdminLogin
            ? validateAdminLogin(formData.email, formData.password)
            : null;
          if (adminUser) {
            login(adminUser, "demo-token");
            setTimeout(() => navigate("/admin"), 100);
            return;
          }

          // If admin role selected but credentials invalid
          if (selectedRole === "admin") {
            setError(
              "Invalid admin credentials. Only registered admins can access the admin panel.",
            );
            setLoading(false);
            return;
          }

          // Client login - validate against registered clients
          const clientUser = validateClientLogin
            ? validateClientLogin(formData.email, formData.password)
            : null;
          if (clientUser) {
            login(clientUser, "demo-token");
            setTimeout(() => navigate("/spaces"), 100);
            return;
          } else {
            setError(
              "Invalid email or password. Please check your credentials or sign up.",
            );
            setLoading(false);
            return;
          }
        } else {
          // REGISTRATION FLOW
          if (!formData.name) {
            setError("Please enter your full name.");
            setLoading(false);
            return;
          }

          // Register new client
          const result = registerClient({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });

          if (result.success) {
            // Auto-login after registration
            login(
              {
                id: result.client.id,
                name: result.client.name,
                email: result.client.email,
                role: "user",
              },
              "demo-token",
            );
            setTimeout(() => navigate("/spaces"), 100);
            return;
          } else {
            setError(
              result.message || "Registration failed. Please try again.",
            );
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields");
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Social login would redirect to OAuth provider
    alert(`${provider} login will be implemented with OAuth!`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? "Sign in to continue to Spaces for Rent"
              : "Join us to find or list your perfect space"}
          </p>

          {/* Role Selection */}
          <div className="role-selection" style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#6a7282",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              I am signing in as:
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                style={{
                  flex: 1,
                  padding: "16px",
                  border:
                    selectedRole === "client"
                      ? "2px solid #2563eb"
                      : "2px solid #e5e7eb",
                  borderRadius: "12px",
                  background: selectedRole === "client" ? "#eff6ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <FiHome
                  size={24}
                  color={selectedRole === "client" ? "#2563eb" : "#6a7282"}
                  style={{ marginBottom: "8px" }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    color: selectedRole === "client" ? "#2563eb" : "#1e3a8a",
                  }}
                >
                  Client
                </div>
                <div style={{ fontSize: "12px", color: "#6a7282" }}>
                  Browse & book spaces
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                style={{
                  flex: 1,
                  padding: "16px",
                  border:
                    selectedRole === "admin"
                      ? "2px solid #2563eb"
                      : "2px solid #e5e7eb",
                  borderRadius: "12px",
                  background: selectedRole === "admin" ? "#eff6ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <FiShield
                  size={24}
                  color={selectedRole === "admin" ? "#2563eb" : "#6a7282"}
                  style={{ marginBottom: "8px" }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    color: selectedRole === "admin" ? "#2563eb" : "#1e3a8a",
                  }}
                >
                  Admin
                </div>
                <div style={{ fontSize: "12px", color: "#6a7282" }}>
                  Manage spaces & users
                </div>
              </button>
            </div>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button
              className="social-btn"
              onClick={() => handleSocialLogin("Google")}
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or</span>
            <div className="divider-line"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <FiUser size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <FiMail size={16} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock size={16} />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">
                  <FiLock size={16} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>

            {isLogin && selectedRole === "client" && (
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#2563eb",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>

          {/* Toggle Login/Register */}
          <p className="login-link">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
};

export default LoginPage;
