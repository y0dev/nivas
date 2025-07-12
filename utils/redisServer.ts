import Redis from 'redis';
import logger from './logger';

// Redis client interface
interface RedisClient {
  connect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string | null>;
  del(key: string): Promise<number>;
  quit(): Promise<void>;
}

// Redis configuration interface
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

// Create Redis client
const createRedisClient = (): RedisClient => {
  const config: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  };

  const client = Redis.createClient(config);

  client.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    logger.info('Redis Client Connected');
  });

  return client;
};

// Redis utility functions
export const getResultFromRedisClient = async (key: string): Promise<any> => {
  const client = createRedisClient();
  
  try {
    await client.connect();
    const result = await client.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  } finally {
    await client.quit();
  }
};

export const setResultInRedisClient = async (key: string, value: any, expireTime: number = 3600): Promise<boolean> => {
  const client = createRedisClient();
  
  try {
    await client.connect();
    const serializedValue = JSON.stringify(value);
    await client.set(key, serializedValue);
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return false;
  } finally {
    await client.quit();
  }
};

export const deleteFromRedisClient = async (key: string): Promise<boolean> => {
  const client = createRedisClient();
  
  try {
    await client.connect();
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', error);
    return false;
  } finally {
    await client.quit();
  }
}; 