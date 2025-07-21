import { HttpError } from "./httpError";
import { StatusCodes } from "./Status_codes";


//error factory che restituisce un istanza delle classi error in base allo status code
export class ErrorFactory {
  getError(type_error: StatusCodes, msg? :string): HttpError {
    switch (type_error) {
      case StatusCodes.INTERNAL_SERVER_ERROR:
        return new HttpError(type_error, "This is a generic error"+ (msg ? ` ${msg}` : ''));
      case StatusCodes.NOT_FOUND:
        return new HttpError(type_error, "The resource requested does not exist."+ (msg ? ` ${msg}` : ''));
      case StatusCodes.UNAUTHORIZED:
        return new HttpError(
          type_error,
          "The authentication credentials are missing or not valid."+ (msg ? ` ${msg}` : '')
        );
      case StatusCodes.FORBIDDEN:
        return new HttpError(
          type_error,
          "The request has been refused (e.g. rate limit exceeded)."+ (msg ? ` ${msg}` : '')
        );
      case StatusCodes.NO_CONTENT:
        return new HttpError(type_error, "Resource successfully deleted."+ (msg ? ` ${msg}` : ''));
      case StatusCodes.BAD_REQUEST:
        return new HttpError(
          type_error,
          "The request could not be understood or is missing required parameters."+ (msg ? ` ${msg}` : '')
        );
      default:
        return new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "This is a generic error"+ (msg ? ` ${msg}` : ''));
    }
  }
}

export const errorFactory = new ErrorFactory();


