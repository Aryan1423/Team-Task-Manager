import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const memberPayload = (member) => ({
  id: member.id,
  role: member.role,
  joinedAt: member.joinedAt,
  user: {
    id: member.user.id,
    name: member.user.name,
    email: member.user.email
  }
});

export const listMembers = async (req, res, next) => {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId: req.params.id },
      include: { user: true },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }]
    });
    res.json(members.map(memberPayload));
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { email, role = 'MEMBER' } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new ApiError(404, 'No user found with that email');

    const member = await prisma.projectMember.create({
      data: { userId: user.id, projectId: req.params.id, role },
      include: { user: true }
    });
    res.status(201).json(memberPayload(member));
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const existing = await prisma.projectMember.findFirst({
      where: { id: req.params.memberId, projectId: req.params.id }
    });
    if (!existing) throw new ApiError(404, 'Member not found');

    const member = await prisma.projectMember.update({
      where: { id: req.params.memberId },
      data: { role: req.body.role },
      include: { user: true }
    });
    res.json(memberPayload(member));
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const member = await prisma.projectMember.findUnique({ where: { id: req.params.memberId } });
    if (!member || member.projectId !== req.params.id) throw new ApiError(404, 'Member not found');
    if (member.userId === req.user.id) throw new ApiError(400, 'You cannot remove yourself');
    await prisma.projectMember.delete({ where: { id: req.params.memberId } });
    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};
