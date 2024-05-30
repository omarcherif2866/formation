import upload from '../middlewares/multerPdf.js';
import Formations from '../models/Formation.js';
import multer from 'multer';
import SessionCours from '../models/SessionCours.js';




export  function addOnceCours (req, res){
  console.log("Received data:", req.body);
  const imageFile = req.file;
  Formations.create({
            titre: req.body.titre,
            description: req.body.description,
            description: req.body.description,
            contenu: req.body.contenu,
            domaine: req.body.domaine,
            sessionCours: req.body.sessionCours,

            

          })
            .then((newCours) => {
              
              res.status(200).json({
                titre: newCours.titre,
                description: newCours.description,
                apprenants: newCours.apprenants,
                contenu: newCours.contenu,
                domaine: newCours.domaine,
                sessionCours: newCours.sessionCours,



              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Formations
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteCours(req, res) {
  const id =req.params.id
  const cours = await Formations.findByIdAndDelete(id);
  res.status(200).json({"message":" Cours deleted"});
}

export function getCoursPDFById(req, res){
  Formations.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        res.status(404).json({ message: 'Formation non trouvée' });
      } else {
        // Filtrer le contenu pour inclure uniquement les fichiers PDF
        const pdfContenu = doc.contenu.filter(file => file.endsWith('.pdf'));
        // Remplacer le contenu de la formation par le contenu filtré
        doc.contenu = pdfContenu;
        res.status(200).json(doc.contenu);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}



export function putOnce(req, res) {
  const newCours = {
    titre: req.body.titre,
    description: req.body.description,
    apprenants: req.body.apprenants,
    domaine: req.body.domaine,
    sessionCours: req.body.sessionCours,
    // Si vous devez ajouter un fichier dans cette fonction, ajoutez-le ici
    // image: req.file ? req.file.filename : undefined
  };

  Formations.findByIdAndUpdate(req.params.id, newCours, { new: true })
    .then((updatedCours) => {
      if (!updatedCours) {
        return res.status(404).json({ message: 'Cours non trouvé' });
      }
      res.status(200).json(updatedCours);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}




export function addOnceContenuCours(req, res) {
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
    const formationId = req.params.fomationId;
    Formations.findByIdAndUpdate(
      formationId,
      { $push: { contenu: { $each: pdfFiles.map(file => file.filename) } } },
      { new: true } // Pour renvoyer le document mis à jour
    )
    .then((updatedFormation) => {
      if (!updatedFormation) {
        console.log("Formation non trouvée avec l'ID:", formationId);
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




export function getCoursByDomaines(req, res)  {
  const domaineId = req.params.domaineId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  Formations.find({
      domaine: domaineId,
  })
      .limit(limit)
      .sort({ id: sort })
      .then((formations) => {
          res.json(formations);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des formations.' });
      });
};

export function getCoursBySessions(req, res)  {
  const sessionId = req.params.sessionId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  Formations.find({
    sessionCours: sessionId,
  })
      .limit(limit)
      .sort({ id: sort })
      .then((formations) => {
          res.json(formations);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des formations.' });
      });
};