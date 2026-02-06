import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiShield, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { AdminsContext } from "../context/AdminsContext";
import { ClientsContext } from "../context/ClientsContext";
