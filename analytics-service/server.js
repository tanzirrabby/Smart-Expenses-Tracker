const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (using expense database to read data)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Analytics Service - MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Expense Schema (read-only for analytics)
const expenseSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  paymentMethod: String,
  tags: [String],
  createdAt: Date
});

const Expense = mongoose.model('Expense', expenseSchema);

// Middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }
  req.userId = userId;
  next();
};

// Get Monthly Summary
app.get('/api/analytics/monthly-summary', authenticateUser, async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = {};

    expenses.forEach(exp => {
      if (!categoryBreakdown[exp.category]) {
        categoryBreakdown[exp.category] = 0;
      }
      categoryBreakdown[exp.category] += exp.amount;
    });

    res.json({
      period: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
      totalSpent,
      transactionCount: expenses.length,
      categoryBreakdown,
      averagePerTransaction: expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error generating monthly summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Get Spending Trends (Last 6 months)
app.get('/api/analytics/trends', authenticateUser, async (req, res) => {
  try {
    const months = 6;
    const trends = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const expenses = await Expense.find({
        userId: req.userId,
        date: { $gte: startDate, $lte: endDate }
      });

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      trends.push({
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        totalSpent: total,
        transactionCount: expenses.length
      });
    }

    res.json(trends);
  } catch (error) {
    console.error('Error generating trends:', error);
    res.status(500).json({ error: 'Failed to generate trends' });
  }
});

// Get Category-wise Analysis
app.get('/api/analytics/category-analysis', authenticateUser, async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    
    let startDate = new Date();
    
    switch(period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'month':
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const analysis = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);

    const totalSpent = analysis.reduce((sum, cat) => sum + cat.totalSpent, 0);

    const categoriesWithPercentage = analysis.map(cat => ({
      category: cat._id,
      totalSpent: cat.totalSpent,
      count: cat.count,
      avgAmount: cat.avgAmount.toFixed(2),
      percentage: ((cat.totalSpent / totalSpent) * 100).toFixed(2)
    }));

    res.json({
      period: period || 'month',
      categories: categoriesWithPercentage,
      totalSpent,
      topCategory: categoriesWithPercentage[0]?.category || 'None'
    });
  } catch (error) {
    console.error('Error in category analysis:', error);
    res.status(500).json({ error: 'Failed to analyze categories' });
  }
});

// Get Daily Spending Pattern
app.get('/api/analytics/daily-pattern', authenticateUser, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo }
    });

    const dailySpending = {};
    
    expenses.forEach(exp => {
      const day = exp.date.toISOString().split('T')[0];
      if (!dailySpending[day]) {
        dailySpending[day] = 0;
      }
      dailySpending[day] += exp.amount;
    });

    const dailyData = Object.entries(dailySpending)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const avgDailySpending = dailyData.length > 0 
      ? (dailyData.reduce((sum, d) => sum + d.amount, 0) / dailyData.length).toFixed(2)
      : 0;

    res.json({
      dailyData,
      avgDailySpending,
      period: 'Last 30 days'
    });
  } catch (error) {
    console.error('Error generating daily pattern:', error);
    res.status(500).json({ error: 'Failed to generate daily pattern' });
  }
});

// Get Top Expenses
app.get('/api/analytics/top-expenses', authenticateUser, async (req, res) => {
  try {
    const { limit } = req.query;
    
    const topExpenses = await Expense.find({ userId: req.userId })
      .sort({ amount: -1 })
      .limit(parseInt(limit) || 10);

    res.json(topExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top expenses' });
  }
});

// Get Spending Insights (AI-like recommendations)
app.get('/api/analytics/insights', authenticateUser, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo }
    });

    const insights = [];
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category analysis
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    // Find highest spending category
    const highestCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

    if (highestCategory) {
      const percentage = ((highestCategory[1] / totalSpent) * 100).toFixed(1);
      insights.push({
        type: 'high_category_spending',
        message: `${highestCategory[0]} is your highest expense at ${percentage}% of total spending`,
        category: highestCategory[0],
        amount: highestCategory[1]
      });
    }

    // Weekend vs Weekday spending
    let weekendSpending = 0;
    let weekdaySpending = 0;

    expenses.forEach(exp => {
      const day = new Date(exp.date).getDay();
      if (day === 0 || day === 6) {
        weekendSpending += exp.amount;
      } else {
        weekdaySpending += exp.amount;
      }
    });

    if (weekendSpending > weekdaySpending * 1.3) {
      insights.push({
        type: 'weekend_spending',
        message: 'You spend significantly more on weekends. Consider planning weekend activities with a budget.',
        weekendTotal: weekendSpending,
        weekdayTotal: weekdaySpending
      });
    }

    // Average daily spending
    const avgDaily = (totalSpent / 30).toFixed(2);
    insights.push({
      type: 'average_daily',
      message: `Your average daily spending is $${avgDaily}`,
      amount: parseFloat(avgDaily)
    });

    res.json({
      insights,
      totalExpenses: expenses.length,
      totalSpent,
      period: 'Last 30 days'
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'analytics-service' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Analytics Service running on port ${PORT}`);
});
