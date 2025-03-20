const LostItem = require("../models/lostItemModel");
const FoundItem = require("../models/foundItemModel");

exports.searchItems = async (req, res) => {
    try {
        const { category, location, date, type, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        // Build query dynamically
        const query = {};
        if (category) query.Category = category;
        if (location) query.Location = location;
        if (date) {
            const parsedDate = new Date(date);
            query.$or = [
                { DateLost: { $gte: parsedDate } }, 
                { DateFound: { $gte: parsedDate } }
            ];
        }

        let lostItems = [];
        let foundItems = [];

        // Check type parameter and fetch only the required data
        if (type === "lost") {
            lostItems = await LostItem.find(query)
                .sort({ DateLost: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);
        } else if (type === "found") {
            foundItems = await FoundItem.find(query)
                .sort({ DateFound: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);
        } else {
            // Fetch both if no specific type is mentioned
            [lostItems, foundItems] = await Promise.all([
                LostItem.find(query).sort({ DateLost: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
                FoundItem.find(query).sort({ DateFound: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize)
            ]);
        }

        return res.status(200).json({
            message: "Search results",
            lostItems,
            foundItems,
            pagination: { page: pageNumber, limit: pageSize }
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
