import unittest
import index

class TestIndex(unittest.TestCase):

    def setUp(self):
        print('setup')
        index.query("\
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
            );\
            INSERT INTO Category(\`name\`) VALUES('Book'); \
            INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title A', 2.50); \
            INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title B', 2.50); \
            INSERT INTO Item (\`categoryID\`, \`name\`, \`price\`) VALUES (1, 'Title C', 2.50); ")

    def test_listCategory(self):
        result = index.listCategory()
        self.assertEqual(len(result), 2)

# if __name__ == '__main__':
#     unittest.main()