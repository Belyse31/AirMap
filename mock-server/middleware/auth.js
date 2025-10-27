import { UserModel } from '../models/User.js';

/**
 * Authentication middleware
 */
export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = UserModel.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role-based authorization middleware
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export async function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = UserModel.verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    next();
  }
}

