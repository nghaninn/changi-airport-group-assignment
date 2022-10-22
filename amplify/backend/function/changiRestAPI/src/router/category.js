
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const router = express.Router();
const SQLManager = require('../utils/SQLManager');

/**********************
 * Example get method *
 **********************/

router.get('/', async function (req, res) {
    const limit = req.query.limit ?? 10;
    const offset = req.query.offset ?? 0;

    // Add your code here
    let categoryResult = await SQLManager.query(`SELECT * FROM Category c LIMIT ${limit} OFFSET ${offset}`);
    categoryResult = Object.values(JSON.parse(JSON.stringify(categoryResult)))
    await SQLManager.close();
    res.json({ categories: categoryResult });
});

router.get('/*', async function (req, res) {
    // Add your code here
    let categoryResult = await SQLManager.query(`SELECT * FROM Category c WHERE c.id = ${req.body.id}`);
    categoryResult = Object.values(JSON.parse(JSON.stringify(categoryResult)))
    await SQLManager.close();
    res.json({ categories: categoryResult });
});

/****************************
* Example post method *
****************************/

router.post('/', async function (req, res) {
    // Add your code here

    // create item object
    let _category = {
        name: req.body.name,
    }
    let categoryQuery = `INSERT INTO Category (${Object.keys(_category).join(', ')}) VALUES ('${Object.keys(_category).map(x => _category[x]).join('\', \'')}') ON DUPLICATE KEY UPDATE ${Object.keys(_category).map(x => `\`${x}\` = VALUES(${x})`).join(', ')}; `

    // store into db
    const categoryResult = await SQLManager.query(categoryQuery);
    console.log('categoryResult', categoryResult);

    // return item id.
    await SQLManager.close();
    res.json({ id: categoryResult.insertId })
});

// router.post('/*', function (req, res) {
//     // Add your code here
//     res.json({ success: 'post call succeed!', url: req.url, body: req.body })
// });

/****************************
* Example put method *
****************************/

// router.put('/', function (req, res) {
//     // Add your code here
//     res.json({ success: 'put call succeed!', url: req.url, body: req.body })
// });

router.put('/*', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

router.delete('/', async function (req, res) {
    let categoryQuery = `DELETE FROM Category`

    const categoryResult = await SQLManager.queryOnce(categoryQuery);
    console.log(categoryResult);

    res.json({ itemResult: categoryResult })
});

router.delete('/*', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});


module.exports = router