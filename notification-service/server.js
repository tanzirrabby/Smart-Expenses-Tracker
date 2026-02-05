const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['budget_alert', 'budget_exceeded', 'weekly_summary', 'monthly_report', 'system'],
    required: true
  },
  message: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  channel: {
    type: String,
    enum: ['in-app', 'email', 'sms', 'push'],
    default: 'in-app'
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  readAt: Date,
  sentAt: Date
});

const Notification = mongoose.model('Notification', notificationSchema);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_notifications', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Notification Service - MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }
  req.userId = userId;
  next();
};

// Send Notification
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { userId, type, message, priority, channel, metadata } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'userId, type, and message are required' });
    }

    const notification = new Notification({
      userId,
      type,
      message,
      priority: priority || 'medium',
      channel: channel || 'in-app',
      metadata: metadata || {}
    });

    await notification.save();

    // Simulate sending notification
    // In production, you would integrate with:
    // - SendGrid/Mailgun for email
    // - Twilio for SMS
    // - Firebase Cloud Messaging for push notifications
    
    if (channel === 'email') {
      console.log(`📧 [EMAIL] To: ${userId} - ${message}`);
    } else if (channel === 'sms') {
      console.log(`📱 [SMS] To: ${userId} - ${message}`);
    } else if (channel === 'push') {
      console.log(`🔔 [PUSH] To: ${userId} - ${message}`);
    } else {
      console.log(`💬 [IN-APP] To: ${userId} - ${message}`);
    }

    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();

    res.status(201).json({
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// Get User Notifications
app.get('/api/notifications', authenticateUser, async (req, res) => {
  try {
    const { limit, unreadOnly } = req.query;
    
    let query = { userId: req.userId };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 50);

    const unreadCount = await Notification.countDocuments({
      userId: req.userId,
      isRead: false
    });

    res.json({
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark All as Read
app.put('/api/notifications/read-all', authenticateUser, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete Notification
app.delete('/api/notifications/:id', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get Unread Count
app.get('/api/notifications/unread-count', authenticateUser, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Send Weekly Summary (Cron job would trigger this)
app.post('/api/notifications/weekly-summary', async (req, res) => {
  try {
    const { userId, summary } = req.body;

    const message = `Weekly Summary: You spent $${summary.totalSpent} this week. Top category: ${summary.topCategory}`;

    const notification = new Notification({
      userId,
      type: 'weekly_summary',
      message,
      priority: 'medium',
      channel: 'email',
      metadata: summary
    });

    await notification.save();

    console.log(`📊 [WEEKLY SUMMARY] Sent to: ${userId}`);

    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();

    res.json({
      message: 'Weekly summary sent successfully',
      notification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send weekly summary' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notification-service' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});
