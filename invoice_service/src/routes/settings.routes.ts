import { Router } from 'express';

const router = Router();

// Placeholder routes - will be implemented in next features
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Settings routes - Feature coming soon',
    endpoints: [
      'GET / - Get user settings',
      'PUT / - Update user settings',
      'GET /vat-rules - List VAT rules',
      'POST /vat-rules - Create VAT rule',
      'PUT /vat-rules/:id - Update VAT rule',
      'DELETE /vat-rules/:id - Delete VAT rule'
    ]
  });
});

export default router; 