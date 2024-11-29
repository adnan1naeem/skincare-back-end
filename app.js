const express = require("express");
const mongoose = require("mongoose");
const cron = require ("node-cron");
const {fetchAndProcessUrls} = require ("./src/cron/amazonScrapingCron");
const bodyParser = require("body-parser");
// const authRoutes = require('./routes/Auth');
const path = require('path');
const router = require("./src/routes");
require("dotenv").config();
const app = express();
app.use(require("morgan")("dev"));
var cors = require('cors')
// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.get("/api/test", (req, res) => {
  return res.status(200).send("Server Running");
});
app.set("view engine", "jade");
// Routes
app.use("/api", router);
// MongoDB Connection
mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error(err));

// Cron job for price scraping of amazon urls

cron.schedule('0 13 * * *', async () => {
  console.log('Cron job started at 1:00 PM');
   const results = await fetchAndProcessUrls();
   console.log('Final Scraping Results:', results);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
