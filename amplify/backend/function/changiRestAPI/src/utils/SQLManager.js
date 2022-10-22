const mysql = require('mysql');
// const mysql = require('/opt/nodejs/node_modules/mysql');
const SSMManager = require("./SSMManager");
// const SSMManager = require("/opt/nodejs/libs/SSMManager");

// let connection = undefined;
let sqlConnection = undefined;

const loadSQLConnection = async () => {
    sqlConnection = mysql.createConnection({
        host: (await SSMManager.getSecrets(process.env['rds_name'])).Value ?? null,
        user: (await SSMManager.getSecrets(process.env['rds_username'])).Value ?? null,
        password: (await SSMManager.getSecrets(process.env['rds_password'])).Value ?? null,
        port: (await SSMManager.getSecrets(process.env['rds_port'])).Value ?? null,
        database: (await SSMManager.getSecrets(process.env['rds_database'])).Value + '_' + process.env.ENV ?? null,
        multipleStatements: true,
    });
    await new Promise((req, rej) => {
        sqlConnection.connect(function (err) {
            if (err) rej(err)
            req()
        })
    });
    // connection = await sql.connect(sqlConfig);
}

const query = async (sqlStatement) => {
    if (!sqlConnection) await loadSQLConnection();
    try {
        return await new Promise((req, rej) => {
            sqlConnection.query(sqlStatement, function (err, results, fields) {
                if (err) rej(err);
                console.log(results);
                req(results);
            })
        });
    } catch (err) {
        console.log('SQLManager', err);
    }
}

const close = async () => {
    if (sqlConnection) {
        sqlConnection.end();
        sqlConnection = undefined;
        return
    } 
}

module.exports = {
    query: query,
    queryOnce: async (sqlStatement) => {
        const result = query(sqlStatement)
        close();
        return result;
    },
    close: close,
}