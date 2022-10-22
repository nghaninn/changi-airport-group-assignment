const request = require('supertest');
const SQLManager = require('../utils/SQLManager')

const app = require('../app');

beforeAll(async () => {
    console.log('1 - beforeAll')

    let createTable = await SQLManager.query("\
    DROP TABLE IF EXISTS `Item`;\
    DROP TABLE IF EXISTS `Category`;\
    CREATE TABLE `Category` (\
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
        `name` VARCHAR(255) NOT NULL,\
    \
        `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\
        `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
        `deleted` INT(1) NOT NULL DEFAULT 0,\
        `deletedOn` TIMESTAMP NULL DEFAULT NULL\
    );\
    CREATE TABLE `Item` (\
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
        `categoryID` INT NOT NULL,\
        `name` VARCHAR(255) NULL,\
        `price` DECIMAL(14, 2) NULL DEFAULT 0,\
    \
        `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\
        `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
        `deleted` INT(1) NOT NULL DEFAULT 0,\
        `deletedOn` TIMESTAMP NULL DEFAULT NULL,\
    \
        FOREIGN KEY (`categoryID`) REFERENCES Category(`id`)\
    );");

    await SQLManager.query(`INSERT INTO Category(\`name\`) VALUES('Book');`);
    console.log(await SQLManager.query(`INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title A', 2.50); `));
    console.log(await SQLManager.query(`INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title B', 2.50); `));
    console.log(await SQLManager.query(`INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title C', 2.50); `));
});
afterAll(() => console.log('1 - afterAll'));
beforeEach(async () => {
    console.log('1 - beforeEach')
});
afterEach(() => console.log('1 - afterEach'));

describe('GET /item', () => {
    it('GET / => array of items', () => {
        return request(app)
            .get('/item')

            .expect('Content-Type', /json/)

            .expect(200)

            .then((response) => {
                console.log(response.body)
                expect(response.body).toEqual(
                    expect.objectContaining({
                        items: expect.arrayContaining([
                            expect.objectContaining({
                                id: expect.any(Number),
                                category: expect.any(String),
                                price: expect.any(String),
                            })
                        ])
                    })
                );

                expect(response.body.items.length).toBe(3)
                expect(response.body.total).toBe(3)
            });
    });

    it('GET / => items by ID', () => {
        return request(app)
            .get('/item/1')

            .expect('Content-Type', /json/)

            .expect(200)

            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        item: expect.objectContaining({
                            id: expect.any(Number),
                            category: expect.any(String),
                            price: expect.any(String),
                        })
                    })
                );
            });
    });

    it('GET /id => 404 if item not found', () => {
        return request(app).get('/item/10000000000').expect(404);
    });

    it('POST / => create NEW item', () => {
        return (
            request(app)
                .post('/item')

                // Item send code

                .send({
                    name: 'Notebook',
                    categoryID: 1,
                    price: 5.5
                })

                .expect('Content-Type', /json/)

                .expect(201)

                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: 4
                        })
                    );
                })
        );
    });

    it('POST / => item missing attribute', () => {
        return request(app).post('/item').send({ name: 123456789 }).expect(400);
    });

    it('PUT / => item update', () => {
        return (
            request(app).put('/item/1')
                .send({
                    name: "Title 1"
                })
                .expect('Content-Type', /json/)
                .expect(200)

                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            item: expect.objectContaining({
                                name: "Title 1"
                            })
                        })
                    );
                })
        );
    });
});