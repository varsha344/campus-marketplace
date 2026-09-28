const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
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