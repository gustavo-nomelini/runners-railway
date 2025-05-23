export const APP_CONSTANTS = {
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: '1d',
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
  },
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },
  PAIZAO: {
    ID: '1',
  },
};
