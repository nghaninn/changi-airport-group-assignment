
const express = require('express')
const router = express.Router();
const SQLManager = require('../utils/SQLManager');

/**********************
 * Example get method *
 **********************/

router.get('/', async function (req, res) {
    const limit = req.query.limit ?? 10;
    const offset = req.query.offset ?? 0;

    let itemResult = await SQLManager.queryOnce(`SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id LIMIT ${limit} OFFSET ${offset}; SELECT COUNT(*) AS total FROM Item;`);

    let stringItemResult = JSON.stringify(itemResult)?.replace(/"categoryName":/g, '"category":');
    itemResult = Object.values(JSON.parse(stringItemResult))

    res.json({ items: itemResult[0] ?? [], total: itemResult[1][0].total ?? 0 });

});

router.get('/filter', async function (req, res) {
    const dt_from = req.query.dt_from ?? null;
    const dt_to = req.query.dt_to ?? null;

    let search = [`${dt_from ? 'i.`updatedOn` > \'' + dt_from + '\' ' : ''}`, `${dt_to ? 'i.`updatedOn` < \'' + dt_to + '\'' : ''}`]
    search = search.filter(s => s.length > 0);

    let itemQuery = `SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id ${search.length > 0 ? 'WHERE ' + search.join(' AND ') : ''}`

    let itemResult = await SQLManager.queryOnce(itemQuery);

    let stringItemResult = JSON.stringify(itemResult).replace(/"categoryName":/g, '"category":');
    itemResult = Object.values(JSON.parse(stringItemResult))

    res.json({ items: itemResult, total_price: itemResult.map(s => s.price).reduce((a, b) => Number(a) + Number(b), 0) });
});

router.get('/category/:category?', async function (req, res) {
    const category = req.params.category ?? null;

    let itemQuery = `SELECT c.name AS categoryName, SUM(i.price) AS totalPrice, COUNT(*) AS 'count' FROM Item i INNER JOIN Category c ON i.categoryID = c.id GROUP BY c.name ${category ? 'HAVING c.name = \'' + category + '\'' : ''}`

    let itemCategoryResult = await SQLManager.queryOnce(itemQuery);

    let stringItemResult = JSON.stringify(itemCategoryResult).replace(/"categoryName":/g, '"category":').replace(/"totalPrice":/g, '"total_price":');
    itemCategoryResult = Object.values(JSON.parse(stringItemResult))

    if (itemCategoryResult.length > 0)
        res.json({ items: itemCategoryResult });
    else
        res.status(404).json({ error: `Category: ${category} does not exist or does not have any item` })
});

router.get('/:id', async function (req, res) {
    let itemResult = await SQLManager.queryOnce(`SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id WHERE i.id = ${req.params.id}`);

    let stringItemResult = JSON.stringify(itemResult).replace(/"categoryName":/g, '"category":');
    itemResult = Object.values(JSON.parse(stringItemResult))

    if (itemResult.length == 1)
        res.json({ item: itemResult[0] });
    else
        res.status(404).json({ error: 'Invalid id' })
});

/****************************
* Example post method *
****************************/

router.post('/', async function (req, res) {
    try {
        // create item object
        let _item = {
            categoryID: req.body.categoryID,
            name: req.body.name,
            price: req.body.price
        }
        let itemQuery = `INSERT INTO Item (${Object.keys(_item).join(', ')}) VALUES ('${Object.keys(_item).map(x => _item[x]).join('\', \'')}') ON DUPLICATE KEY UPDATE ${Object.keys(_item).map(x => `\`${x}\` = VALUES(${x})`).join(', ')}; `

        // store into db
        const itemResult = await SQLManager.queryOnce(itemQuery);

        // return item id.
        res.status(201).json({ id: itemResult.insertId })
    } catch (err) {
        res.status(400).json({ error: 'Unable to insert' })
    }
});

/****************************
* Example put method *
****************************/

router.put('/:id', async function (req, res) {
    let _item = {
    }
    let attribute_keys = ['categoryID', 'name', 'price', 'createdOn', 'updatedOn']

    for (let k of attribute_keys) {
        if (req?.body.hasOwnProperty(k)) {
            _item[k] = req.body[k]
        }
    }

    if (Object.keys(_item).length > 0) {
        let itemQuery = `UPDATE Item SET ${Object.keys(_item).map(x => `\`${x}\` = '${_item[x]}'`).join(', ')} WHERE id = ${req.params.id}; SELECT i.*, c.name AS categoryName FROM Item i INNER JOIN Category c ON i.categoryID = c.id WHERE i.id = ${req.params.id}; `

        const itemResult = await SQLManager.queryOnce(itemQuery);

        if (itemResult[0].affectedRows == 1) {
            res.json({ item: itemResult[1][0] })
        }
    } else {
        res.status(400).json({ error: "Unable to update" })
    }
});

/****************************
* Example delete method *
****************************/

router.delete('/', async function (req, res) {
    let itemQuery = `DELETE FROM Item`

    const itemResult = await SQLManager.queryOnce(itemQuery);

    res.json({ itemResult })
});

router.delete('/:id', async function (req, res) {
    let itemQuery = `UPDATE Item SET deleted = 1, deletedOn = NOW() WHERE id = ${req.params.id}`

    const itemResult = await SQLManager.queryOnce(itemQuery);

    res.json({ itemResult })
});


module.exports = router