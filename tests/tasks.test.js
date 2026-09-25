const request = require('supertest');
const app = require('../src/app');
const { initDb, closeDb } = require('../src/config/db');

describe('Task Management API', () => {
  beforeAll(async () => {
    await initDb(':memory:');
  });

  afterAll(async () => {
    await closeDb();
  });

  let createdTaskId;

  describe('POST /api/tasks', () => {
    it('should create a new task with default status and priority', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Setup CI/CD pipeline',
          description: 'Configure GitHub Actions workflow for automated testing'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Setup CI/CD pipeline');
      expect(res.body.data.description).toBe('Configure GitHub Actions workflow for automated testing');
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.priority).toBe('medium');
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');

      createdTaskId = res.body.data.id;
    });

    it('should create a task with explicit status and priority', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Fix auth bug',
          description: 'Resolve token refresh issue',
          status: 'in-progress',
          priority: 'high'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('in-progress');
      expect(res.body.data.priority).toBe('high');
    });

    it('should return 400 Bad Request when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          description: 'Missing title'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 400 Bad Request when invalid status is provided', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Invalid task',
          status: 'unknown-status'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('GET /api/tasks', () => {
    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app).get('/api/tasks?status=in-progress');

      expect(res.status).toBe(200);
      expect(res.body.data.every(t => t.status === 'in-progress')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app).get('/api/tasks?priority=high');

      expect(res.status).toBe(200);
      expect(res.body.data.every(t => t.priority === 'high')).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should fetch task by ID', async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBe(createdTaskId);
    });

    it('should return 404 Not Found for non-existent ID', async () => {
      const res = await request(app).get('/api/tasks/non-existent-uuid');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task details', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: 'Updated Setup CI/CD',
          description: 'Updated description',
          priority: 'high'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Setup CI/CD');
      expect(res.body.data.priority).toBe('high');
    });

    it('should return 404 when updating non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/non-existent-uuid')
        .send({ title: 'Task' });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update only the task status', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 400 for invalid status string', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent task ID', async () => {
      const res = await request(app)
        .patch('/api/tasks/non-existent-uuid/status')
        .send({ status: 'completed' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete existing task and return 204', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(204);

      const checkRes = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(checkRes.status).toBe(404);
    });

    it('should return 404 when deleting already deleted task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(404);
    });
  });
});
