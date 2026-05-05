import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database';

export class AuthService {
  private generateTokenInfo(id: number, role: string) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET as string, { 
      expiresIn: expiresIn as any 
    });
    
    const decoded = jwt.decode(token) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000).toISOString();
    
    return { token, expiresAt };
  }

  public async register(firstName: string, lastName: string, email: string, password: string) {
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) throw new Error('Bu email artıq qeydiyyatdan keçib');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, role',
      [firstName, lastName, email, hashedPassword]
    );

    const user = result.rows[0];
    
    const tokenInfo = this.generateTokenInfo(user.id, user.role);
    return { user, token: tokenInfo.token, expiresAt: tokenInfo.expiresAt };
  }

  public async login(email: string, password: string) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('İstifadəçi tapılmadı');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Səhv parol');

    delete user.password;
    
    const tokenInfo = this.generateTokenInfo(user.id, user.role);
    return { user, token: tokenInfo.token, expiresAt: tokenInfo.expiresAt };
  }

public async updatePassword(userId: number, oldPassword: string, newPassword: string) {
  const result = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('İstifadəçi tapılmadı');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Köhnə şifrə yanlışdır');
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error('Yeni şifrə köhnə şifrə ilə eyni ola bilməz');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

  return true;
}

  public async getMe(id: number) {
    const result = await db.query('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new Error('İstifadəçi tapılmadı');
    return result.rows[0];
  }
}