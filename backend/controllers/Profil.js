import Profil from '../models/Profil.js';




export  function addOnceProfil (req, res){
  Profil.create({
            nom: req.body.nom,
            adresse: req.body.adresse,
            motdepasse: req.body.motdepasse,

          })
            .then((newProfil) => {
              
              res.status(200).json({
                nom: newProfil.nom,
                adresse: newProfil.adresse,
                motdepasse: newProfil.motdepasse,

              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
    Profil
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteProfil(req, res) {
  const id =req.params.id
  const prof = await Profil.findByIdAndDelete(id);
  res.status(200).json({"message":" Profil deleted"});
}

export function getProfilById(req, res){
  Profil.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newProfil = {};
    if(req.file == undefined) {
      newProfil = {
        nom: req.body.nom,
        adresse: req.body.adresse,
        motdepasse: req.body.motdepasse,

            }
    }
    else {
      newProfil = {
        nom: req.body.nom,
        adresse: req.body.adresse,
        motdepasse: req.body.motdepasse,

            }
    }
    Profil.findByIdAndUpdate(req.params.id, newProfil)
    .then((doc1) => {
        Profil.findById(req.params.id)
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


