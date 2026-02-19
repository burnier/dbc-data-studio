const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para monorepo: define a raiz do workspace
  outputFileTracingRoot: path.join(__dirname, '../'),
};

module.exports = nextConfig;

