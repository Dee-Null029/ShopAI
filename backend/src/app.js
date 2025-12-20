require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  const addr = server.address() || { address: '0.0.0.0', port: PORT };
  console.log(`Server running on ${addr.address}:${addr.port}`);
});
server.on('error', (err) => {
  console.error('Server error:', err);
});
