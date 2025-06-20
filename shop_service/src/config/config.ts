// This is a placeholder for configuration
// Environment variables should be loaded here

interface IConfig {
  env: string;
  port: number;
  // Add other configuration properties here
}

const config: IConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};

export default config;
