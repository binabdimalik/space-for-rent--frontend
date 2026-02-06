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




}}
