const port = 5000;
const app = require('./app');
const express = require('express');

console.log('Starting server...');
console.log('Port:', port);

app.listen(port, (error) => {
    if (error) {
        console.error('Server failed to start:', error);
        return;
    }
    console.log(`Server is running and listening on port ${port}`);
    console.log('Available routes:');
    console.log('POST /api/lfms/postLostItem');
});
