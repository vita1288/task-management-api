const express = require('express');
const taskController = require('../controllers/taskController');
const validate = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema
} = require('../schemas/taskSchema');

const router = express.Router();

router.route('/')
  .get(taskController.getAllTasks.bind(taskController))
  .post(validate(createTaskSchema), taskController.createTask.bind(taskController));

router.route('/:id')
  .get(taskController.getTaskById.bind(taskController))
  .put(validate(updateTaskSchema), taskController.updateTask.bind(taskController))
  .delete(taskController.deleteTask.bind(taskController));

router.patch('/:id/status', validate(updateStatusSchema), taskController.updateTaskStatus.bind(taskController));

module.exports = router;
