import { useEffect, useState } from 'react'
import axios from 'axios'

const CATEGORIES = ['Food', 'Rent', 'Salary', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Other']

export default function Budget() {
    const [budgets, setBudgets] = useState([])
    const [transactions, setTransactions] = useState([])
    const [form, setForm] = useState({ category: 'Food', limitAmount: '' })
    const [error, setError] = useState('')

    const load = () => {
        axios.get('http://localhost:8080/api/budgets').then(r => setBudgets(r.data))
        axios.get('http://localhost:8080/api/transactions').then(r => setTransactions(r.data))
    }
    useEffect(() => { load() }, [])

    const getSpent = (category) => transactions
        .filter(t => t.category === category && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

    const handleSubmit = () => {
        if (!form.limitAmount || isNaN(form.limitAmount) || Number(form.limitAmount) <= 0) {
            setError('Enter a valid limit amount.'); return
        }
        setError('')
        axios.post('http://localhost:8080/api/budgets', { ...form, limitAmount: Number(form.limitAmount) })
            .then(() => { load(); setForm({ category: 'Food', limitAmount: '' }) })
            .catch(() => setError('Failed to save budget. Is the backend running?'))
    }

    const handleDelete = (id) => axios.delete(`http://localhost:8080/api/budgets/${id}`).then(load)

    return (
        <div>
            <h2 className="page-heading">Budget <span>Tracker</span></h2>

            <div className="panel">
                <p className="panel-title">Set Category Budget</p>
                {error && <div className="error-msg">{error}</div>}
                <div className="form-grid">
                    <select className="form-input" value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input className="form-input" placeholder="Monthly Limit (₹)" value={form.limitAmount}
                           onChange={e => setForm({ ...form, limitAmount: e.target.value })} />
                </div>
                <button className="btn-primary" onClick={handleSubmit}>+ Set Budget</button>
            </div>

            <div className="panel">
                <p className="panel-title">Budget Status</p>
                {budgets.length === 0
                    ? <div className="empty-state">No budgets set. Add a category budget above.</div>
                    : budgets.map(b => {
                        const spent = getSpent(b.category)
                        const pct = Math.min((spent / b.limitAmount) * 100, 100)
                        const over = spent > b.limitAmount
                        const color = over ? '#ef4444' : pct > 75 ? '#f59e0b' : '#6366f1'
                        return (
                            <div key={b.id} className="budget-row">
                                <div className="budget-top">
                                    <div>
                                        <p className="budget-category">
                                            {b.category}
                                            {over && <span className="over-tag">OVER BUDGET</span>}
                                        </p>
                                        <p className="budget-amounts">
                                            Spent ₹{spent.toFixed(2)} &nbsp;/&nbsp; Limit ₹{b.limitAmount.toFixed(2)}
                                            &nbsp;·&nbsp; {pct.toFixed(0)}% used
                                        </p>
                                    </div>
                                    <button className="btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
                                </div>
                                <div className="progress-bg">
                                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}