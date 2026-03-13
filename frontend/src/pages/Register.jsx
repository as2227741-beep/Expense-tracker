import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container} className="fade-in">
        <div style={styles.header}>
          <div style={styles.logo}>₿</div>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Start tracking your finances</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "radial-gradient(ellipse at 50% 0%, rgba(232,184,109,0.06) 0%, transparent 60%)",
  },
  container: { width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "1.5rem" },
  header: { textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" },
  logo: {
    width: 56, height: 56,
    background: "var(--accent-dim)",
    border: "1px solid rgba(232,184,109,0.3)",
    borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.5rem", marginBottom: "0.5rem",
  },
  title: { fontSize: "1.75rem", color: "var(--text)" },
  subtitle: { color: "var(--text-muted)", fontSize: "0.9rem" },
  form: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  switchText: { textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" },
  link: { color: "var(--accent)", textDecoration: "none", fontWeight: 600 },
};
