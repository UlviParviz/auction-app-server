import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisCache {
  private client: RedisClientType;

  constructor() {
    const env = process.env.NODE_ENV || 'development';
    let connectionUrl: string;

    if (env === 'production') {
      connectionUrl = process.env.PRODUCTION_REDIS_URL || '';
    } else {
      connectionUrl = process.env.REDIS_URL || '';
    }

    this.client = createClient({
      url: connectionUrl,
    });

    this.client.on('error', (err) => console.error('Redis Qoşulma Xətası:', err));
    this.client.on('connect', () => console.log('Redis Cache serverinə qoşuldu.'));
    
    this.client.connect().catch(console.error);
  }

  public async get(key: string): Promise<any | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  public async set(key: string, value: any, expInSeconds: number = 3600): Promise<void> {
    await this.client.setEx(key, expInSeconds, JSON.stringify(value));
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default new RedisCache();