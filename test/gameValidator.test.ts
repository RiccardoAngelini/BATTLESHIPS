import { Request, Response, NextFunction } from 'express';
import { validateCreateGame } from '../src/middleware/gameValidator';
import { StatusCodes } from '../src/factory/Status_codes';

describe('Middleware validateCreateGame', () => {

  it('restituisce 400 se il campo "vs" non è né "PVP" né "PVE"', () => {
    // Costruiamo una request fittizia con body.vs="XYZ"
    const req = { body: { vs: 'XYZ' } } as Request;

    //  Mock dell'oggetto Response
    const res = {
      status: jest.fn().mockReturnThis(),  //  ritorna res per concatenare .json()
      json: jest.fn(), // registra il payload
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    // Eseguiamo il middleware con i mock
    validateCreateGame(req, res, next);

   
   //asserzioni
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);  // abbia risposto con il codice BAD_REQUEST
    expect(res.json).toHaveBeenCalledWith({
      error: 'The field "vs" must be either "PVP" or "PVE".'
    });   //  abbia inviato il JSON con l'errore appropriato
    expect(next).not.toHaveBeenCalled(); 
  });  //  non abbia chiamato next


  it('restituisce 400 se manca "opponent" quando vs è PVP', () => {
    // vs=PVP ma nessun opponent fornito
    const req = {
      body: { vs: 'PVP', grid: 5, boatSizes: 3, boatNumber: 2 }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    // Deve segnalare mancanza di opponent
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Opponent email is required when vs is "PVP".'
    });
    expect(next).not.toHaveBeenCalled();
  });


  it('restituisce 400 se "opponent" non è una email valida in PVP', () => {
    // vs=PVP con opponent non valido
    const req = {
      body: {
        vs: 'PVP',
        opponent: 'bad-email',
        grid: 5,
        boatSizes: 3,
        boatNumber: 2
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    // Deve rifiutare formato email invalido
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Opponent must be a valid email.'
    });
    expect(next).not.toHaveBeenCalled();
  });


  it('restituisce 400 se fornisce "opponent" in PVE', () => {
    // vs=PVE ma viene passato un opponent
    const req = {
      body: {
        vs: 'PVE',
        opponent: 'utente@example.com',
        grid: 5,
        boatSizes: 3,
        boatNumber: 2
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    // Deve rifiutare la presenza di opponent in PVE
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Opponent must not be provided when vs is "PVE".'
    });
    expect(next).not.toHaveBeenCalled();
  });


  it('restituisce 400 se grid non è un intero positivo', () => {
    // vs=PVE ok, ma grid=0 non valido
    const req = {
      body: {
        vs: 'PVE',
        grid: 0,
        boatSizes: 3,
        boatNumber: 2
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    // Primo controllo fallito: grid size non positivo
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Grid size must be a positive integer.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('chiama next() per un caso PVP valido', () => {
    // Tutti i dati corretti per PVP
    const req = {
      body: {
        vs: 'PVP',
        opponent: 'avversario@example.com',
        grid: 10,
        boatSizes: 4,
        boatNumber: 3
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    // In questo next deve essere invocato, validazione positiva
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });


  it('chiama next() per un caso PVE valido', () => {
    // Tutti i dati corretti per PVE 
    const req = {
      body: {
        vs: 'PVE',
        grid: 10,
        boatSizes: 4,
        boatNumber: 3
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    validateCreateGame(req, res, next);

    //  next deve passare avanti la richiesta
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});