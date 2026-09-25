const { randomUUID } = require('crypto');
const { getDb } = require('../config/db');

class TaskService {
  async getAllTasks(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM tasks';
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.priority) {
      conditions.push('priority = ?');
      params.push(filters.priority);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    return await db.all(query, params);
  }

  async getTaskById(id) {
    const db = getDb();
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    return task || null;
  }

  async createTask(taskData) {
    const db = getDb();
    const now = new Date().toISOString();
    const newTask = {
      id: randomUUID(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: now,
      updatedAt: now
    };

    await db.run(
      `INSERT INTO tasks (id, title, description, status, priority, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.status,
        newTask.priority,
        newTask.createdAt,
        newTask.updatedAt
      ]
    );

    return newTask;
  }

  async updateTask(id, updateData) {
    const db = getDb();
    const existing = await this.getTaskById(id);
    if (!existing) return null;

    const updatedTask = {
      title: updateData.title !== undefined ? updateData.title : existing.title,
      description: updateData.description !== undefined ? updateData.description : existing.description,
      status: updateData.status !== undefined ? updateData.status : existing.status,
      priority: updateData.priority !== undefined ? updateData.priority : existing.priority,
      updatedAt: new Date().toISOString()
    };

    await db.run(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updatedTask.title,
        updatedTask.description,
        updatedTask.status,
        updatedTask.priority,
        updatedTask.updatedAt,
        id
      ]
    );

    return await this.getTaskById(id);
  }

  async updateTaskStatus(id, status) {
    const db = getDb();
    const existing = await this.getTaskById(id);
    if (!existing) return null;

    const updatedAt = new Date().toISOString();

    await db.run(
      `UPDATE tasks SET status = ?, updatedAt = ? WHERE id = ?`,
      [status, updatedAt, id]
    );

    return await this.getTaskById(id);
  }

  async deleteTask(id) {
    const db = getDb();
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = new TaskService();
