import { useEffect, useState } from 'react'
import axios from 'axios'

const CATEGORIES = ['Food','Rent','Salary','Transport','Shopping','Health','Entertainment','Other']

const emptyForm = { amount:'', type:'EXPENSE', category:'Food', description:'' }

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [form, setForm]                 = useState(emptyForm)
    const [editId, setEditId]             = useState(null)
    const [filter, setFilter]             = useState('ALL')
    const [error, setError]               = useState('')

    const load = () => axios.get('http://localhost:8080/api/transactions').then(r => setTransactions(r.data))
    useEffect(() => { load() }, [])

    const handleSubmit = () => {
        if (!form.amount || !form.description) { setError('Amount and description are required.'); return }
        if (isNaN(form.amount) || Number(form.amount) <= 0) { setError('Enter a valid positive amount.'); return }
        setError('')
        const payload = { ...form, amount: Number(form.amount) }
        const req = editId
            ? axios.put(`http://localhost:8080/api/transactions/${editId}`, payload)
            : axios.post('http://localhost:8080/api/transactions', payload)
        req.then(() => { load(); setForm(emptyForm); setEditId(null) })
            .catch(() => setError('Something went wrong. Is the backend running?'))
    }

    const handleEdit = (t) => {
        setEditId(t.id)
        setForm({ amount: t.amount, type: t.type, category: t.category, description: t.description })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancel = () => { setEditId(null); setForm(emptyForm); setError('') }

    const handleDelete = (id) => axios.delete(`http://localhost:8080/api/transactions/${id}`).then(load)

    const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter)

    return (
        <div>
            <h2 className="page-heading">Transactions <span>History</span></h2>

            <div className="panel">
                <p className="panel-title">{editId ? 'Edit Transaction' : 'Add New Transaction'}</p>
                {error && <div className="error-msg">{error}</div>}
                <div className="form-grid">
                    <input className="form-input" placeholder="Amount (₹)" value={form.amount}
                           onChange={e => setForm({ ...form, amount: e.target.value })} />
                    <select className="form-input" value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="EXPENSE">EXPENSE</option>
                        <option value="INCOME">INCOME</option>
                    </select>
                    <select className="form-input" value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input className="form-input" placeholder="Description" value={form.description}
                           onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ display:'flex', gap:'12px' }}>
                    <button className="btn-primary" onClick={handleSubmit}>
                        {editId ? '✓ Save Changes' : '+ Add Transaction'}
                    </button>
                    {editId && (
                        <button onClick={handleCancel}
                                style={{ background:'transparent', border:'1px solid #334155', color:'#94a3b8',
                                    borderRadius:'10px', padding:'11px 20px', fontSize:'14px', cursor:'pointer' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div className="panel">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                    <p className="panel-title" style={{ margin:0 }}>All Transactions</p>
                    <div style={{ display:'flex', gap:'8px' }}>
                        {['ALL','INCOME','EXPENSE'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                    style={{
                                        padding:'6px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                                        cursor:'pointer', border:'1px solid',
                                        background: filter === f ? (f==='INCOME' ? '#22c55e' : f==='EXPENSE' ? '#ef4444' : '#6366f1') : 'transparent',
                                        color: filter === f ? '#fff' : '#64748b',
                                        borderColor: filter === f ? 'transparent' : '#334155'
                                    }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0
                    ? <div className="empty-state">No transactions found.</div>
                    : filtered.map(t => (
                        <div key={t.id} className="txn-row">
                            <div>
                                <p className="txn-category">
                                    {t.category}
                                    <span className={`type-badge ${t.type.toLowerCase()}`}>{t.type}</span>
                                </p>
                                <p className="txn-desc">{t.description}</p>
                                <p className="txn-date">{t.date}</p>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                                <p className={`txn-amount ${t.type.toLowerCase()}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                </p>
                                <button className="btn-delete"
                                        style={{ background:'rgba(99,102,241,0.1)', color:'#818cf8',
                                            borderColor:'rgba(99,102,241,0.2)' }}
                                        onClick={() => handleEdit(t)}>
                                    Edit
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}