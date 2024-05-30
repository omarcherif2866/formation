import Users from '../models/User.js';
import Role from "../models/Role.js";

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check username
    const usernameExists = await Users.findOne({ username: req.body.username });
    if (usernameExists) {
      return res.status(400).json({ message: "Failed! Username is already in use!" });
    }

    // Check email
    const emailExists = await Users.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkRolesExisted = async (req, res, next) => {
  try {
    if (req.body.roles) {
      for (const role of req.body.roles) {
        const roleExists = await Role.findOne({ name: role });
        if (!roleExists) {
          return res.status(400).json({ message: `Failed! Role ${role} does not exist!` });
        }
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { checkDuplicateUsernameOrEmail, checkRolesExisted };
