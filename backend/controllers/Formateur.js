import Formateurs from '../models/Formateur.js';
import { sendEmail } from './utils/mailing.js';
import path from 'path';
import nodemailer from 'nodemailer';
import upload from '../middlewares/multerPdf.js';
import multer from 'multer';
import Profil from '../models/Profil.js';
import { mailTransport } from './utils/mail.js';
import bcrypt from 'bcryptjs';



export  function addOnceFormateurs (req, res){
  Formateurs.create({
            listCoursEnseignes: req.body.listCoursEnseignes,
            cours: req.body.cours,

          })
            .then((newFormateurs) => {
              
              res.status(200).json({
                listCoursEnseignes: newFormateurs.listCoursEnseignes,
                cours: newFormateurs.cours,
                profil: newFormateurs.profil,

              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Formateurs
    .find({})
    .populate('profil') // Remplit le champ 'profil' avec les informations du profil associé
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}


export async function DeleteFormateurs(req, res) {
  const id =req.params.id
  const form = await Formateurs.findByIdAndDelete(id);
  res.status(200).json({"message":" Formateurs deleted"});
}

export function getFormateursById(req, res){
  Formateurs.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newFormateurs = {};
    if(req.file == undefined) {
      newFormateurs = {
        status: req.body.status,
        profil: req.body.profil,
        fichiers: req.body.fichiers,

            }
    }
    else {
      newFormateurs = {
        status: req.body.status,
        profil: req.body.profil,
        fichiers: req.body.fichiers,
            }
    }
    Formateurs.findByIdAndUpdate(req.params.id, newFormateurs)
    .then((doc1) => {
      Formateurs.findById(req.params.id)
        .then((doc2) => {
            res.status(200).json(doc2);
              })
        .catch((err) => {
            res.status(500).json({ error: err });
              });
          })
      .catch((err) => {
            res.status(500).json({ error: err });
          });
      }

export async function countFormateurPerDate(req, res) {
  try {
    const { year } = req.params; // L'année saisie par l'utilisateur

    // Convertir l'année en début et fin de cette année
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Compter le nombre d'apprenants ajoutés entre startDate et endDate
    const count = await Formateurs.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting formateurs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function countAllFormateurs(req, res) {
  try {
    // Compter tous les formateurs dans la base de données
    const count = await Formateurs.countDocuments();

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting all formateurs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function sendContentByEmail(req, res) {
  try {
    const id = req.params.id;
    // Utiliser l'ID pour récupérer l'adresse de l'expéditeur depuis la base de données ou tout autre endroit approprié
    const expediteur = await getAdresseFromId(id);

    // Vérifier si l'adresse de l'expéditeur a été récupérée avec succès et si c'est une adresse e-mail valide
    if (!expediteur || !isValidEmail(expediteur)) {
      return res.status(404).json({ message: 'Adresse e-mail de l\'expéditeur non valide' });
    }

    // Récupérer l'adresse de destination et le fichier depuis le corps de la requête
    const { adresse } = req.body;
    const file = req.file;

    // Vérifier si l'adresse de destination et le fichier sont présents
    if (!adresse || !file) {
      return res.status(400).json({ message: 'Email et fichier requis' });
    }

    // Créer le transporteur pour l'envoi d'email
    const transporter = mailTransport();

    // Définir les options de l'email
    const mailOptions = {
      from: expediteur,
      to: adresse,
      subject: 'Votre CV',
      text: 'Veuillez trouver ci-joint votre CV.',
      attachments: [
        {
          filename: file.filename,
          path: file.path,
          contentType: 'application/pdf'
        }
      ]
    };

    // Envoyer l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
      }
      console.log('Email envoyé : ' + info.response);
      res.json({ message: 'Email envoyé avec succès.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

// Fonction pour vérifier si une chaîne est une adresse e-mail valide
function isValidEmail(email) {
  // Utilisez une expression régulière pour valider l'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function getAdresseFromId(id) {
  try {
    // Remplacez cette partie avec la logique pour récupérer l'adresse email de l'utilisateur à partir de l'ID
    const user = await Profil.findById(id); // Supposons que vous ayez un modèle User pour gérer les utilisateurs
    if (user) {
      return user.adresse; // Retourne l'adresse email de l'utilisateur
    } else {
      return null; // Retourne null si l'utilisateur n'est pas trouvé
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'adresse email de l'expéditeur :", error);
    return null; // Retourne null en cas d'erreur
  }
}


export async function signupFormateur(req, res) {
  const { nom, adresse, motdepasse, role } = req.body;
  
  try {
    const existingProfil = await Profil.findOne({ adresse });
    if (existingProfil) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Récupérez le fichier image
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(404).json({ message: 'Please upload an image' });
    }

    // Créez le profil avec l'image
    const hashedPassword = await bcrypt.hash(motdepasse, 8);
    const profil = await Profil.create({ nom, adresse, motdepasse: hashedPassword, role: "formateur", image: imageFile.filename });

    // Créez le formateur avec l'ID du profil
    const formateur = await Formateurs.create({ profil: profil._id });

    // Utilisation de multer pour gérer le téléchargement d'autres fichiers

    return res.json({ message: 'User registration successful.', profil, formateur });
    
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: 'Error registering user' });
  }
}

export function addPdfToFormateur(req, res) {
  upload.array('pdf')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Une erreur s'est produite lors du téléversement
      return res.status(500).json({ message: 'Une erreur s\'est produite lors du téléversement du fichier', error: err.message });
    } else if (err) {
      // Une autre erreur s'est produite
      return res.status(500).json({ message: 'Une erreur s\'est produite', error: err.message });
    }

    // Si aucune erreur ne s'est produite, continuez avec le reste de la logique
    console.log("Received data:", req.body);
    console.log("Received files:", req.files); // Utilisez req.files pour accéder à tous les fichiers téléversés

    // Vérifiez si un fichier a été correctement envoyé
    const pdfFiles = req.files;
    if (!pdfFiles || pdfFiles.length === 0) {
      return res.status(400).json({ message: 'Veuillez télécharger un fichier PDF' });
    }

    console.log("File details:", pdfFiles);

    // Mettez à jour le contenu de la formation existante en ajoutant les nouveaux fichiers à la liste des fichiers
    const formateurId = req.params.formateurId;
    Formateurs.findByIdAndUpdate(
      formateurId,
      { $push: { fichiers: { $each: pdfFiles.map(file => file.filename) } } },
      { new: true } // Pour renvoyer le document mis à jour
    )
    .then((updatedFormation) => {
      if (!updatedFormation) {
        console.log("Formation non trouvée avec l'ID:", formateurId);
        return res.status(404).json({ message: 'Formation non trouvée' });
      }
      res.status(200).json(updatedFormation);
    })
    .catch((err) => {
      console.error("Error updating formation:", err);
      res.status(500).json({ error: err });
    });
  });
}


export function getFormateurByProfil(req, res)  {
  const profilId = req.params.profilId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  Formateurs.find({
      profil: profilId,
  })
      .limit(limit)
      .sort({ id: sort })
      .then((formations) => {
          res.json(formations);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération du formateur.' });
      });
};