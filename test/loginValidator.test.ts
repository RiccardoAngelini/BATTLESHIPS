// __tests__/validateEmail.test.ts
import { Request, Response, NextFunction } from 'express';
import {validateEmail} from '../src/middleware/loginValidator';
import { StatusCodes } from '../src/factory/Status_codes';
import {  describe, it } from 'node:test';

describe('Middleware validateEmail', () => {
  it('restituisce 400 se manca il campo email', () => {
    // Simuliamo req senza body.email
    const req = { body: {} } as Request;

  //simulazione di response tramite mock
    const res = {
      status: jest.fn().mockReturnThis(), //mock che ritorna res e chiama res.json
      json: jest.fn(), //mock che registra il contenuto inviato
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    // Chiamata al middleware
    validateEmail(req, res, next);

    // Verifichiamo che risponda 400 Bad Request e che invii il giusto messaggio di errore
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });

    // next() non deve essere chiamato in caso di errore
    expect(next).not.toHaveBeenCalled();
  });

  it('restituisce 400 se il formato dell\'email è invalido', () => {
    // Simuliamo req con email non valida
    const req = { body: { email: 'not-an-email' } } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateEmail(req, res, next);

    // Deve restituire 400 e il messaggio di formato non valido
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email must be a valid email' });
    expect(next).not.toHaveBeenCalled();
  });

  it('chiama next() quando l\'email è valida', () => {
    // Simuliamo req con una email valida
    const req = { body: { email: 'utente@example.com' } } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateEmail(req, res, next);

    // Validazione positiva next() deve essere invocato
    expect(next).toHaveBeenCalled();

    // non devono essere state inviate risposte di errore
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});