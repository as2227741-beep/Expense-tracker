import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const s = {
    page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(108,142,245,0.08) 0%, transparent 60%), var(--bg)' },
    card: { width:'100%', maxWidth:'420px', background:'var(--surface)', borderRadius:'20px',
      border:'1px solid var(--border)', padding:'48px 40px' },
    logo: { fontSize:'28px', fontFamily:'var(--font-display)', color:'var(--text)', marginBottom:'8px' },
    sub: { color:'var(--text-muted)', fontSize:'14px', marginBottom:'36px' },
    label: { display:'block', fontSize:'13px', fontWeight:'500', color:'var(--text-muted)', marginBottom:'8px' },
    input: { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'10px',
      padding:'12px 16px', color:'var(--text)', fontSize:'15px', outline:'none',
      transition:'border 0.2s', marginBottom:'16px' },
    btn: { width:'100%', padding:'14px', background:'var(--accent)', border:'none', borderRadius:'10px',
      color:'#fff', fontSize:'15px', fontWeight:'600', marginTop:'8px',
      opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' },
    error: { background:'var(--red-dim)', color:'var(--red)', padding:'12px 16px', borderRadius:'10px',
      fontSize:'14px', marginBottom:'16px', border:'1px solid rgba(255,92,115,0.2)' },
    toggle: { textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text-muted)' },
    toggleBtn: { background:'none', border:'none', color:'var(--accent)', fontWeight:'600', cursor:'pointer', marginLeft:'4px' }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>💰 Spendly</div>
        <div style={s.sub}>{mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}</div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handle}>
          {mode === 'register' && (
            <>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="John Doe" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </>
          )}
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={s.btn} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={s.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button style={s.toggleBtn} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
