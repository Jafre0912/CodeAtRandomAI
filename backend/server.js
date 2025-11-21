require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Essential for React to talk to Node
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.send('CodeAtRandom AI Backend is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});