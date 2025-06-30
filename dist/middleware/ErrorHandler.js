"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = errHandler;
const errorFactory_1 = require("../factory/errorFactory");
function errHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const { statusCode: code, message } = errorFactory_1.errorFactory.getError(statusCode).getMsg(); //in base allo status code viene restituito il messaggio definito nella factory 
    res.status(code).json({ error: message });
}
