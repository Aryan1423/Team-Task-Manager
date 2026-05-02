import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const projectPayload = (project, role) => ({
  id: project.id,
  name: project.name,
  description: project.description || '',
  membersCount: project._count?.members ?? project.members?.length ?? 0,
  updatedAt: project.updatedAt,
  role
});

export const listProjects = async (req, res, next) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      include: { project: { include: { _count: { select: { members: true } } } } },
      orderBy: { project: { updatedAt: 'desc' } }
    });
    res.json(memberships.map((item) => projectPayload(item.project, item.role)));
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description = '' } = req.body;
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        createdBy: req.user.id,
        members: { create: { userId: req.user.id, role: 'ADMIN' } }
      },
      include: { _count: { select: { members: true } } }
    });
    res.status(201).json(projectPayload(project, 'ADMIN'));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { members: true } } }
    });
    if (!project) throw new ApiError(404, 'Project not found');
    res.json(projectPayload(project, req.membership.role));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name.trim();
    if (req.body.description !== undefined) data.description = req.body.description.trim();
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { members: true } } }
    });
    res.json(projectPayload(project, req.membership.role));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
