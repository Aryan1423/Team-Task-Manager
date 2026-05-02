import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', result.array()));
    }
    next();
  }
];
