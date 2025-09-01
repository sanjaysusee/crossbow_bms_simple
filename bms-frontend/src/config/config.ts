export interface AppConfig {
  apiBaseUrl: string;
  bmsUsername: string;
  bmsPassword: string;
  version: string;
  enableDebugLogging: boolean;
  enableAnalytics: boolean;
}

export const config: AppConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api',
  bmsUsername: process.env.REACT_APP_BMS_USERNAME || 'crossbow',
  bmsPassword: process.env.REACT_APP_BMS_PASSWORD || 'crossbow@123',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  enableDebugLogging: process.env.REACT_APP_ENABLE_DEBUG_LOGGING === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Helper function to get config value
export const getConfig = <K extends keyof AppConfig>(key: K): AppConfig[K] => {
  return config[key];
};

// Validate required configuration
export const validateConfig = (): void => {
  const requiredFields: (keyof AppConfig)[] = ['apiBaseUrl', 'bmsUsername', 'bmsPassword'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      console.error(`Missing required configuration: ${field}`);
      if (isProduction) {
        throw new Error(`Missing required configuration: ${field}`);
      }
    }
  }
  
  if (isDevelopment) {
    console.log('App Configuration:', config);
  }
};
