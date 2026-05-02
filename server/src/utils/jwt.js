import jwt from 'jsonwebtoken';

const accessSecret = () => process.env.JWT_SECRET || 'dev-access-secret';
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, accessSecret(), { expiresIn: '7d' });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, refreshSecret(), { expiresIn: '30d' });

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret());
