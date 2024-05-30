import { validationResult } from "express-validator";
import Users from '../models/User.js';
import asyncHandler from "express-async-handler"
import bcrypt from 'bcryptjs'
import { generatorOTP } from "./utils/mail.js";


  
  
  // export function signin(req, res) {
  //   Users.findOne({ mail: req.body.mail, password: req.body.password }) //besh iconecti
  //     .then((doc) => {
  //       res.status(200).json(doc);
  //       console.log(doc);
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err });
  //     });
  // }
  
  export async function signup(req, res){
    const {password}=req.body
    const salt = await bcrypt.genSalt(10)
    const headPassword = await bcrypt.hash(password,salt)
    const otp = generatorOTP()
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
    } else {
      Users.create({
        firstname: req.body.firstname,
        // lastname: req.body.lastname,
        password: headPassword,
        // confirmPassword: headPassword,
        phone: req.body.phone,
        mail: req.body.mail,
        status: req.body.status,

        //  image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
      })
        .then((newUser) => {
          res.status(200).json({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            password: newUser.password,
            // confirmPassword: newUser.confirmPassword,
            phone: newUser.phone,
            mail: newUser.mail,
            status: newUser.status,

            //  image: newUser.image,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  }

  export function deleteOnce(req, res) {
  Users
  .findOneAndRemove({ "firstname": req.params.firstname })
  .then(doc => {
      res.status(200).json(doc);
  })
  .catch(err => {
      res.status(500).json({ error: err });
  });
}

  export function getUserById(req, res){
  Users.findById(req.params.id)
  .then((doc) => {
    res.status(200).json(doc);
  })
  .catch((err) => {
    res.status(500).json({ error: err });
  });
}

export async function logIn  (req,res){
  const  { mail , password , status } = req.body
  
  const user = await Users.findOne({ mail: mail, status: status })
  // const userStatus = await Users.findOne({ status: status })


  if (user &&(await bcrypt.compare(password,user.password) ) ) {
      res.json({
          _id: user.id,
          firstname: user.firstname,
          // lastname: user.lastname,
          phone: user.phone,
          mail: user.mail,
          status: user.status,
          // confirmPassword: user.confirmPassword,
          password: user.password, 
          // token: generateToken(user._id)
      })
      
  }else{
      res.status(400).json({"message":"invalid"})
  }
}














  
  
  
  

  




