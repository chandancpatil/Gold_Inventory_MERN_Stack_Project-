import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // adjust path if needed
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Login Successful! Redirecting to Dashboard...");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <form className="container" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="main-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn">LOGIN</button>

        <p className="register-link">
          Don't have an account? <Link to="/Register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
