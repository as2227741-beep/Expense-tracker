import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CATEGORIES = {
  expense: ['🍔 Food', '🚗 Transport', '🏠 Housing', '💊 Health', '🎮 Entertainment', '👗 Shopping', '📚 Education', '💡 Utilities', '📦 Other'],
  income: ['💼 Salary', '💻 Freelance', '📈 Investment', '🎁 Gift', '💰 Other']
};
const COLORS = ['#6c8ef5','#22d38b','#ff5c73','#f5a623','#a78bfa','#38bdf8','#fb7185','#34d399','#fbbf24'];

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, byCategory: [] });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [activeTab, setActiveTab] = useState('all');
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: CATEGORIES.expense[0], note: '', date: format(new Date(), 'yyyy-MM-dd') });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const params = { month: filter.month, year: filter.year };
    const [expRes, sumRes] = await Promise.all([
      axios.get('/api/expenses', { params }),
      axios.get('/api/expenses/summary', { params })
    ]);
    setExpenses(expRes.data);
    setSummary(sumRes.data);
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditItem(null); setForm({ title:'', amount:'', type:'expense', category:CATEGORIES.expense[0], note:'', date: format(new Date(),'yyyy-MM-dd') }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ title:item.title, amount:item.amount, type:item.type, category:item.category, note:item.note||'', date:item.date }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editItem) await axios.put(`/api/expenses/${editItem.id}`, form);
      else await axios.post('/api/expenses', form);
      setShowModal(false); fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await axios.delete(`/api/expenses/${id}`);
    fetchData();
  };

  const filtered = expenses.filter(e => activeTab === 'all' || e.type === activeTab);

  const pieData = summary.byCategory.filter(c => c.type === 'expense').map(c => ({
    name: c.category, value: c.total
  }));

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const s = {
    page: { minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' },
    nav: { background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'64px' },
    logo: { fontSize:'20px', fontFamily:'var(--font-display)', fontWeight:'700' },
    navRight: { display:'flex', alignItems:'center', gap:'16px' },
    userBadge: { background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'20px', padding:'6px 14px', fontSize:'14px', color:'var(--text-muted)' },
    logoutBtn: { background:'none', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px 14px', color:'var(--text-muted)', fontSize:'14px' },
    main: { flex:1, padding:'32px', maxWidth:'1200px', margin:'0 auto', width:'100%' },
    topRow: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'16px' },
    title: { fontSize:'26px', fontWeight:'700' },
    controls: { display:'flex', gap:'12px', alignItems:'center' },
    select: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 12px', color:'var(--text)', fontSize:'14px', outline:'none' },
    addBtn: { background:'var(--accent)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'600', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' },
    cards: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'28px' },
    card: (color) => ({ background:'var(--surface)', border:`1px solid var(--border)`, borderRadius:'var(--radius)', padding:'24px', borderTop:`3px solid ${color}` }),
    cardLabel: { fontSize:'12px', color:'var(--text-muted)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' },
    cardValue: (color) => ({ fontSize:'28px', fontWeight:'700', color }),
    grid: { display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:'20px', marginBottom:'28px' },
    panel: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'24px' },
    panelTitle: { fontSize:'15px', fontWeight:'600', marginBottom:'20px', color:'var(--text-muted)' },
    tabs: { display:'flex', gap:'4px', background:'var(--surface2)', borderRadius:'10px', padding:'4px', marginBottom:'20px', width:'fit-content' },
    tab: (active) => ({ padding:'6px 18px', borderRadius:'7px', border:'none', fontSize:'13px', fontWeight:'500',
      background: active ? 'var(--accent)' : 'none', color: active ? '#fff' : 'var(--text-muted)', cursor:'pointer', transition:'all 0.2s' }),
    list: { display:'flex', flexDirection:'column', gap:'10px' },
    item: { display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface2)', borderRadius:'10px', padding:'14px 16px', border:'1px solid var(--border)' },
    itemLeft: { display:'flex', alignItems:'center', gap:'12px' },
    emoji: (type) => ({ width:'40px', height:'40px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
      background: type === 'income' ? 'var(--green-dim)' : 'var(--red-dim)' }),
    itemTitle: { fontSize:'15px', fontWeight:'500' },
    itemMeta: { fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' },
    itemRight: { display:'flex', alignItems:'center', gap:'16px' },
    amount: (type) => ({ fontSize:'16px', fontWeight:'700', color: type === 'income' ? 'var(--green)' : 'var(--red)' }),
    actionBtns: { display:'flex', gap:'6px' },
    actionBtn: (color) => ({ background:'none', border:`1px solid ${color}20`, borderRadius:'6px', padding:'4px 10px', color, fontSize:'12px', cursor:'pointer' }),
    empty: { textAlign:'center', padding:'40px', color:'var(--text-muted)' },
    // Modal
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px' },
    modal: { background:'var(--surface)', borderRadius:'20px', border:'1px solid var(--border)', padding:'32px', width:'100%', maxWidth:'480px' },
    modalTitle: { fontSize:'20px', fontWeight:'700', marginBottom:'24px' },
    field: { marginBottom:'16px' },
    fieldLabel: { display:'block', fontSize:'13px', fontWeight:'500', color:'var(--text-muted)', marginBottom:'6px' },
    fieldInput: { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'11px 14px', color:'var(--text)', fontSize:'14px', outline:'none' },
    typeRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' },
    typeBtn: (active, color) => ({ padding:'10px', borderRadius:'10px', border:`2px solid ${active ? color : 'var(--border)'}`, background: active ? `${color}15` : 'none', color: active ? color : 'var(--text-muted)', fontWeight:'600', fontSize:'14px', cursor:'pointer', transition:'all 0.2s' }),
    modalFooter: { display:'flex', gap:'10px', marginTop:'24px' },
    cancelBtn: { flex:1, padding:'12px', background:'none', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text-muted)', fontWeight:'500', fontSize:'14px' },
    submitBtn: { flex:2, padding:'12px', background:'var(--accent)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:'600', fontSize:'14px' }
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo}>💰 Spendly</div>
        <div style={s.navRight}>
          <div style={s.userBadge}>👤 {user?.name}</div>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <main style={s.main}>
        {/* Header */}
        <div style={s.topRow}>
          <div style={s.title}>Dashboard</div>
          <div style={s.controls}>
            <select style={s.select} value={filter.month} onChange={e => setFilter({...filter, month: +e.target.value})}>
              {months.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <select style={s.select} value={filter.year} onChange={e => setFilter({...filter, year: +e.target.value})}>
              {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button style={s.addBtn} onClick={openAdd}>＋ Add Entry</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={s.cards}>
          <div style={s.card('var(--green)')}>
            <div style={s.cardLabel}>Total Income</div>
            <div style={s.cardValue('var(--green)')}>{fmt(summary.income)}</div>
          </div>
          <div style={s.card('var(--red)')}>
            <div style={s.cardLabel}>Total Expenses</div>
            <div style={s.cardValue('var(--red)')}>{fmt(summary.expense)}</div>
          </div>
          <div style={s.card('var(--accent)')}>
            <div style={s.cardLabel}>Balance</div>
            <div style={s.cardValue(summary.balance >= 0 ? 'var(--green)' : 'var(--red)')}>{fmt(summary.balance)}</div>
          </div>
        </div>

        {/* Charts + List */}
        <div style={s.grid}>
          <div style={s.panel}>
            <div style={s.panelTitle}>SPENDING BY CATEGORY</div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'12px' }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--text-muted)' }}>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:COLORS[i % COLORS.length] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={s.empty}>No expense data yet</div>}
          </div>

          <div style={s.panel}>
            <div style={s.panelTitle}>INCOME VS EXPENSES</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[{ name: months[filter.month-1], income: summary.income, expense: summary.expense }]} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} />
                <YAxis tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)' }} />
                <Bar dataKey="income" fill="var(--green)" radius={[6,6,0,0]} />
                <Bar dataKey="expense" fill="var(--red)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div style={s.panel}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
            <div style={s.panelTitle}>TRANSACTIONS</div>
            <div style={s.tabs}>
              {['all','income','expense'].map(t => (
                <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0
            ? <div style={s.empty}>No transactions found. Add one!</div>
            : <div style={s.list}>
                {filtered.map(item => (
                  <div key={item.id} style={s.item}>
                    <div style={s.itemLeft}>
                      <div style={s.emoji(item.type)}>{item.category.split(' ')[0]}</div>
                      <div>
                        <div style={s.itemTitle}>{item.title}</div>
                        <div style={s.itemMeta}>{item.category} · {item.date}</div>
                      </div>
                    </div>
                    <div style={s.itemRight}>
                      <span style={s.amount(item.type)}>{item.type === 'income' ? '+' : '-'}{fmt(item.amount)}</span>
                      <div style={s.actionBtns}>
                        <button style={s.actionBtn('var(--accent)')} onClick={() => openEdit(item)}>Edit</button>
                        <button style={s.actionBtn('var(--red)')} onClick={() => handleDelete(item.id)}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{editItem ? '✏️ Edit Entry' : '➕ New Entry'}</div>
            <form onSubmit={handleSubmit}>
              <div style={s.typeRow}>
                <button type="button" style={s.typeBtn(form.type==='expense','var(--red)')} onClick={() => setForm({...form, type:'expense', category:CATEGORIES.expense[0]})}>💸 Expense</button>
                <button type="button" style={s.typeBtn(form.type==='income','var(--green)')} onClick={() => setForm({...form, type:'income', category:CATEGORIES.income[0]})}>💰 Income</button>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Title</label>
                <input style={s.fieldInput} placeholder="e.g. Groceries" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Amount ($)</label>
                <input style={s.fieldInput} type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Category</label>
                <select style={s.fieldInput} value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                  {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Date</label>
                <input style={s.fieldInput} type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.fieldLabel}>Note (optional)</label>
                <input style={s.fieldInput} placeholder="Any notes..." value={form.note} onChange={e => setForm({...form, note:e.target.value})} />
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.submitBtn} disabled={loading}>{loading ? 'Saving...' : 'Save Entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
