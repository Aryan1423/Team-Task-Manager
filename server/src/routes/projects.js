import { Router } from 'express';
import { body } from 'express-validator';
import { createProject, deleteProject, getProject, listProjects, updateProject } from '../controllers/projectController.js';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/taskController.js';
import { addMember, listMembers, removeMember, updateMember } from '../controllers/teamController.js';
import { auth } from '../middleware/auth.js';
import { requireProjectRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const statusValues = ['TODO', 'IN_PROGRESS', 'DONE'];
const priorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

router.use(auth);

router.get('/', listProjects);
router.post('/', validate([
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Project name must be 3-100 characters'),
  body('description').optional({ values: 'falsy' }).isLength({ max: 500 }).withMessage('Description must be 500 characters or less')
]), createProject);

router.get('/:id', requireProjectRole('MEMBER'), getProject);
router.put('/:id', requireProjectRole('ADMIN'), validate([
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional({ values: 'falsy' }).isLength({ max: 500 })
]), updateProject);
router.delete('/:id', requireProjectRole('ADMIN'), deleteProject);

router.get('/:id/tasks', requireProjectRole('MEMBER'), listTasks);
router.post('/:id/tasks', requireProjectRole('MEMBER'), validate([
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Task title must be 3-200 characters'),
  body('description').optional({ values: 'falsy' }).isLength({ max: 2000 }),
  body('status').optional().isIn(statusValues),
  body('priority').optional().isIn(priorityValues),
  body('dueDate').optional({ values: 'falsy' }).isISO8601()
]), createTask);
router.get('/:id/tasks/:taskId', requireProjectRole('MEMBER'), getTask);
router.put('/:id/tasks/:taskId', requireProjectRole('MEMBER'), validate([
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional({ values: 'falsy' }).isLength({ max: 2000 }),
  body('status').optional().isIn(statusValues),
  body('priority').optional().isIn(priorityValues),
  body('dueDate').optional({ values: 'falsy' }).isISO8601()
]), updateTask);
router.delete('/:id/tasks/:taskId', requireProjectRole('ADMIN'), deleteTask);

router.get('/:id/members', requireProjectRole('MEMBER'), listMembers);
router.post('/:id/members', requireProjectRole('ADMIN'), validate([
  body('email').isEmail().withMessage('Enter a valid email'),
  body('role').optional().isIn(['ADMIN', 'MEMBER'])
]), addMember);
router.put('/:id/members/:memberId', requireProjectRole('ADMIN'), validate([
  body('role').isIn(['ADMIN', 'MEMBER'])
]), updateMember);
router.delete('/:id/members/:memberId', requireProjectRole('ADMIN'), removeMember);

export default router;
