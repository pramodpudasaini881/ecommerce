import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "node:util"; // Using native util for minimal dependencies if colors isn't installed
import users from "./data/users.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Create users individually to trigger the pre-save hook for password hashing
        for (const user of users) {
            await User.create(user);
        }

        console.log("Data Imported!".green || "Data Imported!");
        process.exit();
    } catch (error) {
        console.error(`${error.message}`.red || error.message);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log("Data Destroyed!".red || "Data Destroyed!");
        process.exit();
    } catch (error) {
        console.error(`${error.message}`.red || error.message);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
