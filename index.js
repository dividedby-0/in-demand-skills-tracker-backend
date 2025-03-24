const express = require("express");
const CustomError = require("./errors");
const cors = require("cors");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const setRoutes = require("./routes/setRoutes");

const app = express();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    throw new CustomError('MongoDB connection error', 500);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/custom-set", authMiddleware.verifyToken, setRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
