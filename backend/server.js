const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const Product = require("./models/product");

const app = express();

const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/product-manager")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


// Test Route
app.get("/", (req, res) => {
    res.send("Product Manager API is running");
});


// CREATE - Add Product
app.post("/api/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product Created Successfully",
            product: product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
});


// READ - Get All Products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});


// UPDATE - Update Product
app.put("/api/products/:id", async (req, res) => {
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

        res.status(200).json({
            message: "Product Updated Successfully",
            product: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});


// DELETE - Delete Product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product Deleted Successfully",
            product: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});