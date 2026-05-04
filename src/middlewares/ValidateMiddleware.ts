import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod'; 
import { AppError } from '../utils/AppError';
import { AsyncWrapper } from '../utils/CatchAsync';

export class ValidateMiddleware {
  
  public validate = (schema: z.ZodType) => AsyncWrapper.catch(async (req: Request, res: Response, next: NextFunction) => {
    try {

      const parsedData: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsedData.body;
      
      Object.assign(req.query, parsedData.query);
      Object.assign(req.params, parsedData.params);

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