const mongoose = require('mongoose');

const uri = 'mongodb+srv://tanzirrabby34383_db_user:7P6NjRYCIcQATyDI@cluster0.phieywe.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});