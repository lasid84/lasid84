// import dotenv from "dotenv";

const dotenv = require('dotenv');

dotenv.config();

console.log("POSTGRES_URL", process.env.POSTGRES_URL);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASS:", process.env.DB_PASS);