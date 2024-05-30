import express from 'express';
// import {  isAdmin, isUser } from '../middlewares/authJwt.js';
import {
  // findAllUser,
  // getUserProfile,
  // updateUserProfile,
  forgotPassword,
  resetPassword,
  // createUserFromGoogle,
  // confirmUserByLink,
  // blockUser,
  // unblockUser,
  // getBlockedUserCount,
  // getUnblockedUserCount,
  // getAllUsers,
  // confirmProductByLink,
} from '../controllers/userController.js';

const router = express.Router();

// Middleware pour les en-têtes CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// router.get('/listUser', [ isUser], findAllUser);

// router.get('/users/profiles/:id',  getUserProfile);

// router.put('/users/profile/:userId',  updateUserProfile);

router.post('/forgotPassword', forgotPassword);

router.post('/reset-password', resetPassword);

// router.post('/auth/google', createUserFromGoogle);

// router.get('/confirm-user/:userId', confirmUserByLink);

// router.get('/confirm-product/:productId', confirmProductByLink);

// router.put('/block-user/:userId', [ isUser], blockUser);

// router.put('/unblock-user/:userId', [ isUser], unblockUser);

// router.get('/users',  getAllUsers);

// router.get('/users/blocked/count', [ isUser], getBlockedUserCount);

// router.get('/users/unblocked/count', [ isUser], getUnblockedUserCount);


export default router;
