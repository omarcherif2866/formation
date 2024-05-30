

import express from 'express';
import multer from "../middlewares/multer-config.js";

import {
  DeleteFormateurs,
  addOnceFormateurs,
  addPdfToFormateur,
  countAllFormateurs,
  countFormateurPerDate,
  getAll,
  getFormateurByProfil,
  getFormateursById,
  putOnce,
  sendContentByEmail,
  signupFormateur
} from '../controllers/Formateur.js';
import upload from '../middlewares/multerPdf.js';

const router = express.Router();

router.route('/')
  .get(getAll)
  .post(addOnceFormateurs);

  router.route('/signup')
  .post(
      multer("image"),
      signupFormateur)

router.route('/count')
  .get(countAllFormateurs);

  router.route('/contenu/:formateurId')
  .put(
    addPdfToFormateur)

    router.route('/profil/:profilId')
    .get(getFormateurByProfil)


router.route('/:id')
  .get(getFormateursById)
  .delete(DeleteFormateurs)
  .put(putOnce);



router.route('/countFormateurPerDate/:year')
  .get(countFormateurPerDate);

export default router;
