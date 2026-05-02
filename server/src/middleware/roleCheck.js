import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const requireProjectRole = (requiredRole = 'MEMBER') => async (req, _res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });

    if (!membership) throw new ApiError(403, 'You are not a member of this project');
    if (requiredRole === 'ADMIN' && membership.role !== 'ADMIN') {
      throw new ApiError(403, 'Admin access required');
    }

    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};
