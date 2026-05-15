export default defineNuxtConfig({
  srcDir: 'app',
  serverDir: 'server',
  dir: {
    public: '../public'
  },
  compatibilityDate: '2024-08-01',
  devtools: { enabled: true },
  components: [{ path: '~/components/primitives', pathPrefix: false }],
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  typescript: { strict: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
    ipHashSecret: process.env.IP_HASH_SECRET,
    uploadDir: process.env.UPLOAD_DIR || './uploads/images',
    publicImageBaseUrl: process.env.PUBLIC_IMAGE_BASE_URL || '/images',
    appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
    public: {
      appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    errorHandler: '~/../server/error.ts',
    publicAssets: [{ dir: 'uploads/images', baseURL: '/images', maxAge: 60 * 60 * 24 * 30 }]
  }
})
