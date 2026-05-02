import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const statusValues = ['TODO', 'IN_PROGRESS', 'DONE'];
const priorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const taskPayload = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description || '',
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  assignee: task.assignee ? { id: task.assignee.id, name: task.assignee.name, email: task.assignee.email } : null
});

const ensureAssignee = async (projectId, assigneeId) => {
  if (!assigneeId) return;
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: assigneeId, projectId } }
  });
  if (!membership) throw new ApiError(400, 'Assignee must be a project member');
};

export const listTasks = async (req, res, next) => {
  try {
    const { status, priority, assignee, search } = req.query;
    if (status && !statusValues.includes(status)) throw new ApiError(400, 'Invalid task status');
    if (priority && !priorityValues.includes(priority)) throw new ApiError(400, 'Invalid task priority');

    const tasks = await prisma.task.findMany({
      where: {
        projectId: req.params.id,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(assignee ? { assigneeId: assignee } : {}),
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {})
      },
      include: { assignee: true },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }]
    });
    res.json(tasks.map(taskPayload));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description = '', status = 'TODO', priority = 'MEDIUM', assigneeId, dueDate } = req.body;
    if (!statusValues.includes(status)) throw new ApiError(400, 'Invalid task status');
    if (!priorityValues.includes(priority)) throw new ApiError(400, 'Invalid task priority');

    await ensureAssignee(req.params.id, assigneeId);
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: req.params.id,
        createdBy: req.user.id
      },
      include: { assignee: true }
    });
    res.status(201).json(taskPayload(task));
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: { assignee: true }
    });
    if (!task || task.projectId !== req.params.id) throw new ApiError(404, 'Task not found');
    res.json(taskPayload(task));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task || task.projectId !== req.params.id) throw new ApiError(404, 'Task not found');

    const data = {};
    const adminOnly = ['priority', 'assigneeId'];
    if (adminOnly.some((field) => req.body[field] !== undefined) && req.membership.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can reassign tasks or change priority');
    }
    for (const field of ['title', 'description', 'status', 'priority']) {
      if (req.body[field] !== undefined) data[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
    if (data.status && !statusValues.includes(data.status)) throw new ApiError(400, 'Invalid task status');
    if (data.priority && !priorityValues.includes(data.priority)) throw new ApiError(400, 'Invalid task priority');

    if (req.body.assigneeId !== undefined) {
      await ensureAssignee(req.params.id, req.body.assigneeId);
      data.assigneeId = req.body.assigneeId || null;
    }
    if (req.body.dueDate !== undefined) data.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;

    const updated = await prisma.task.update({
      where: { id: req.params.taskId },
      data,
      include: { assignee: true }
    });
    res.json(taskPayload(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task || task.projectId !== req.params.id) throw new ApiError(404, 'Task not found');
    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
