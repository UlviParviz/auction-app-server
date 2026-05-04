import { Request, Response, NextFunction, RequestHandler } from 'express';

export class AsyncWrapper {

  public static catch(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {

      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}