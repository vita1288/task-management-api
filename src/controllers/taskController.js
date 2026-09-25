const taskService = require('../services/taskService');
const { AppError } = require('../middleware/errorHandler');

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const { status, priority } = req.query;
      const tasks = await taskService.getAllTasks({ status, priority });
      res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: tasks
      });
    } catch (err) {
      next(err);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        return next(new AppError(`Task with ID ${id} not found`, 404));
      }

      res.status(200).json({
        status: 'success',
        data: task
      });
    } catch (err) {
      next(err);
    }
  }

  async createTask(req, res, next) {
    try {
      const newTask = await taskService.createTask(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: newTask
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updatedTask = await taskService.updateTask(id, req.body);

      if (!updatedTask) {
        return next(new AppError(`Task with ID ${id} not found`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTaskStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedTask = await taskService.updateTaskStatus(id, status);

      if (!updatedTask) {
        return next(new AppError(`Task with ID ${id} not found`, 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'Task status updated successfully',
        data: updatedTask
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        return next(new AppError(`Task with ID ${id} not found`, 404));
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TaskController();
