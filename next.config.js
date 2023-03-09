/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    externalDir: true
  },
  // Potential new config flag:
  disableExperimentalFeaturesWarning: true
}

module.exports = nextConfig
