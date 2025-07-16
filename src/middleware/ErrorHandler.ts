import { errorFactory } from "../factory/errorFactory";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../factory/httpError";
import { StatusCodes } from "../factory/Status_codes";

/*
export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const { statusCode: code, message } = errorFactory.getError(statusCode).getMsg(); //in base allo status code viene restituito il messaggio definito nella factory 
  res.status(code).json({ error: message });

}*/

// Middleware centralizzato per la gestione degli errori
export function errHandler(err: unknown, req: Request, res: Response, next: NextFunction) {

  if(err instanceof HttpError){
    const code = err.statusCode || 500
 return res.status(code).json({
      error: {
        status: code,
        message: err.message,
      },
    });
  }

  const genericError = errorFactory.getError(StatusCodes.INTERNAL_SERVER_ERROR);
  return res.status(genericError.statusCode).json({
    error: {
      status: genericError.statusCode,
      message: genericError.message,
    },
  });
}
