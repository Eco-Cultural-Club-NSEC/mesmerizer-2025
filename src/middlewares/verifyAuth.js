import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const verifyAuth = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : null;
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secrect = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secrect);
        req.user = decoded;
        next();
    } catch (ex) {
        logger.error(ex);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default verifyAuth;