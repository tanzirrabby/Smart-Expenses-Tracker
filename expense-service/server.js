const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Expense Schema
const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], default: 'EXPENSE' },
  category: { type: String, default: 'Other' },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Expense Service Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Auth Middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = userId;
  next();
};

// GET Expenses (Returns List + Summary)
app.get('/api/expenses', authenticateUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    
    // Calculate Totals
    const totalIncome = expenses
      .filter(e => e.type === 'INCOME')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalExpenses = expenses
      .filter(e => e.type === 'EXPENSE') // or undefined (for old data)
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Send the NEW format
    res.json({ 
      expenses, 
      summary: { totalIncome, totalExpenses, balance } 
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST Expense
app.post('/api/expenses', authenticateUser, async (req, res) => {
  try {
    const { amount, description, category, type } = req.body;
    const expense = new Expense({
      userId: req.userId,
      amount,
      description,
      category,
      type: type || 'EXPENSE'
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Expense Service running on port ${PORT}`);
});