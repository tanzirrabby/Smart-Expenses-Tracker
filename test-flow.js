const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testExpenseFlow() {
  console.log('🧪 Starting Test Flow...\n');

  try {
    // 1. Register a test user
    console.log('1️⃣ Registering test user...');
    const testEmail = `testuser${Date.now()}@test.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      username: `user${Date.now()}`,
      email: testEmail,
      password: 'Test@123'
    });
    
    const token = registerRes.data.token;
    const userId = registerRes.data.user.id;
    console.log(`✅ Registered: ${testEmail}`);
    console.log(`🔐 Token: ${token.substring(0, 20)}...`);
    console.log(`👤 User ID: ${userId}\n`);

    // 2. Add an EXPENSE
    console.log('2️⃣ Adding an EXPENSE...');
    const expenseRes = await axios.post(`${API_URL}/expenses`, {
      description: 'Test Lunch',
      amount: 15.50,
      type: 'EXPENSE',
      category: 'food',
      date: new Date()
    }, {
      headers: {
        'user-id': userId,
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Expense added:', expenseRes.data.expense._id);
    console.log(`   Amount: $${expenseRes.data.expense.amount}`);
    console.log(`   Description: ${expenseRes.data.expense.description}\n`);

    // 3. Add an INCOME
    console.log('3️⃣ Adding an INCOME...');
    const incomeRes = await axios.post(`${API_URL}/expenses`, {
      description: 'Freelance Project',
      amount: 500,
      type: 'INCOME',
      category: 'freelance',
      date: new Date()
    }, {
      headers: {
        'user-id': userId,
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Income added:', incomeRes.data.expense._id);
    console.log(`   Amount: $${incomeRes.data.expense.amount}`);
    console.log(`   Type: ${incomeRes.data.expense.type}\n`);

    // 4. Fetch all transactions
    console.log('4️⃣ Fetching all transactions...');
    const allRes = await axios.get(`${API_URL}/expenses`, {
      headers: {
        'user-id': userId,
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Total transactions: ${allRes.data.expenses.length}`);
    console.log('📊 Summary:');
    console.log(`   Total Income: $${allRes.data.summary.totalIncome}`);
    console.log(`   Total Expenses: $${allRes.data.summary.totalExpenses}`);
    console.log(`   Balance: $${allRes.data.summary.balance}\n`);

    // 5. Filter by date
    console.log('5️⃣ Filtering by date (today only)...');
    const today = new Date().toISOString().split('T')[0];
    const dateRes = await axios.get(`${API_URL}/expenses`, {
      params: {
        startDate: today,
        endDate: today
      },
      headers: {
        'user-id': userId,
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Transactions for today: ${dateRes.data.expenses.length}\n`);

    // 6. Filter by type
    console.log('6️⃣ Filtering by type (INCOME only)...');
    const incomeOnlyRes = await axios.get(`${API_URL}/expenses`, {
      params: {
        type: 'INCOME'
      },
      headers: {
        'user-id': userId,
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Income transactions: ${incomeOnlyRes.data.expenses.length}`);
    console.log(`   Total Income: $${incomeOnlyRes.data.summary.totalIncome}\n`);

    console.log('✅ ALL TESTS PASSED! 🎉\n');
    console.log('Frontend Testing Steps:');
    console.log('1. Go to http://localhost:5173');
    console.log(`2. Register with email: ${testEmail}`);
    console.log('3. Password: Test@123');
    console.log('4. Try adding an expense from the dashboard');
    console.log('5. Verify it appears in the "Recent Transactions" list');
    console.log('6. Check the summary updates correctly');

  } catch (err) {
    console.error('❌ Test Failed!');
    console.error('Error:', err.message);
    if (err.response?.data) {
      console.error('Response Data:', err.response.data);
    }
    process.exit(1);
  }
}

testExpenseFlow();
