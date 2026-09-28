const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
// Search, Filter, and Sort
router.get("/", async (req, res, next) => {
    try {
        const { search, category, sort } = req.query;

        let filter = {};

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Sorting
        let sortOption = {};

        if (sort === "price_asc") {
            sortOption.price = 1;
        } else if (sort === "price_desc") {
            sortOption.price = -1;
        }

        const products = await Product.find(filter).sort(sortOption);

        res.json(products);

    } catch (error) {
        next(error);
    }
});


// GET product by ID
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        next(error);
    }
});


// CREATE product
router.post("/", async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {
        next(error);
    }
});


// UPDATE product
router.put("/:id", async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        next(error);
    }
});


// DELETE product
router.delete("/:id", async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;