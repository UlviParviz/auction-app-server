import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private pool: Pool;

  constructor() {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'production') {
      this.pool = new Pool({
        connectionString: process.env.PRODUCTION_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    } else {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'secret_password',
        database: process.env.DB_NAME || 'auction_db',
      });
    }

    this.pool.on('error', (err) => {
      console.error('Bazada gözlənilməz xəta baş verdi:', err);
      process.exit(-1);
    });
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('İcra edilən sorğu:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  }
  
  public async getClient() {
    const client = await this.pool.connect();
    return client;
  }
}

export default new Database();