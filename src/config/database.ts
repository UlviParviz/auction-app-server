import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private pool: Pool;

  constructor() {
this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } 
    });

    this.pool.on('error', (err) => {
      console.error('Bazada gözlənilməz xəta baş verdi:', err);
      process.exit(-1);
    });
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    
    // Geliştirme mühitində sorğuların icra müddətini izləmək üçün
    if (process.env.NODE_ENV === 'development') {
      console.log('İcra edilən sorğu:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  }
}

// Bütün tətbiqdə eyni obyekti istifadə etmək üçün instansiyanı export edirik
export default new Database();