"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginValidator_1 = require("../src/middleware/loginValidator");
const Status_codes_1 = require("../src/factory/Status_codes");
const node_test_1 = require("node:test");
(0, node_test_1.describe)('Middleware validateEmail', () => {
    (0, node_test_1.it)('restituisce 400 se manca il campo email', () => {
        // Simuliamo req senza body.email
        const req = { body: {} };
        //simulazione di response tramite mock
        const res = {
            status: jest.fn().mockReturnThis(), //mock che ritorna res e chiama res.json
            json: jest.fn(), //mock che registra il contenuto inviato
        };
        const next = jest.fn();
        // Chiamata al middleware
        (0, loginValidator_1.validateEmail)(req, res, next);
        // Verifichiamo che risponda 400 Bad Request e che invii il giusto messaggio di errore
        expect(res.status).toHaveBeenCalledWith(Status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });
        // next() non deve essere chiamato in caso di errore
        expect(next).not.toHaveBeenCalled();
    });
    (0, node_test_1.it)('restituisce 400 se il formato dell\'email è invalido', () => {
        // Simuliamo req con email non valida
        const req = { body: { email: 'not-an-email' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, loginValidator_1.validateEmail)(req, res, next);
        // Deve restituire 400 e il messaggio di formato non valido
        expect(res.status).toHaveBeenCalledWith(Status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email must be a valid email' });
        expect(next).not.toHaveBeenCalled();
    });
    (0, node_test_1.it)('chiama next() quando l\'email è valida', () => {
        // Simuliamo req con una email valida
        const req = { body: { email: 'utente@example.com' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, loginValidator_1.validateEmail)(req, res, next);
        // Validazione positiva next() deve essere invocato
        expect(next).toHaveBeenCalled();
        // non devono essere state inviate risposte di errore
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
