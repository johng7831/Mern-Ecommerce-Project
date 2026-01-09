const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());



// routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
