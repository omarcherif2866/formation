import Admins from '../models/Administrateur.js';




export  function addOnceAdmins (req, res){
  Admins.create({

          })
            .then((newAdmins) => {
              
              res.status(200).json({
                profil: newAdmins.profil,

              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Admins
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteAdmins(req, res) {
  const id =req.params.id
  const admn = await Admins.findByIdAndDelete(id);
  res.status(200).json({"message":" Admins deleted"});
}

export function getAdminsById(req, res){
  Admins.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newAdmins = {};
    if(req.file == undefined) {
      newAdmins = {

            }
    }
    else {
      newAdmins = {

            }
    }
    Admins.findByIdAndUpdate(req.params.id, newAdmins)
    .then((doc1) => {
      Admins.findById(req.params.id)
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


