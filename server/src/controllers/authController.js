import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const publicUser = (user, role = 'ADMIN') => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role
});

const sendAuth = (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  res.json({ accessToken, user: publicUser(user) });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) throw new ApiError(409, 'Email is already registered');

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 12)
      }
    });
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

export const logout = (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};
