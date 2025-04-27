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

exports.searchNearbyItems = async (req, res) => {
    try {
        const { lat, lng, radius = 5, type = 'all' } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required.' });
        }
        const center = [parseFloat(lng), parseFloat(lat)];
        const distance = parseFloat(radius) * 1000; // meters
        let lostItems = [], foundItems = [];
        if (type === 'lost' || type === 'all') {
            lostItems = await LostItem.find({
                locationPoint: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: center },
                        $maxDistance: distance
                    }
                }
            });
        }
        if (type === 'found' || type === 'all') {
            foundItems = await FoundItem.find({
                locationPoint: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: center },
                        $maxDistance: distance
                    }
                }
            });
        }
        return res.status(200).json({
            message: 'Nearby search results',
            lostItems,
            foundItems
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
