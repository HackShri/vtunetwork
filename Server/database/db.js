const { config } = require('dotenv');
const mongoose = require('mongoose');
config()
const connectToDB = async () => {
    try {
        console.log(process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to the database');

    } catch (error) {
        console.error("mongodb connection failed");
        process.exit(1);
    }
}

module.exports = connectToDB;