import jwt from 'jsonwebtoken';

const accessSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return s || 'dev-access-secret';
};

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, accessSecret(), { expiresIn: '7d' });

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret());
