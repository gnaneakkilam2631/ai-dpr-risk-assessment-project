import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      if (result.access_token) {
        localStorage.setItem(
          "access_token",
          result.access_token
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed"
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
          AI-DPR Guardian
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Sign in to your account
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

        <form onSubmit={handleLogin}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}