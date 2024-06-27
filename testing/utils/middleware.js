import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const authenticateJWT = (handler) => async (req, res) => {

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.apitoken; 
        const secretKey = process.env.JWT_SECRET;
        const expectedIssuer = process.env.NODE_ENV === 'development'?
        '.jdsoftware.jd': '.justdial.com';
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized'});
        }
        jwt.verify(token, secretKey, { issuer: expectedIssuer }, (err, user) => {
            if (err) {
              return res.status(403).json({ message: 'Forbidden'});
        }
            return handler(req, res);
        });
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(500).json({ status: false, error: error.message });
    } 
  };

  export default authenticateJWT