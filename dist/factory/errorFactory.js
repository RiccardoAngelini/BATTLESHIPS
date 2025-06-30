"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFactory = exports.ErrorFactory = void 0;
const Status_codes_1 = require("./Status_codes");
class GenericError {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "This is a generic error"
        };
    }
}
class UnauthorizedRequest {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.UNAUTHORIZED,
            message: "The authentication credentials are missing, or if supplied are not valid or not sufficient to access the resource."
        };
    }
}
class InvalidRequest {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.NOT_FOUND,
            message: "The URI requested is invalid or the resource requested does not exists."
        };
    }
}
class RefusedRequest {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.FORBIDDEN,
            message: "The request has been refused. See the accompanying message for the specific reason (most likely for exceeding rate limit)"
        };
    }
}
class DeleteRequest {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.NO_CONTENT,
            message: "Resource successfully deleted"
        };
    }
}
class BadRequest {
    getMsg() {
        return {
            statusCode: Status_codes_1.StatusCodes.BAD_REQUEST,
            message: "The request could not be understood or was missing required parameters"
        };
    }
}
/*
enum ErrEnum {
    None,
    Generic,
    RefusedRequest,
    InvalidRequest,
    DeleteRequest,
    BadRequest,
    UnauthorizedRequest
}*/
class ErrorFactory {
    constructor() { }
    getError(type_error) {
        switch (type_error) {
            case Status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR:
                return new GenericError();
            case Status_codes_1.StatusCodes.NOT_FOUND:
                return new InvalidRequest();
            case Status_codes_1.StatusCodes.UNAUTHORIZED:
                return new UnauthorizedRequest();
            case Status_codes_1.StatusCodes.FORBIDDEN:
                return new RefusedRequest();
            case Status_codes_1.StatusCodes.NO_CONTENT:
                return new DeleteRequest();
            case Status_codes_1.StatusCodes.BAD_REQUEST:
                return new BadRequest();
            default:
                return new GenericError();
        }
    }
}
exports.ErrorFactory = ErrorFactory;
exports.errorFactory = new ErrorFactory();
