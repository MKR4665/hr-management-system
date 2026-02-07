const bcrypt = require('bcryptjs');

const hashPassword = async (plain) => bcrypt.hash(plain, 10);
const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { hashPassword, verifyPassword };
