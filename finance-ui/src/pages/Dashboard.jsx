import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#6366f1','#22c55e','#ef4444','#f59e0b','#38bdf8','#ec4899','#a78bfa','#14b8a6']

export default function Dashboard() {
    const [summary, setSummary]       = useState({ totalIncome: 0, totalExpense: 0, totalSavings: 0 })
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/api/reports/summary').then(r => setSummary(r.data))
        axios.get('http://localhost:8080/api/transactions').then(r => setTransactions(r.data))
    }, [])

    const barData = [
        { name: 'Income',  amount: summary.totalIncome },
        { name: 'Expense', amount: summary.totalExpense },
        { name: 'Savings', amount: summary.totalSavings },
    ]

    // Build pie data from expense transactions grouped by category
    const pieData = Object.entries(
        transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount
                return acc
            }, {})
    ).map(([name, value]) => ({ name, value }))

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', padding:'10px 14px' }}>
                    <p style={{ color:'#94a3b8', fontSize:'12px', marginBottom:'4px' }}>{label || payload[0].name}</p>
                    <p style={{ color:'#818cf8', fontSize:'15px', fontWeight:'700' }}>₹{payload[0].value.toFixed(2)}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div>
            <h2 className="page-heading">Dashboard <span>Overview</span></h2>

            <div className="cards-grid">
                <div className="stat-card income">
                    <p className="stat-label">Total Income</p>
                    <p className="stat-value income">₹{summary.totalIncome.toFixed(2)}</p>
                </div>
                <div className="stat-card expense">
                    <p className="stat-label">Total Expense</p>
                    <p className="stat-value expense">₹{summary.totalExpense.toFixed(2)}</p>
                </div>
                <div className="stat-card savings">
                    <p className="stat-label">Net Savings</p>
                    <p className="stat-value savings">₹{summary.totalSavings.toFixed(2)}</p>
                </div>
            </div>

            <div className="panel">
                <p className="panel-title">Income vs Expense vs Savings</p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData} barSize={52}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                        <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:13 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill:'#64748b', fontSize:12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8" />
                                <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                        </defs>
                        <Bar dataKey="amount" radius={[8,8,0,0]} fill="url(#barGrad)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
                <div className="panel">
                    <p className="panel-title">Expense by Category</p>
                    {pieData.length === 0
                        ? <div className="empty-state">No expense data yet.</div>
                        : <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                                     dataKey="value" paddingAngle={3}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" iconSize={10}
                                        formatter={(v) => <span style={{ color:'#94a3b8', fontSize:'12px' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>

                <div className="panel">
                    <p className="panel-title">Recent Transactions</p>
                    {transactions.length === 0
                        ? <div className="empty-state">No transactions yet.</div>
                        : transactions.slice(0, 5).map(t => (
                            <div key={t.id} className="txn-row">
                                <div>
                                    <p className="txn-category">
                                        {t.category}
                                        <span className={`type-badge ${t.type.toLowerCase()}`}>{t.type}</span>
                                    </p>
                                    <p className="txn-desc">{t.description}</p>
                                    <p className="txn-date">{t.date}</p>
                                </div>
                                <p className={`txn-amount ${t.type.toLowerCase()}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}