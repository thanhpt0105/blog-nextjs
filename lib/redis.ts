import Redis from 'ioredis';

// Singleton Redis client
let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  // Only use Redis if URL is configured
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured, caching disabled');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        // Automatically reconnect
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true; // Reconnect
          }
          return false;
        },
      });

      redis.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      redis.on('connect', () => {
        console.log('Redis Client Connected');
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      redis = null;
    }
  }

  return redis;
}

// Cache helper functions
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const cached = await client.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

export async function deleteCachePattern(pattern: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis delete pattern error:', error);
    return false;
  }
}

// Disconnect Redis on app shutdown
export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
