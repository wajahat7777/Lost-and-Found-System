const LostItem = require('../models/lostItemModel');
const FoundItem = require('../models/foundItemModel');

// Search items controller
const searchItems = async (req, res) => {
    console.log('\n--------------------');
    console.log('Search Endpoint Hit!');
    console.log('Time:', new Date().toISOString());
    console.log('Query Parameters Received:', req.query);
    console.log('--------------------\n');

    try {
        const { 
            type,
            category,
            location,
            startDate,
            endDate,
            sortBy = 'newest',
            page = 1,
            limit = 10
        } = req.query;
        
        console.log('Parsed Parameters:', {
            type,
            category,
            location,
            dateRange: { startDate, endDate },
            sortBy,
            page,
            limit
        });
        
        const skip = (page - 1) * parseInt(limit);

        // Build query based on filters
        const searchQuery = {};
        
        // Category filter
        if (category && category !== 'all') {
            searchQuery.Category = category;
        }
        
        // Location filter
        if (location && location !== 'all') {
            searchQuery.Location = { $regex: location, $options: 'i' };
        }
        
        // Date range filter
        if (startDate || endDate) {
            const dateQuery = {};
            if (startDate) {
                dateQuery.$gte = new Date(startDate);
            }
            if (endDate) {
                dateQuery.$lte = new Date(endDate);
            }
            // Apply date filter to either DateLost or DateFound based on item type
            if (type === 'lost') {
                searchQuery.DateLost = dateQuery;
            } else if (type === 'found') {
                searchQuery.DateFound = dateQuery;
            } else {
                searchQuery.$or = [
                    { DateLost: dateQuery },
                    { DateFound: dateQuery }
                ];
            }
        }

        // Determine sort order
        const sortOrder = sortBy === 'oldest' ? 1 : -1;
        const sortOptions = type === 'found' 
            ? { DateFound: sortOrder }
            : { DateLost: sortOrder };

        console.log('Constructed MongoDB Query:', JSON.stringify(searchQuery, null, 2));

        let lostItems = [];
        let foundItems = [];
        let totalLost = 0;
        let totalFound = 0;

        if (type === 'found') {
            console.log('Searching for FOUND items...');
            foundItems = await FoundItem.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort(sortOptions);
            totalFound = await FoundItem.countDocuments(searchQuery);
            console.log(`Found ${foundItems.length} items`);
        } else if (type === 'lost') {
            console.log('Searching for LOST items...');
            lostItems = await LostItem.find(searchQuery)
                .skip(skip)
                .limit(parseInt(limit))
                .sort(sortOptions);
            totalLost = await LostItem.countDocuments(searchQuery);
            console.log(`Found ${lostItems.length} items`);
        } else {
            console.log('Searching for BOTH lost and found items...');
            // If no type specified, get both lost and found items
            [lostItems, foundItems] = await Promise.all([
                LostItem.find(searchQuery)
                    .skip(skip)
                    .limit(parseInt(limit/2))
                    .sort({ DateLost: sortOrder }),
                FoundItem.find(searchQuery)
                    .skip(skip)
                    .limit(parseInt(limit/2))
                    .sort({ DateFound: sortOrder })
            ]);
            [totalLost, totalFound] = await Promise.all([
                LostItem.countDocuments(searchQuery),
                FoundItem.countDocuments(searchQuery)
            ]);
            console.log(`Found ${lostItems.length} lost items and ${foundItems.length} found items`);
        }

        const total = totalLost + totalFound;
        const totalPages = Math.ceil(total / parseInt(limit));

        const response = {
            success: true,
            lostItems,
            foundItems,
            pagination: {
                total,
                page: parseInt(page),
                totalPages,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            },
            filters: {
                type,
                category,
                location,
                dateRange: {
                    startDate,
                    endDate
                },
                sortBy
            }
        };

        console.log('Sending Response:', {
            success: true,
            itemCounts: {
                lost: lostItems.length,
                found: foundItems.length
            },
            pagination: response.pagination,
            appliedFilters: response.filters
        });
        console.log('--------------------\n');

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in search endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching items',
            error: error.message
        });
    }
};

module.exports = {
    searchItems
}; 