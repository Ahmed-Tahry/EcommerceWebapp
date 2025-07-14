import { Router } from 'express';

const router = Router();

// Placeholder routes - will be implemented in next features
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Template routes - Feature coming soon',
    endpoints: [
      'GET / - List templates',
      'POST / - Create template',
      'GET /:id - Get template by ID',
      'PUT /:id - Update template',
      'DELETE /:id - Delete template',
      'POST /:id/set-default - Set as default template'
    ]
  });
});

export default router; 