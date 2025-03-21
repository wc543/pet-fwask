// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend the Request interface to include a user property
export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  
  // The expected format is: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  
  try {
    // Verify the token using the JWT secret from your environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here') as JwtPayload;

    console.log("Decoded JWT:", decoded); // Debugging log

    if (!decoded || !decoded.user_id) {
      console.error("Decoded JWT missing user_id:", decoded);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach the decoded token data to the request object
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
