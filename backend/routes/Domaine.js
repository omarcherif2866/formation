import express from 'express';
import { body } from "express-validator";
import { DeleteDomaines, addOnceDomaines, getAll, getDomainesById, putOnce } from '../controllers/Domaine.js';


const router = express.Router();


router.route('/')
.get(getAll);

router.route('/')
.post(
    addOnceDomaines);


router.route('/:id')
.get(getDomainesById)
.delete(DeleteDomaines)
.put(
    putOnce)



export default router;

