"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = errHandler;
const errorFactory_1 = require("../factory/errorFactory");
const httpError_1 = require("../factory/httpError");
const Status_codes_1 = require("../factory/Status_codes");
/*
export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const { statusCode: code, message } = errorFactory.getError(statusCode).getMsg(); //in base allo status code viene restituito il messaggio definito nella factory
  res.status(code).json({ error: message });

}*/
// Middleware centralizzato per la gestione degli errori
function errHandler(err, req, res, next) {
    if (err instanceof httpError_1.HttpError) {
        const code = err.statusCode || 500;
        return res.status(code).json({
            error: {
                status: code,
                message: err.message,
            },
        });
    }
    const genericError = errorFactory_1.errorFactory.getError(Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    return res.status(genericError.statusCode).json({
        error: {
            status: genericError.statusCode,
            message: genericError.message,
        },
    });
}
