import express from 'express';
import { body } from "express-validator";
import { DeleteApprenants, addOnceApprenants, countAllApprenants, countApprenantPerDate, getAll, getApprenantsById, putOnce } from '../controllers/Apprenants.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/')
.post(
    addOnceApprenants);
    
router.route('/countAllApprenant')
.get(countAllApprenants)

router.route('/:id')
.get(getApprenantsById)
.delete(DeleteApprenants)
.put(
    putOnce)

router.route('/countApprenantPerDate/:year')
.get(countApprenantPerDate)



export default router;

