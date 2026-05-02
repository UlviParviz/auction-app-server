import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisCache {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => console.error('Redis Qoşulma Xətası:', err));
    this.client.on('connect', () => console.log('Redis Cache serverinə qoşuldu.'));
    
    // Bağlantını asinxron olaraq işə salırıq
    this.client.connect().catch(console.error);
  }

  // Datamızı stringdən avtomatik JSON-a çevirən get metodu
  public async get(key: string): Promise<any | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Datamızı avtomatik string-ə çevirib Redis-ə yazan set metodu
  public async set(key: string, value: any, expInSeconds: number = 3600): Promise<void> {
    await this.client.setEx(key, expInSeconds, JSON.stringify(value));
  }

  // Lazım olduqda cache-i təmizləmək üçün
  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default new RedisCache();