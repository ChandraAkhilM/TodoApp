import React, { useState } from "react";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    // Proceed to login
    await login();
  };

  const login = async () => {
    setLoading(true);
    try {
      // Check for active session
      const currentSession = await account.get();
      if (currentSession) {
        alert("You are already logged in!");
        navigate("/Dashboard");
        setLoading(false);
        return;
      }
    } catch (error) {
      if (error.code !== 401) {
        console.error("Session check error:", error);
        alert("An error occurred. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Create a new session
    try {
      await account.createEmailPasswordSession(formData.email, formData.password);
      alert("Login Successful!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
