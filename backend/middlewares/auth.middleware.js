// auth.middleware.js
export const isAdmin = (req, res, next) => {
    // Vérifier si l'utilisateur est authentifié et a le rôle d'administrateur
    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  

export function verifyToken(req,res,next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undifined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next()
  }else {
    res.sendStatus(403);
  }
}