import { errorFactory } from "../factory/errorFactory";
import { StatusCodes } from "../factory/Status_codes";
import { UserRepository } from "../repository/userRepository";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /*
   Autentica un utente tramite email.
    Ritorna un JWT HS256 con payload { id, email, role }.
   */
  async authenticate(email: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw errorFactory.getError(StatusCodes.UNAUTHORIZED);
    
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}