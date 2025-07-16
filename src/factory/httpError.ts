import { StatusCodes } from "./Status_codes";

// estende la classe base Error per includere un codice HTTP associato
export class HttpError extends Error {
  public statusCode: StatusCodes;

  /**
   * Costruttore di HttpError
   * @param statusCode - Codice di stato HTTP da restituire al client
   * @param message - Messaggio di errore che descrive il problema
   */
  constructor(statusCode: StatusCodes, message: string) {
    super(message); // Chiama il costruttore della classe Error per impostare 'message'
    this.statusCode = statusCode;
    // Necessario per mantenere la corretta catena di prototipi
    // e fare in modo che 'instanceof HttpError' funzioni
    //setta il prototipo dell'oggetto corrente all'oggetto httpError
    Object.setPrototypeOf(this, HttpError.prototype); 
  }
}
