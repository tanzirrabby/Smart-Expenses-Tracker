import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = 'http://localhost:3000/api';

// Category definitions with icons and colors
const CATEGORIES = {
  INCOME: [
    { id: 'salary', label: 'Salary', icon: '💼', color: '#10b981' },
    { id: 'freelance', label: 'Freelance', icon: '🎨', color: '#10b981' },
    { id: 'investment', label: 'Investment', icon: '📈', color: '#10b981' },
    { id: 'bonus', label: 'Bonus', icon: '🎁', color: '#10b981' },
    { id: 'other_income', label: 'Other', icon: '💰', color: '#10b981' }
  ],
  EXPENSE: [
    { id: 'food', label: 'Food', icon: '🍔', color: '#ef4444' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: '#ef4444' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ef4444' },
    { id: 'utilities', label: 'Utilities', icon: '💡', color: '#ef4444' },
    { id: 'rent', label: 'Rent', icon: '🏠', color: '#ef4444' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ef4444' },
    { id: 'health', label: 'Health', icon: '🏥', color: '#ef4444' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📺', color: '#ef4444' },
    { id: 'other_expense', label: 'Other', icon: '📌', color: '#ef4444' }
  ]
};

// Time period helpers
const getDateRange = (period) => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  switch (period) {
    case 'week':
      return { startDate: startOfWeek.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    case 'month':
      return { startDate: startOfMonth.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    case 'year':
      return { startDate: startOfYear.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    default:
      return {};
  }
};

function Dashboard({ user, onLogout }) {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  
  // Form state
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Display state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState('month');
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });

  // Reset category when transaction type changes
  useEffect(() => {
    if (transactionType === 'INCOME') {
      setCategory('salary');
    } else {
      setCategory('food');
    }
  }, [transactionType]);

  // Load transactions when component mounts or period changes
  useEffect(() => {
    if (user && user.id) {
      fetchTransactions();
    }
  }, [user, timePeriod]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const dateRange = getDateRange(timePeriod);
      
      console.log('📥 Fetching transactions with params:', { ...dateRange, timePeriod });
      
      const res = await axios.get(`${API_URL}/expenses`, {
        headers: { 
          'user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        params: dateRange
      });
      
      console.log('📊 Backend response:', res.data);
      setTransactions(res.data.expenses || []);
      setSummary(res.data.summary || { totalIncome: 0, totalExpenses: 0, balance: 0 });
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    console.log('📝 Form submission - Amount:', amount, 'Description:', description, 'Type:', transactionType, 'Category:', category);
    
    if (!amount || !description) {
      console.warn('❌ Validation failed - Missing fields');
      alert('Please fill in all fields (Amount and Description required)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const txnType = transactionType; // Save the type before any state changes
      
      console.log('📤 Sending transaction to backend:', { description, amount: Number(amount), type: txnType, category, date });
      
      await axios.post(`${API_URL}/expenses`, 
        { 
          description,
          amount: Number(amount), 
          type: txnType,
          category,
          date: new Date(date)
        },
        { 
          headers: { 
            'user-id': user.id,
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Transaction saved successfully');
      setAmount('');
      setDescription('');
      setTransactionType('EXPENSE');
      setCategory('food');
      setDate(new Date().toISOString().split('T')[0]);
      fetchTransactions();
      alert(`✅ ${txnType === 'INCOME' ? 'Income' : 'Expense'} added successfully!`);
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Failed to add transaction. Details: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const cats = transactionType === 'INCOME' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
    const cat = cats.find(c => c.id === categoryId);
    return cat ? cat.icon : '📌';
  };

  const getCategoryLabel = (categoryId) => {
    const cats = transactionType === 'INCOME' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
    const cat = cats.find(c => c.id === categoryId);
    return cat ? cat.label : 'Other';
  };

  // Export to CSV
  const getCSVData = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const data = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      getCategoryLabel(t.category),
      t.description,
      t.type === 'INCOME' ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`
    ]);
    return { headers, data };
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('dashboard-report');
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF');
    }
  };

  const currentCategories = transactionType === 'INCOME' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  return (
    <div id="dashboard-report" style={{
      minHeight: '100vh',
      background: isDarkMode 
        ? '#1a1a1a' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        color: isDarkMode ? '#fff' : 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>💳 Smart Tracker</h1>
          <p style={{ margin: '0', opacity: 0.9 }}>Welcome, <strong>{user.username}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={exportToPDF}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            📄 PDF
          </button>

          <CSVLink 
            data={getCSVData().data} 
            headers={getCSVData().headers}
            filename={`expense-report-${new Date().toISOString().split('T')[0]}.csv`}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            📊 CSV
          </CSVLink>

          <button 
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Income Card */}
          <div style={{
            background: isDarkMode ? '#2d2d2d' : 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: '5px solid #10b981'
          }}>
            <p style={{ margin: '0 0 10px 0', color: isDarkMode ? '#aaa' : '#666', fontSize: '14px', fontWeight: '500' }}>Total Income</p>
            <h2 style={{ margin: '0', color: '#10b981', fontSize: '28px' }}>💰 ${summary.totalIncome.toFixed(2)}</h2>
          </div>

          {/* Expense Card */}
          <div style={{
            background: isDarkMode ? '#2d2d2d' : 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: '5px solid #ef4444'
          }}>
            <p style={{ margin: '0 0 10px 0', color: isDarkMode ? '#aaa' : '#666', fontSize: '14px', fontWeight: '500' }}>Total Expenses</p>
            <h2 style={{ margin: '0', color: '#ef4444', fontSize: '28px' }}>🛒 ${summary.totalExpenses.toFixed(2)}</h2>
          </div>

          {/* Balance Card */}
          <div style={{
            background: isDarkMode ? '#2d2d2d' : 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            borderLeft: '5px solid #3b82f6'
          }}>
            <p style={{ margin: '0 0 10px 0', color: isDarkMode ? '#aaa' : '#666', fontSize: '14px', fontWeight: '500' }}>Current Balance</p>
            <h2 style={{ margin: '0', color: '#3b82f6', fontSize: '28px' }}>
              💵 ${summary.balance.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Add Transaction Form */}
          <div style={{
            background: isDarkMode ? '#2d2d2d' : 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: isDarkMode ? '#fff' : '#333' }}>Add Transaction</h3>
            
            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Transaction Type Toggle */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTransactionType('INCOME')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    background: transactionType === 'INCOME' ? '#10b981' : (isDarkMode ? '#444' : '#e5e7eb'),
                    color: transactionType === 'INCOME' ? 'white' : (isDarkMode ? '#ccc' : '#666'),
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  💰 Income
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('EXPENSE')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    background: transactionType === 'EXPENSE' ? '#ef4444' : (isDarkMode ? '#444' : '#e5e7eb'),
                    color: transactionType === 'EXPENSE' ? 'white' : (isDarkMode ? '#ccc' : '#666'),
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  🛒 Expense
                </button>
              </div>

              {/* Amount */}
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                step="0.01"
                style={{
                  padding: '10px',
                  border: '1px solid ' + (isDarkMode ? '#444' : '#ddd'),
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: isDarkMode ? '#1a1a1a' : 'white',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />

              {/* Description */}
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px',
                  border: '1px solid ' + (isDarkMode ? '#444' : '#ddd'),
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: isDarkMode ? '#1a1a1a' : 'white',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />

              {/* Category Dropdown */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px',
                  border: '1px solid ' + (isDarkMode ? '#444' : '#ddd'),
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: isDarkMode ? '#1a1a1a' : 'white',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              >
                {currentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              {/* Date */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px',
                  border: '1px solid ' + (isDarkMode ? '#444' : '#ddd'),
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: isDarkMode ? '#1a1a1a' : 'white',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px',
                  background: transactionType === 'INCOME' ? '#10b981' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1,
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? 'Adding...' : '➕ Add Transaction'}
              </button>
            </form>
          </div>

          {/* Transactions List */}
          <div style={{
            background: isDarkMode ? '#2d2d2d' : 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: isDarkMode ? '#fff' : '#333' }}>Recent Transactions</h3>
              
              {/* Time Period Filter */}
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid ' + (isDarkMode ? '#444' : '#ddd'),
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  background: isDarkMode ? '#1a1a1a' : 'white',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Transactions */}
            <div style={{
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {transactions.length === 0 ? (
                <p style={{ color: isDarkMode ? '#666' : '#999', textAlign: 'center', padding: '20px' }}>No transactions yet</p>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderBottom: '1px solid ' + (isDarkMode ? '#444' : '#eee'),
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = isDarkMode ? '#3d3d3d' : '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{getCategoryIcon(t.category)}</span>
                        <div>
                          <p style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: isDarkMode ? '#fff' : '#333' }}>
                            {t.description}
                          </p>
                          <p style={{ margin: '0', fontSize: '12px', color: isDarkMode ? '#aaa' : '#999' }}>
                            {new Date(t.date).toLocaleDateString()} • {getCategoryLabel(t.category)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: t.type === 'INCOME' ? '#10b981' : '#ef4444'
                    }}>
                      {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
