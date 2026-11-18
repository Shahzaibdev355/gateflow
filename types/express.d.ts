
declare global {
    namespace Express {
      interface UserContext {
        id: string;
        role?: string;
      }
  
      interface Request {
        user?: UserContext;
        requestId?: string;
      }
    }
  }
  
  export {};
  