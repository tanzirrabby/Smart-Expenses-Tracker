const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// 1. CORS: Allow Frontend to talk to us
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// 2. LOGGING: Watch the traffic
app.use((req, res, next) => {
    console.log(`📨 GATEWAY: Proxying ${req.method} request to ${req.url}`);
    next();
});

// ⚠️ FIXED: We removed 'pathRewrite'. 
// We are passing the FULL URL to the services because PROJECT-STRUCTURE.md 
// shows they expect the full '/api/...' path.

// 3. PROXY: Auth Service (Port 3001)
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true
}));

// 4. PROXY: Expense Service (Port 3002)
app.use('/api/expenses', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true
}));

// 5. PROXY: Budget Service (Port 3003)
app.use('/api/budget', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true
}));

// 6. PROXY: Analytics Service (Port 3004)
app.use('/api/analytics', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true
}));

// 7. PROXY: Notification Service (Port 3005)
app.use('/api/notifications', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true
}));

// Start the Gateway
app.listen(PORT, () => {
    console.log(`🚦 GATEWAY RUNNING ON PORT ${PORT}`);
});