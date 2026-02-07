const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Safety check to ensure models are loaded
if (process.env.NODE_ENV !== 'production') {
  const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  console.log('Prisma initialized with models:', models);
}

module.exports = { prisma };