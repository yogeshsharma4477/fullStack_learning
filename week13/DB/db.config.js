const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    log: ["query"], // to check what query primsa is hitting when using its methods
});

module.exports = prisma