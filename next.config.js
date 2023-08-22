/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  env: {
    INTERPRET_WITH: 'SOLSCAN', // SOLSCAN, only for testing or HELIUS, for use in production
    HELIUS_API_KEY: '',
    ENDPOINT_URL: 'https://kamino-stats-rho.vercel.app/api',
  },
}