import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
      });

      setSuccess(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080d1a",
        color: "white",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          borderRadius: "15px",
          background: "#111a2e",
          border: "1px solid #24314d",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Register for AI-DPR Guardian
        </p>

        {error && (
          <div
            style={{
              background: "#451a1a",
              color: "#ff8a8a",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#063b2a",
              color: "#4ade80",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "18px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0b1324",
              color: "white",
              boxSizing: "border-box",
            }}
          />

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "18px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0b1324",
              color: "white",
              boxSizing: "border-box",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "22px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0b1324",
              color: "white",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}