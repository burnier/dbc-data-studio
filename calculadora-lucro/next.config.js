const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para monorepo: define a raiz do workspace
  outputFileTracingRoot: path.join(__dirname, '../'),
  
  // Configuração webpack para resolver path aliases no Vercel
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;

