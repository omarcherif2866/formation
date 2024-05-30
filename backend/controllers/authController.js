import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Profil  from "../models/Profil.js";
import Apprenants  from "../models/Apprenant.js";
import Formateurs  from "../models/Formateur.js";
import Admins  from "../models/Administrateur.js";


const jwtsecret = "mysecret";

const generateHashedPassword = async (motdepasse) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(motdepasse, saltRounds);
  return hashedPassword;
};



const signup = async (req, res) => {
  const { nom, adresse, motdepasse, role } = req.body;
  try {

    const existingProfil = await Profil.findOne({ adresse });
    if (existingProfil) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    let profil;
    let nouvelUtilisateur;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(404).json({ message: 'Please upload an image' });
    }
    // Création du profil
    const hashedPassword = await bcrypt.hash(motdepasse, 8);
    profil = await Profil.create({ nom, adresse, motdepasse: hashedPassword, role, image: imageFile.filename });


    // Création de l'utilisateur en fonction du rôle
    if (role === 'apprenant') {
      nouvelUtilisateur = await Apprenants.create({ profil: profil._id });
    } else if (role === 'formateur') {
      nouvelUtilisateur = await Formateurs.create({ profil: profil._id });
    } else if (role === 'admin') {
      nouvelUtilisateur = await Admins.create({ profil: profil._id });
    } else {
      // Si le rôle n'est pas valide
      return res.status(400).json({ message: 'Invalid user role' });
    }

    res.json({ message: 'User registration successful.' });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: 'Error registering user' });
  }
};




const getUser = async (req, res, next) => {

    try {
    const cookie = req.cookies['jwt'];
    const claims = jwt.verify(cookie, 'secret');
    if (!claims) {
        return res.status(401).json({message: "utilisateur non connecte"})
    }
    const userr = await Profil.findOne({where: {id: claims.id}});
    const {motdepasse, ...data} = await userr.toJSON();
    res.send(data);
}catch(err){
    return res.status(401).json({message: "utilisateur non connecte"})
}
next
};

const signin = async (req, res) => {
  const { adresse, motdepasse } = req.body;

  try {
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    const user = await Profil.findOne({ adresse });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(motdepasse, user.motdepasse);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const formateur = await Formateurs.findOne({ profil: user._id });

    // Check if the user role is formateur and status is not accepted
    if (formateur && formateur.status !== 'Accepté') {
      return res.status(403).json({ message: "Access Denied. Your account is not accepted." });
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret, {
      expiresIn: 31557600, // 24 hours
    });


    req.session.token = token;

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      adresse: user.adresse,
      token: token,
      role: user.role, // Include user role here
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing in' });
  }
};

const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error signing out' });
  }
};

export function getUserById(req, res) {
  const userId = req.params.id;

  Profil.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      } else {
        res.status(200).json(doc);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export async function updateUserProfile(req, res) {
  try {
    const { nom, adresse } = req.body;

    let profile = { nom, adresse };

    if (req.file) {
      console.log('File received:', req.file);

      profile.image = `${req.file.filename}`; // Assurez-vous que le chemin est correct
    }

    const updatedUser = await Profil.findByIdAndUpdate(req.params.id, profile, { new: true });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}

const putPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { motdepasse } = req.body;

    const user = await Profil.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(motdepasse, 10);

    // Update the user's password
    user.motdepasse = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

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


export async function putUser(req, res) {
  try {
    const { nom, adresse, role } = req.body; // Ajoutez role ici
    console.log("Données reçues du client :", req.body); // Log des données reçues du client

    let profile = { nom, adresse, role }; // Utilisez role dans le profil
    console.log("Profil à mettre à jour :", profile); // Log du profil à mettre à jour

    const updatedUser = await Profil.findByIdAndUpdate(req.params.id, profile, { new: true });
    console.log("Utilisateur mis à jour :", updatedUser); // Log de l'utilisateur mis à jour

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}


export async function DeleteUser(req, res) {
  const id = req.params.id;
  
  try {
    // Supprimer le profil
    const prof = await Profil.findByIdAndDelete(id);

    if (!prof) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Supprimer l'utilisateur en fonction du rôle associé au profil
    let utilisateur;
    switch (prof.role) {
      case 'apprenant':
        utilisateur = await Apprenants.findOneAndDelete({ profil: id });
        break;
      case 'formateur':
        utilisateur = await Formateurs.findOneAndDelete({ profil: id });
        break;
      case 'admin':
        utilisateur = await Admins.findOneAndDelete({ profil: id });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!utilisateur) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ message: 'Error deleting user' });
  }
}







export { signup, signin, signout, getUser, putPassword};