const semaphore = require('../services/semaphore');
class QueryController {
    constructor(db, cache) {
        this.db = db;
        this.cache = cache;
    }

    async assignSeatWithoutLocks(req, res, userId) {
        const conn = await this.db.createConnection(); // get dedicated connection
        try {
            await conn.beginTransaction();
            const query = `select id from seats where user_id is null order by id limit 1`;

            const results = await conn.query(query);
            console.log(`userId: ${userId}, seatId: ${results[0][0].id}`);
            const query2 = `update seats set user_id = ${userId} where id = ${results[0][0].id}`;
            await conn.query(query2);
            await conn.commit();
            res.json(true);
        } catch(err) {
            console.error(err);
            await conn.rollback();
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            //conn.release(); // return connection to pool
            conn.end()
        }
    }




    async assignSeatWithLocks(req, res, userId) {
        const conn = await this.db.createConnection(); // get dedicated connection
        try {
            await conn.beginTransaction();

            const [rows] = await conn.query(
            `SELECT id FROM seats WHERE user_id IS NULL ORDER BY id LIMIT 1 FOR UPDATE`
            );


            const seatId = rows[0].id;
            console.log(`userId ${userId} selected seatId ${seatId}`);

            await conn.query(
                `UPDATE seats SET user_id = ? WHERE id = ?`,
                [userId, seatId]
            );

            await conn.commit();
            console.log(`userId ${userId} got seatId ${seatId}`);
            res.json(true);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.end();
        }
    }

    async assignSeatWithLocksAndEfficiency(req, res, userId) {
        //Always create a new connection, re-using existing connection can cause concurrent requests to be interleaved
        // Example - Request When you call BEGIN (or beginTransaction()), you start a transaction bound to that connection.
        // Every query on that connection is part of the same transaction until COMMIT/ROLLBACK.
        // Node’s event loop schedules your async queries concurrently.
        // So all concurrent requests were  issuing queries onto the same socket/connection.
        // The driver (mysql2) serialized them on that connection, but they were all in the same transaction context.
        const conn = await this.db.createConnection(); // get dedicated connection
        try {
            await conn.beginTransaction();

            const [rows] = await conn.query(
            `SELECT id FROM seats WHERE user_id IS NULL ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED`
            );


            const seatId = rows[0].id;
            console.log(`userId ${userId} selected seatId ${seatId}`);

            await conn.query(
                `UPDATE seats SET user_id = ? WHERE id = ?`,
                [userId, seatId]
            );

            await conn.commit();
            console.log(`userId ${userId} got seatId ${seatId}`);
            res.json(true);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.end();
        }
    }  
    
    
    // New method to get blogs
    async getBlogsWithNoCacheLock(req, res, id) {
        const conn = await this.db.createConnection(); // get dedicated connection
        try {
            const cacheKey = `blogs_${id}`;
            const cachedBlogs = await this.cache.get(cacheKey);
            if (cachedBlogs) {
                console.log('Cache hit');
                return res.json({ message: 1, data: cachedBlogs });
            }

            console.log('Cache miss');
            const [rows] = await conn.query(
                `SELECT * FROM blogs WHERE id = ?`,
                [id]
            );

            await this.cache.set(cacheKey, rows);
            res.json({ message: 0, data: rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            conn.end();
        }
    }

    async getBlogsWithCacheLock(req, res, id) {
        const conn = await this.db.createConnection();
          try {
            const cacheKey = `blogs_${id}`;
            const cachedBlogs = await this.cache.get(cacheKey);
            if (cachedBlogs) {
                console.log('Cache hit');
                return res.json({ message: 1, data: cachedBlogs });
            }

            console.log('Cache miss');
            const waitingList = {};
            
            const [rows] = await conn.query(
                `SELECT * FROM blogs WHERE id = ?`,
                [id]
            );

            await this.cache.set(cacheKey, rows);
            res.json({ message: 0, data: rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            conn.end();
        }
    }
}

module.exports = QueryController;