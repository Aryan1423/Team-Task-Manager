import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/jwt.js';

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const sendAuth = (res, user) => {
  const accessToken = generateAccessToken(user);
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

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: name.trim() }
    });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new ApiError(404, 'User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new ApiError(400, 'Current password is incorrect');

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, 12) }
    });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
