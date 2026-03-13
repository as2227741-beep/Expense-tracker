import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, List, PlusCircle, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: List, label: "Transactions" },
  { to: "/add", icon: PlusCircle, label: "Add New" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>₿</div>
          <div>
            <div style={styles.logoText}>Expenzo</div>
            <div style={styles.logoSub}>Finance Tracker</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.userArea}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <User size={16} />
            </div>
            <div>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  root: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: 240,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 1rem",
    position: "sticky",
    top: 0,
    height: "100vh",
    flexShrink: 0,
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0 0.5rem",
    marginBottom: "2rem",
  },
  logoIcon: {
    width: 38, height: 38,
    background: "var(--accent-dim)",
    border: "1px solid rgba(232,184,109,0.3)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  logoText: { fontFamily: "Syne", fontWeight: 800, fontSize: "1rem", color: "var(--text)" },
  logoSub: { fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 },
  nav: { display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "0.7rem 0.875rem",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontFamily: "Syne",
    fontWeight: 600,
    transition: "all 0.15s",
  },
  navItemActive: {
    background: "var(--accent-dim)",
    color: "var(--accent)",
    border: "1px solid rgba(232,184,109,0.15)",
  },
  userArea: {
    borderTop: "1px solid var(--border)",
    paddingTop: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userInfo: { display: "flex", alignItems: "center", gap: "0.625rem", flex: 1, minWidth: 0 },
  avatar: {
    width: 32, height: 32,
    background: "var(--surface2)",
    border: "1px solid var(--border2)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
  userName: { fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userEmail: { fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-dim)",
    padding: "0.4rem",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    flexShrink: 0,
    transition: "color 0.2s",
  },
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
};
