import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export class ErrorMiddleware {
  
  private handleDuplicateFieldsDB(err: any): AppError {
    const message = 'Bu məlumat artıq mövcuddur. Zəhmət olmasa başqa məlumat daxil edin.';
    return new AppError(message, 400);
  }

  private handleJWTError(): AppError {
    return new AppError('Keçərsiz token. Zəhmət olmasa yenidən daxil olun.', 401);
  }

  private handleJWTExpiredError(): AppError {
    return new AppError('Tokenin müddəti bitib. Zəhmət olmasa yenidən daxil olun.', 401);
  }

  private sendErrorDev(err: any, res: Response): void {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  private sendErrorProd(err: any, res: Response): void {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } 
    else {
      console.error('CRITICAL ERROR 💥', err);
      res.status(500).json({
        success: false,
        message: 'Sistemdə gözlənilməz xəta baş verdi!',
      });
    }
  }

  public globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

    if (env === 'development') {
      this.sendErrorDev(err, res);
    } 
    else {
      let error = { ...err, message: err.message, name: err.name, code: err.code, isOperational: err.isOperational };

      if (error.code === '23505') error = this.handleDuplicateFieldsDB(error);
      if (error.name === 'JsonWebTokenError') error = this.handleJWTError();
      if (error.name === 'TokenExpiredError') error = this.handleJWTExpiredError();

      this.sendErrorProd(error, res);
    }
  };
}

export const errorMiddleware = new ErrorMiddleware();