import Apprenants from '../models/Apprenant.js';




export  function addOnceApprenants (req, res){
  Apprenants.create({
            listCoursInscrits: req.body.listCoursInscrits,

          })
            .then((newApprenants) => {
              
              res.status(200).json({
                listCoursInscrits: newApprenants.listCoursInscrits,
                profil: newApprenants.profil,

              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Apprenants
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteApprenants(req, res) {
  const id =req.params.id
  const appr = await Apprenants.findByIdAndDelete(id);
  res.status(200).json({"message":" Apprenants deleted"});
}

export function getApprenantsById(req, res){
  Apprenants.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newApprenants = {};
    if(req.file == undefined) {
      newApprenants = {
        listCoursInscrits: req.body.listCoursInscrits,

      }
    }
    else {
      newApprenants = {
        listCoursInscrits: req.body.listCoursInscrits,

      }
    }
    Apprenants.findByIdAndUpdate(req.params.id, newApprenants)
    .then((doc1) => {
      Apprenants.findById(req.params.id)
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

export async function countApprenantPerDate(req, res) {
  try {
    const { year } = req.params; // L'année saisie par l'utilisateur

    // Convertir l'année en début et fin de cette année
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Compter le nombre d'apprenants ajoutés entre startDate et endDate
    const count = await Apprenants.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting apprenants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function countAllApprenants(req, res) {
  try {
    // Compter le nombre total de formateurs
    const count = await Apprenants.countDocuments();

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting formateurs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}