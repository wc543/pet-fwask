import jwt from 'jsonwebtoken';
const authMiddleware = (req, res, next) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
        // Attach the decoded token data to the request object
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
export default authMiddleware;
