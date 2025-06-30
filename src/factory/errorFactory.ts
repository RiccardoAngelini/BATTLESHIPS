import { StatusCodes } from "./Status_codes";
//interfaccia per gli errori
interface ErrorMsg{
     getMsg():{ statusCode: StatusCodes; message: string };
}
//implementazione delle varie classi di errori che verranno gestite dalla factory
class GenericError implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "This is a generic error"
    };
  } 
}

class UnauthorizedRequest implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "The authentication credentials are missing, or if supplied are not valid or not sufficient to access the resource."
    };
  } 
}

class InvalidRequest implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.NOT_FOUND,
      message: "The URI requested is invalid or the resource requested does not exists."
    };
  } 
}

class RefusedRequest implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.FORBIDDEN,
      message: "The request has been refused. See the accompanying message for the specific reason (most likely for exceeding rate limit)"
    };
  } 
}

class DeleteRequest implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.NO_CONTENT,
      message: "Resource successfully deleted"
    };
  } 
}

class BadRequest implements ErrorMsg {
    getMsg() {
     return {
      statusCode: StatusCodes.BAD_REQUEST,
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
//error factory che restituisce un istanza delle classi error in base allo status code
export class ErrorFactory{
    constructor(){}
    getError(type_error:StatusCodes):ErrorMsg{
    switch (type_error) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
            return new GenericError();           
            
        case StatusCodes.NOT_FOUND:
            return new InvalidRequest();
            
        case StatusCodes.UNAUTHORIZED: 
            return new UnauthorizedRequest();
            
        case StatusCodes.FORBIDDEN: 
            return new RefusedRequest();
             
        case StatusCodes.NO_CONTENT: 
            return new DeleteRequest(); 
             
        case StatusCodes.BAD_REQUEST: 
           return new BadRequest(); 
        
    default:
    return new GenericError(); 
    }
}

}
export const errorFactory = new ErrorFactory();