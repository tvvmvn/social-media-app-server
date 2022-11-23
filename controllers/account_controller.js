const { User } = require("../models/model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    console.log(req.user);

    const user = await User.findOne({email});

    if (!user) {
      const err = new Error("User not found");
      err.status = 401;
      return next(err);
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
      .toString("hex")
    
    if (user.password !== hashedPassword) {
      const err = new Error("Password not match");
      err.status = 401;
      return next(err);
    }

    const token = jwt.sign({ username: user.username }, "shhhhh");

    res.json({ user, token })

  } catch (error) {
    next(error)
  }
}

exports.register = [
  async (req, res, next) => {
    try {
      const {username, email, password} = req.body;

      {
        const user = await User.findOne({username});
        
        if (user) {
          const err = new Error("Username must be unique");
          err.status = 400;
          return next(err);
        }
      }

      {
        const user = await User.findOne({email});
        
        if (user) {
          const err = new Error("Email must be unique");
          err.status = 400;
          return next(err);
        }
      }
  
      next();

    } catch (error) {
      next(error)
    }
  },

  async (req, res, next) => {
    try {
      const {username, email, password} = req.body;

      return console.log(req.body);

      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex")

      const user = new User({
        username,
        email,
        password: hashedPassword,
        salt: salt
      })

      await user.save();

      res.json(user)

    } catch (error) {
      next(error)
    }
}]

exports.edit = async (req, res, next) => {
  try {    
    const loginUser = req.user;
    const user = await User.findById(loginUser._id);
    const bio = req.body.bio;
  
    user.bio = bio;
    await user.save();
  
    res.json(user.bio)

  } catch (error) {
    next(error)
  }
}

exports.upload_image = async (req, res, next) => {
  const form = formidable({});
  
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return next(err);
      }

      const loginUser = req.user;
      const user = await User.findById(loginUser._id);
      const image = files.image;

      const oldPath = image.filepath;
      const ext = image.originalFilename.split(".")[1];
      const newName = image.newFilename + "." + ext;
      const newPath = "data/users/" + newName;

      fs.renameSync(oldPath, newPath);

      user.image = newName;
      await user.save();
      
      res.json(newName);

    } catch (error) {
      next(error)
    }
  })
}

exports.delete_image = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const user = await User.findById(loginUser._id);

    user.image = null;
    await user.save();

    res.end();

  } catch (error) {
    next(error)
  }
}