import { registerAs } from '@nestjs/config';

export default registerAs('supertoken', () => ({
  connectionURI: process.env.CONNECTION_URI || '',
  appInfo: {
    appName: process.env.APP_NAME || 'Default Name',
    apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
    websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:5000',
    apiBasePath: process.env.API_BASE_PATH || '/api',
    websiteBasePath: process.env.WEBSITE_BASE_PATH || '/',
  },
}));
