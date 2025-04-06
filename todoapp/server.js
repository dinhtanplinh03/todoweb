require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();



// Middleware
app.use(express.json());
app.use(cors());



// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const authRoutes = require("./src/routes/authRoute");
app.use("/api/auth", authRoutes);
const taskRoutes = require("./src/routes/taskRoute");
app.use("/api/tasks", taskRoutes);
const userRoutes = require("./src/routes/userRoute");
app.use("/api/users", userRoutes);



// API đơn giản kiểm tra server
app.get("/", (req, res) => {
    res.send("Todo App API is running...");
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
