"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFactory = exports.ErrorFactory = void 0;
const httpError_1 = require("./httpError");
const Status_codes_1 = require("./Status_codes");
//error factory che restituisce un istanza delle classi error in base allo status code
class ErrorFactory {
    getError(type_error) {
        switch (type_error) {
            case Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR:
                return new httpError_1.HttpError(type_error, "This is a generic error");
            case Status_codes_1.StatusCodes.NOT_FOUND:
                return new httpError_1.HttpError(type_error, "The resource requested does not exist.");
            case Status_codes_1.StatusCodes.UNAUTHORIZED:
                return new httpError_1.HttpError(type_error, "The authentication credentials are missing or not valid.");
            case Status_codes_1.StatusCodes.FORBIDDEN:
                return new httpError_1.HttpError(type_error, "The request has been refused (e.g. rate limit exceeded).");
            case Status_codes_1.StatusCodes.NO_CONTENT:
                return new httpError_1.HttpError(type_error, "Resource successfully deleted.");
            case Status_codes_1.StatusCodes.BAD_REQUEST:
                return new httpError_1.HttpError(type_error, "The request could not be understood or is missing required parameters.");
            default:
                return new httpError_1.HttpError(Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "This is a generic error");
        }
    }
}
exports.ErrorFactory = ErrorFactory;
exports.errorFactory = new ErrorFactory();
