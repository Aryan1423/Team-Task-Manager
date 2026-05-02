import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me, signup } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/signup', validate([
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
]), signup);

router.post('/login', validate([
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]), login);

router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
