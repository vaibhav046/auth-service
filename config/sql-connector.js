
const sql = require('mssql')
const config = {
    user: process.env.MSSQL_USER || "",
    password: process.env.MSSQL_PASS || "",
    server: process.env.MSSQL_SERVER || "",
    database: process.env.MSSQL_DB || "",
    driver: 'msnodesql',
    options: {
        encrypt: true
    }
}
let poolPromise = null;
/**
 *   Sql connector setup function.
**/
setup = async () => {
    return poolPromise = await new sql.ConnectionPool(config)
        .connect()
        .then(pool => {
            console.log('Connected to MSSQL')
            return pool
        })
        .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

}

module.exports = setup();