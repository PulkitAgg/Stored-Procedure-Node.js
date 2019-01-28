var query = [];
const addCustomer = `
CREATE PROCEDURE getCustomerDataByName (IN inputName VARCHAR(25))
SELECT * FROM customers WHERE name = inputName`;
const deleteCustomer = `DROP PROCEDURE IF EXISTS getCustomerDataByName`
query.push(deleteCustomer);
query.push(addCustomer);
exports.query = query;