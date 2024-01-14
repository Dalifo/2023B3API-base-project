import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || (req.socket && req.socket.remoteAddress) || 'Unknown IP';
    const method = req.method;
    const routeWithParams = req.originalUrl;
    const dateTime = new Date().toISOString();

    const logMessage = `${ip} - ${dateTime} - ${method} - ${routeWithParams}\n`;

    fs.appendFile('logs.txt', logMessage, (err) => {
      if (err) {
        console.error('Error writing to logs.txt', err);
      }
    });
    
    next();
  }
}
