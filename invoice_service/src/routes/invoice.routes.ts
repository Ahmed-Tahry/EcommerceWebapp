import { Router } from 'express';

const router = Router();

// Placeholder routes - will be implemented in next features
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Invoice routes - Feature coming soon',
    endpoints: [
      'GET / - List invoices',
      'POST / - Create invoice',
      'GET /:id - Get invoice by ID',
      'PUT /:id - Update invoice',
      'DELETE /:id - Delete invoice',
      'POST /:id/generate - Generate PDF',
      'POST /:id/send - Send invoice via email',
      'POST /:id/upload-bol - Upload to Bol.com'
    ]
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    message: 'Get invoice by ID - Feature coming soon',
    id: req.params.id
  });
});

router.post('/', (req, res) => {
  res.status(200).json({
    message: 'Create invoice - Feature coming soon',
    data: req.body
  });
});

export default router; 