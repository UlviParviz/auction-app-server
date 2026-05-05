import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod'; 
import { AppError } from '../utils/AppError';
import { AsyncWrapper } from '../utils/CatchAsync';

export class ValidateMiddleware {

  public validate = (schema: ZodType<unknown>) => AsyncWrapper.catch(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { 
        body?: unknown; 
        query?: Record<string, unknown>; 
        params?: Record<string, string>; 
      };

      if (parsedData.body !== undefined) {
        req.body = parsedData.body;
      }
      
      if (parsedData.query) {
        Object.assign(req.query, parsedData.query);
      }
      
      if (parsedData.params) {
        Object.assign(req.params, parsedData.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[err.path.length - 1], 
          message: err.message,
        }));

        return next(new AppError('Məlumatların validasiya xətası', 400, formattedErrors));
      }
      
      next(error);
    }
  });
}

export const validateMiddleware = new ValidateMiddleware();