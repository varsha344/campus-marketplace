const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================
dotenv.config();


// ==========================================
// CREATE EXPRESS APPLICATION
// ==========================================
const app = express();


// ==========================================
// CORS CONFIGURATION
// ==========================================
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

// ==========================================
// REQUEST LOGGING
// ==========================================
app.use((req, res, next) => {

    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );

    next();
});
// ==========================================
// BODY PARSING MIDDLEWARE
// ==========================================
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// COOKIE PARSER
// ==========================================
app.use(cookieParser());


// ==========================================
// SESSION CONFIGURATION
// ==========================================
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


// ==========================================
// PRODUCT ROUTES
// ==========================================
app.use(
    "/api/products",
    productRoutes
);


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// BASIC TEST ROUTE
// ==========================================
app.get("/", (req, res) => {

    res.json({
        message: "Campus Marketplace API is running"
    });

});


// ==========================================
// GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================
app.use((err, req, res, next) => {

    console.error("Error:", err.message);

    res.status(500).json({

        message: "Something went wrong on the server",

        error: err.message

    });

});


// ==========================================
// MONGODB CONNECTION
// ==========================================
mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );


        // ==================================
        // START SERVER
        // ==================================
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