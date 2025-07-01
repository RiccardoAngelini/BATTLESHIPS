"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
// estende la classe base Error per includere un codice HTTP associato
class HttpError extends Error {
    /**
     * Costruttore di HttpError
     * @param statusCode - Codice di stato HTTP da restituire al client
     * @param message - Messaggio di errore che descrive il problema
     */
    constructor(statusCode, message) {
        super(message); // Chiama il costruttore della classe Error per impostare 'message'
        this.statusCode = statusCode;
        // Necessario per mantenere la corretta catena di prototipi
        // e fare in modo che 'instanceof HttpError' funzioni
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
