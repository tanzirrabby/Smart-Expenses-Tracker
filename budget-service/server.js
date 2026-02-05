const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- MONGODB CONNECTION ---
// Note: We use a DIFFERENT database name 'budget_db' to keep services isolated!
// NEW (Fixed)
// Load environment variables
require('dotenv').config();

// Connect to Cloud Database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Budget Service - Connected to Atlas Cloud'))
  .catch(err => console.error('❌ Cloud Connection Error:', err));
// --- SCHEMA ---
const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true }, // The limit (e.g., 500)
  updatedAt: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', budgetSchema);

// --- MIDDLEWARE (The same one we used before) ---
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'User ID missing' });
  req.userId = userId;
  next();
};

// --- ROUTES ---

// 1. Get My Budget
app.get('/api/budgets', authenticateUser, async (req, res) => {
  try {
    // Find the budget for this user
    const budget = await Budget.findOne({ userId: req.userId });
    res.json(budget || { amount: 0 }); // Return 0 if no budget set
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// 2. Set/Update My Budget
app.post('/api/budgets', authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Upsert: Update if exists, Create if new
    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId },
      { amount: amount, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    
    console.log(`💰 Budget Set: $${amount} for User ${req.userId}`);
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to set budget' });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Budget Service running on port ${PORT}`);
});