const express = require('express');
const router = express.Router();
const QueryController = require('../controllers/queryController');
const pool = require('../db'); // import the pool
const cache = require('../services/cache'); // import the cache service

const queryController = new QueryController(pool, cache);

// Change route to /checkin and accept userId as a query parameter
router.post('/checkin', (req, res) => {
    const userId = req.query.userId;
    const lock = req.query.lock;
    if (lock === '0') {
        // You can call your queryController method here and pass userId
        queryController.assignSeatWithoutLocks(req, res, userId);
    } else if(lock === '1') {
        console.log('inside assignSeatWithLocks', userId);
        // Query with lock
        queryController.assignSeatWithLocks(req, res, userId);
    } else if(lock === '2') {
        console.log('inside assignSeatWithLocksAndEfficiency', userId);
        // Query with lock efficiency
        queryController.assignSeatWithLocksAndEfficiency(req, res, userId);
    }
});

router.get('/get_blogs_without_cache_lock', (req, res) => {
    const id = req.query.id; // Access the query parameter
    const lock = req.query.lock;
    if (lock === '0') {
        // No cache lock
        queryController.getBlogsWithoutCacheLock(req, res, id);
    } else if (lock === '1') {
        // With cache lock
        queryController.getBlogsWithCacheLock(req, res, id);
    }
});

module.exports = router;