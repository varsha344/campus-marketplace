const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/productRoutes");
const logger = require("./middleware/logger");

const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({
        message: "Campus Marketplace API is running"
    });
});

app.use("/api/products", productRoutes);

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});