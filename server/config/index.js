require('dotenv').config();

module.exports = {
    SECRET: process.env.SECRET,
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
}