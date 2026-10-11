const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [1, "Price must be greater than 0"]
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        status: {
            type: String,
            enum: ["available", "sold"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);