import { JwtPayload } from "../jwtPayload";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      id?: string;
      email?:string;
      role?:string
    }
    
  }
}

/*
declare global {
  namespace Express {
    
    interface User extends JwtPayload {
      id: string;
}
    interface Request {
      user: User;
    }
    
  }
}
*/
/*
declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload;
  }
}*/
