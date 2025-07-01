import { errorFactory } from "../factory/errorFactory";
import { Request, Response, NextFunction } from "express";

/*
export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const { statusCode: code, message } = errorFactory.getError(statusCode).getMsg(); //in base allo status code viene restituito il messaggio definito nella factory 
  res.status(code).json({ error: message });

}*/

// Middleware centralizzato per la gestione degli errori
export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // HttpError espone statusCode e message, fallback a 500 e messaggio generico
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
}
