import { errorFactory } from "../factory/errorFactory";
import { Request, Response, NextFunction } from "express";


export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const { statusCode: code, message } = errorFactory.getError(statusCode).getMsg(); //in base allo status code viene restituito il messaggio definito nella factory 
  res.status(code).json({ error: message });

}