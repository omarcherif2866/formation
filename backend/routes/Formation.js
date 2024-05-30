import express from 'express';
import { DeleteCours, addOnceContenuCours, addOnceCours, getAll, getCoursByDomaines, getCoursBySessions, getCoursPDFById, putOnce } from '../controllers/Formation.js';
import multer from "../middlewares/multer-config.js";
import multerPdf from '../middlewares/multerPdf.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/')
.post(
    addOnceCours);

 



router.route('/:id')
.get(getCoursPDFById)
.delete(DeleteCours)
.put(
    putOnce)
router.route('/contenu/:fomationId')
.put(
    addOnceContenuCours)
router.route('/domaine/:domaineId')
.get(getCoursByDomaines)

router.route('/session/:sessionId')
.get(getCoursBySessions)
export default router;

