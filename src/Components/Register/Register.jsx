import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path if needed
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "phone") {
      // Only allow numbers and limit to 10 digits
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Optional: Save additional data to localStorage (for now)
      localStorage.setItem("username", formData.username);
      localStorage.setItem("phone", formData.phone);
      localStorage.setItem("email", formData.email);

      alert("Registration Successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page register-page">
      <form className="container" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="main-form">
          <label>Username</label>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <label>Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            placeholder="Enter 10 digit phone number" 
            value={formData.phone}
            onChange={handleChange} 
            pattern="[0-9]{10}"
            maxLength="10"
            required 
          />
          <label>Email</label>
          <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn">REGISTER</button>
        <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
