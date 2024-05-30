import express from 'express';
import { DeleteAdmins, addOnceAdmins, getAll, getAdminsById, putOnce } from '../controllers/Administrateur.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/')
.post(
    addOnceAdmins);


router.route('/:id')
.get(getAdminsById)
.delete(DeleteAdmins)
.put(
    putOnce)



export default router;

