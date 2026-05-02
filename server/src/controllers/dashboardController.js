import prisma from '../config/db.js';

const emptyStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
const emptyPriority = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };

export const getStats = async (req, res, next) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      select: { projectId: true }
    });
    const projectIds = memberships.map((item) => item.projectId);

    const [tasks, overdueTasks] = await Promise.all([
      prisma.task.findMany({ where: { projectId: { in: projectIds } } }),
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          dueDate: { lt: new Date() },
          status: { not: 'DONE' }
        },
        include: { project: true },
        orderBy: { dueDate: 'asc' },
        take: 8
      })
    ]);

    const tasksByStatus = { ...emptyStatus };
    const tasksByPriority = { ...emptyPriority };
    for (const task of tasks) {
      tasksByStatus[task.status] += 1;
      tasksByPriority[task.priority] += 1;
    }

    res.json({
      totalProjects: projectIds.length,
      totalTasks: tasks.length,
      tasksByStatus,
      tasksByPriority,
      overdueTasks: overdueTasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        project: task.project.name,
        priority: task.priority
      }))
    });
  } catch (error) {
    next(error);
  }
};
