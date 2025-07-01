import { HttpError } from "./httpError";
import { StatusCodes } from "./Status_codes";


//error factory che restituisce un istanza delle classi error in base allo status code
export class ErrorFactory {
  getError(type_error: StatusCodes): HttpError {
    switch (type_error) {
      case StatusCodes.INTERNAL_SERVER_ERROR:
        return new HttpError(type_error, "This is a generic error");
      case StatusCodes.NOT_FOUND:
        return new HttpError(type_error, "The resource requested does not exist.");
      case StatusCodes.UNAUTHORIZED:
        return new HttpError(
          type_error,
          "The authentication credentials are missing or not valid."
        );
      case StatusCodes.FORBIDDEN:
        return new HttpError(
          type_error,
          "The request has been refused (e.g. rate limit exceeded)."
        );
      case StatusCodes.NO_CONTENT:
        return new HttpError(type_error, "Resource successfully deleted.");
      case StatusCodes.BAD_REQUEST:
        return new HttpError(
          type_error,
          "The request could not be understood or is missing required parameters."
        );
      default:
        return new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "This is a generic error");
    }
  }
}

export const errorFactory = new ErrorFactory();


