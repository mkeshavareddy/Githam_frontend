/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Cloud Run deployment
  // This creates an optimized production build with all dependencies bundled
  output: 'standalone',

  env: {
    // Environment variables available to the client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // Server runtime configuration (available only on server side)
  serverRuntimeConfig: {
    discoveryEngineProjectId: process.env.DISCOVERY_ENGINE_PROJECT_ID || '922876587313',
    discoveryEngineLocation: process.env.DISCOVERY_ENGINE_LOCATION || 'global',
    discoveryEngineCollection: process.env.DISCOVERY_ENGINE_COLLECTION || 'default_collection',
    discoveryEngineEngineId: process.env.DISCOVERY_ENGINE_ENGINE_ID || 'ai-policy-assistant_1763955939617',
  },

  // Suppress hydration warnings for browser extension attributes
  reactStrictMode: true,

  experimental: {
    // Allow server actions from Cloud Run and localhost
    serverActions: {
      allowedOrigins: ['*.run.app', 'localhost:3000', 'localhost:3001'],
    },
  },
}

module.exports = nextConfig
