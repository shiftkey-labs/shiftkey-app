

interface EnvironmentConfig {
  apiUrl: string;
  env: 'development' | 'production';
}

const ENV: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: 'https://d3yvyt3tmm.us-east-1.awsapprunner.com',
    env: 'development',
  },
  production: {
    apiUrl: 'https://d3yvyt3tmm.us-east-1.awsapprunner.com',
    env: 'production',
  },
};

// Get current environment from NODE_ENV, default to 'development'
const currentEnv = process.env.NODE_ENV || 'development';

// Export the config for the current environment
export default ENV[currentEnv];
