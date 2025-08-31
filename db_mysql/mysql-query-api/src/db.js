const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'Shubhakar@123',
//   database: 'sys_design',
//   waitForConnections: true,
//   connectionLimit: 10,  // tune based on load
//   queueLimit: 0
// });

// module.exports = pool;



module.exports = {
    createConnection: async () => {
        return  await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'Shubhakar@123',
            database: 'sys_design'
        });
    }
};

