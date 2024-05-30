import Domaines from '../models/Domaine.js';




export  function addOnceDomaines (req, res){
  Domaines.create({
            type: req.body.type,
            cours: req.body.cours,



          })
            .then((newDomaines) => {
              
              res.status(200).json({
                type: newDomaines.type,
                cours: newDomaines.cours,


              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Domaines
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteDomaines(req, res) {
  const id =req.params.id
  const domaine = await Domaines.findByIdAndDelete(id);
  res.status(200).json({"message":" Domaines deleted"});
}

export function getDomainesById(req, res){
  Domaines.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newDomaines = {};
    if(req.file == undefined) {
      newDomaines = {
            type: req.body.type,
            cours: req.body.cours,
                }
    }
    else {
      newDomaines = {
            type: req.body.type,
            cours: req.body.cours,
                }
    }
    Domaines.findByIdAndUpdate(req.params.id, newDomaines)
    .then((doc1) => {
      Domaines.findById(req.params.id)
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


