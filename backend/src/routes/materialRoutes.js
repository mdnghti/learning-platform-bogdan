const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/module/:moduleId', authenticate, materialController.getMaterialsByModule);
router.get('/:id', authenticate, materialController.getMaterialById);
router.post(
  '/module/:moduleId',
  authenticate,
  authorize('teacher', 'admin'),
  upload.single('file'),
  materialController.createMaterial
);
router.put('/:id', authenticate, authorize('teacher', 'admin'), materialController.updateMaterial);
router.delete('/:id', authenticate, authorize('teacher', 'admin'), materialController.deleteMaterial);

module.exports = router;
