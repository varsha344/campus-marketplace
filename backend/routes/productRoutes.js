
const express = require("express");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const router = express.Router();

// GET all products with search, filter, and sort
router.get("/", async (req, res, next) => {
    try {
        const { search, category, sort } = req.query;
        const filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        const sortOption = {};

        if (sort === "price_asc") {
            sortOption.price = 1;
        } else if (sort === "price_desc") {
            sortOption.price = -1;
        }

        const products = await Product.find(filter).sort(sortOption);

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// GET product by ID
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// CREATE product
router.post("/", async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        return res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

// UPDATE product
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// DELETE product
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
