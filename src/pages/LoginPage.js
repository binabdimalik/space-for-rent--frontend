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
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
        if (isLogin) {
      if (
        formData.email === 'superadmin@spacesforrent.com' &&
        formData.password === 'admin123'
      ) {
        login(
          {
            id: 1,
            name: 'Super Admin',
            email: 'superadmin@spacesforrent.com',
            role: 'super_admin'
          },
          'demo-token'
        );
        setTimeout(() => navigate('/admin'), 100);
        return;
      }
          const adminUser = validateAdminLogin
            ? validateAdminLogin(formData.email, formData.password)
            : null;

          if (adminUser) {
            login(adminUser, "demo-token");
            setTimeout(() => navigate("/admin"), 100);
            return;
          }

          if (selectedRole === "admin") {
            setError(
              "Invalid admin credentials. Only registered admins can access the admin panel.",
            );
            setLoading(false);
            return;
          }
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







}}}
