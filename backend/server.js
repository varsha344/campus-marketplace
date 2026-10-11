
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

// Request logging middleware
app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );
    next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "campusmarketplace-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

// Product routes
app.use("/api/products", productRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Basic test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Campus Marketplace API is running"
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    // Handle invalid product data
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Product validation failed",
            errors: Object.values(err.errors).map(
                (error) => error.message
            )
        });
    }

    // Handle invalid MongoDB IDs
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    // Handle duplicate values
    if (err.code === 11000) {
        return res.status(409).json({
            message: "This value already exists"
        });
    }

    // Handle other errors
    return res.status(500).json({
        message: "Something went wrong on the server"
    });
});

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(5000, () => {
            console.log(
                "Server running on http://localhost:5000"
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });