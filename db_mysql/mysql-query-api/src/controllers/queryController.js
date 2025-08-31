
class QueryController {
    constructor(db) {
        this.db = db;
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
}

module.exports = QueryController;