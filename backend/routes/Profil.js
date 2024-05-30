import express from 'express';
import { DeleteProfil, addOnceProfil, getAll, getProfilById, putOnce } from '../controllers/Profil.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/')
.post(
    addOnceProfil);


router.route('/:id')
.get(getProfilById)
.delete(DeleteProfil)
.put(
    putOnce)



export default router;

