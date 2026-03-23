import { transformCustomer } from "./customers.transformer.js";
import { validateCustomers } from "./customers.validator.js";

const customersMigration = {
  tableName: "Customers",
  targetTable: "customers",
  primaryKey: "CustomerID",
  transformer: transformCustomer,
  validator: validateCustomers,
};

export default customersMigration;
