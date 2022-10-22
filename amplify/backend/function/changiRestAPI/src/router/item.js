
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const router = express.Router();
const SQLManager = require('../utils/SQLManager');

/**********************
 * Example get method *
 **********************/

router.get('/', async function (req, res) {
    console.log(req)
    const limit = req.query.limit ?? 10;
    const offset = req.query.offset ?? 0;

    // Add your code here
    let itemResult = await SQLManager.queryOnce(`SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id LIMIT ${limit} OFFSET ${offset}; SELECT COUNT(*) AS total FROM Item;`);

    console.log(JSON.stringify(itemResult));
    
    itemResult = Object.values(JSON.parse(JSON.stringify(itemResult)))
    itemResult[0].map(s => {
        s.category = s.categoryName
        return s
    })
    
    res.json({ items: itemResult[0], total: itemResult[1][0].total });
});

router.get('/filter', async function (req, res) {
    const dt_from = req.query.dt_from ?? null;
    const dt_to = req.query.dt_to ?? null;

    let search = [`${dt_from ? 'i.`updatedOn` > \'' + dt_from + '\' ' : ''}`, `${dt_to ? 'i.`updatedOn` < \'' + dt_to + '\'' : ''}`]
    search = search.filter(s => s.length > 0);


    let itemQuery = `SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id ${search.length > 0 ? 'WHERE ' + search.join(' AND ') : ''}`
    // console.log(itemQuery)
    let itemResult = await SQLManager.queryOnce(itemQuery);

    itemResult = Object.values(JSON.parse(JSON.stringify(itemResult)))
    itemResult.map(s => {
        s.category = s.categoryName
        return s
    })
    
    res.json({ items: itemResult, total_price: itemResult.map(s => s.price).reduce((a, b) => a + b, 0) });
});

router.get('/category/:category?', async function (req, res) {
    console.log(req)
    const category = req.params.category ?? null;

    // Add your code here
    let itemQuery = `SELECT c.name AS categoryName, SUM(i.price) AS totalPrice, COUNT(*) AS 'count' FROM Item i INNER JOIN Category c ON i.categoryID = c.id GROUP BY c.name ${category ? 'HAVING c.name = \'' + category + '\'' : ''}`
    console.log(itemQuery)//
    let itemCategoryResult = await SQLManager.queryOnce(itemQuery);
    itemCategoryResult = Object.values(JSON.parse(JSON.stringify(itemCategoryResult)))
    itemCategoryResult.map(s => {
        s.category = s.categoryName
        s.total_price = s.totalPrice
        return s
    })

    if (itemCategoryResult.length > 0)
        res.json({ items: itemCategoryResult });
    else
        res.status(404).json({error: `Category: ${category} does not exist or does not have any item`})
});

router.get('/:id', async function (req, res) {
    console.log(req)

    // Add your code here
    let itemResult = await SQLManager.queryOnce(`SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id WHERE i.id = ${req.params.id}`);
    itemResult = Object.values(JSON.parse(JSON.stringify(itemResult)))
    itemResult.map(s => {
        s.category = s.categoryName
        return s
    })
    
    res.json({ items: itemResult });
});

/****************************
* Example post method *
****************************/

router.post('/', async function (req, res) {
    // Add your code here
    console.log(req)

    // create item object
    let _item = {
        categoryID: req.body.categoryID,
        name: req.body.name,
        price: req.body.price
    }
    let itemQuery = `INSERT INTO Item (${Object.keys(_item).join(', ')}) VALUES ('${Object.keys(_item).map(x => _item[x]).join('\', \'')}') ON DUPLICATE KEY UPDATE ${Object.keys(_item).map(x => `\`${x}\` = VALUES(${x})`).join(', ')}; `

    // store into db
    const itemResult = await SQLManager.queryOnce(itemQuery);
    console.log('itemResult', itemResult);

    // return item id.
    res.json({ id: itemResult.insertId })
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

// router.delete('/', function (req, res) {
//     // Add your code here
//     res.json({ success: 'delete call succeed!', url: req.url });
// });

router.delete('/*', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});


module.exports = router