const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const digitalIdentityRoutes = require('./routes/digitalIdentity');
const hubRoutes = require('./routes/hub');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/tmf-api/digitalIdentityManagement/v4/digitalIdentity', digitalIdentityRoutes);
app.use('/api/hub', hubRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});