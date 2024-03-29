// Express
const express = require("express");
const app = express();

// Dotenv
require("dotenv").config();

// Cors
const cors = require("cors");

// MongoDB
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://user:${process.env.MONGODB_PASSWORD}@cluster0.hplg3.mongodb.net/${process.env.MONGODB_CLUSTER}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Routes
const authRoutes = require("./routes/auth/auth");
const adminJobRoutes = require("./routes/admin/job");
const userJobRoutes = require("./routes/user/job");
const userProfileRoutes = require("./routes/user/profile");
const userApplicationRoutes = require("./routes/user/application");
const adminApplicationRoutes = require("./routes/admin/application");

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/admin/job", adminJobRoutes);
app.use("/api/admin/application", adminApplicationRoutes);

app.use("/api/user/job", userJobRoutes);
app.use("/api/user/application", userApplicationRoutes);
app.use("/api/user/profile", userProfileRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server started on port 4000");
});
