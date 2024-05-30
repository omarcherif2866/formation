import express from 'express';
import {
  createSessionCours,
  getAllSessionCours,
  getSessionCoursById,
  updatesessionCoursById,
  deletesessionCoursById
} from '../controllers/sessionCours.js';

const router = express.Router();

// Create a new sessionCours
router.post('/', createSessionCours);

// Get all sessionCours
router.get('/', getAllSessionCours);

// Get a specific sessionCours by ID
router.get('/:sessionCoursId', getSessionCoursById);

// Update a sessionCours by ID
router.put('/:sessionCoursId', updatesessionCoursById);

// Delete a sessionCours by ID
router.delete('/:sessionCoursId', deletesessionCoursById);

export default router;
