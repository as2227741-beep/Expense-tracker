import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Filter } from "lucide-react";
import { expensesAPI } from "../api";

const CATEGORIES = ["Food", "Transport", "Housing", "Entertainment", "Health", "Shopping", "Education", "Salary", "Freelance", "Investment", "Other"];
const now = new Date();
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ month: String(now.getMonth() + 1), year: String(now.getFullYear()), type: "", category: "" });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.month && filters.year) { params.month = filters.month; params.year = filters.year; }
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      const res = await expensesAPI.getAll(params);
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [filters]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await expensesAPI.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - i));

  return (
    <div style={styles.page} className="fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Transactions</h1>
          <p style={styles.sub}>{expenses.length} records found</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Filter size={15} /> Filters
          </button>
          <button className="btn-primary" onClick={() => navigate("/add")}>+ Add New</button>
        </div>
      </div>

      {showFilters && (
        <div className="card fade-in" style={styles.filterCard}>
          <div style={styles.filterRow}>
            <div className="form-group">
              <label>Month</label>
              <select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
                <option value="">All months</option>
                {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : expenses.length === 0 ? (
          <div style={styles.empty}>No transactions found. <button className="btn-primary" style={{ marginLeft: 12 }} onClick={() => navigate("/add")}>Add one</button></div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>{e.title}</div>
                    {e.note && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{e.note}</div>}
                  </td>
                  <td style={styles.td}><span style={styles.catBadge}>{e.category}</span></td>
                  <td style={{ ...styles.td, color: "var(--text-muted)", fontSize: "0.875rem" }}>{e.date}</td>
                  <td style={styles.td}><span className={e.type === "income" ? "tag-income" : "tag-expense"}>{e.type}</span></td>
                  <td style={{ ...styles.td, textAlign: "right", fontFamily: "Syne", fontWeight: 700, color: e.type === "income" ? "var(--green)" : "var(--red)" }}>
                    {e.type === "expense" ? "-" : "+"}{fmt(e.amount)}
                  </td>
                  <td style={{ ...styles.td, display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                    <button className="btn-ghost" style={{ padding: "0.4rem" }} onClick={() => navigate(`/edit/${e.id}`)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(e.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 1100 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  title: { fontSize: "1.5rem" },
  sub: { color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" },
  filterCard: { display: "flex", flexDirection: "column", gap: "1rem" },
  filterRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { borderBottom: "1px solid var(--border)" },
  th: { padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Syne", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 },
  row: { borderBottom: "1px solid var(--border)", transition: "background 0.15s" },
  td: { padding: "1rem 1.25rem", fontSize: "0.9rem" },
  catBadge: { background: "var(--surface2)", color: "var(--text-muted)", padding: "0.25rem 0.6rem", borderRadius: 100, fontSize: "0.75rem" },
  empty: { padding: "3rem", textAlign: "center", color: "var(--text-muted)" },
};
