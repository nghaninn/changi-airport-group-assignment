const mysql = require('mysql2');
// const mysql = require('/opt/nodejs/node_modules/mysql');
const SSMManager = require("./SSMManager");
// const SSMManager = require("/opt/nodejs/libs/SSMManager");

// let connection = undefined;
let sqlConnection = undefined;

const loadSQLConnection = async () => {
    try {
        sqlConnection = mysql.createConnection({
            host: (await SSMManager.getSecrets(process.env['rds_name'])).Value ?? '127.0.0.1',
            user: (await SSMManager.getSecrets(process.env['rds_username'])).Value ?? 'user',
            password: (await SSMManager.getSecrets(process.env['rds_password'])).Value ?? 'password',
            port: (await SSMManager.getSecrets(process.env['rds_port'])).Value ?? 3306,
            database: ((await SSMManager.getSecrets(process.env['rds_database'])).Value + '_' + process.env.ENV) ?? 'changi',
            multipleStatements: true,
        });
    } catch (err) {
        sqlConnection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'user',
            password: 'password',
            port: 3306,
            database: 'changi',
            multipleStatements: true,
        });
    }
    console.log(sqlConnection);
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