import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Extract the JWT token from the 'access_token' cookie
  const token = req.cookies.access_token;

  // If no token is found, return an error response
  if (!token) return next(errorHandler(401, 'Unauthorized'));

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    // If there's an error during verification, return a forbidden error response
    if (err) return next(errorHandler(403, 'Forbidden'));

    // If verification succeeds, attach the user information to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  });
};
