const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://AhmadAqeel:lfsmDataBase39.43.182.86@clusterforlfms.xn5ai.mongodb.net/?retryWrites=true&w=majority&appName=clusterForLFMS",
           
        );

        console.log("Connected to MongoDB");

        // Create indexes for faster searching
        const db = mongoose.connection.db;
        await db.collection("lostitems").createIndex({ Category: 1, Location: 1, DateLost: 1 });
        await db.collection("founditems").createIndex({ Category: 1, Location: 1, DateFound: 1 });

        console.log("Indexes Created Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
