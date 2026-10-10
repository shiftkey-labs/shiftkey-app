

interface EnvironmentConfig {
  apiUrl: string;
  env: 'development' | 'production';
}

const ENV: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: 'http://localhost:3000',
    env: 'development',
  },
  production: {
    apiUrl: 'https://d3yvyt3tmm.us-east-1.awsapprunner.com',
    env: 'production',
  },
};

const requestedEnv = (process.env.EXPO_PUBLIC_ENV ?? process.env.NODE_ENV ?? 'development') as keyof typeof ENV;
const currentEnv: 'development' | 'production' = requestedEnv === 'production' ? 'production' : 'development';
const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL || ENV[currentEnv].apiUrl;

export default {
  ...ENV[currentEnv],
  apiUrl,
  env: currentEnv,
};
