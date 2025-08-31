const express = require('express');
const router = express.Router();
const QueryController = require('../controllers/queryController');
const pool = require('../db'); // import the pool

const queryController = new QueryController(pool);

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


module.exports = router;