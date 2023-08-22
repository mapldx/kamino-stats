/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  env: {
    INTERPRET_WITH: 'SOLSCAN', // SOLSCAN, only for testing or HELIUS, for use in production
    HELIUS_API_KEY: '',
    // ENDPOINT_URL: 'https://beta.kamino.one/api',
    ENDPOINT_URL: 'http://localhost:3000/api',
  },
}