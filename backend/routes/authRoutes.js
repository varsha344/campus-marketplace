const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SIGNUP
// ==========================================
router.post(
    "/signup",

    // Input validation
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
    ],

    async (req, res) => {
        try {

            // Check validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: errors.array()
                });
            }

            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword
            });

            // Send response
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {

            res.status(500).json({
                message: "Signup failed",
                error: error.message
            });
        }
    }
);


// ==========================================
// LOGIN
// ==========================================
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Store user ID in session
        req.session.userId = user._id.toString();

        // Send response
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ==========================================
// PROTECTED PROFILE ROUTE
// ==========================================
router.get("/profile", authMiddleware, async (req, res) => {
    try {

        // Find logged-in user
        const user = await User
            .findById(req.session.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send user profile
        res.json({
            message: "Protected profile accessed successfully",
            user: user
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to access profile",
            error: error.message
        });
    }
});


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;