const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching users failed, please try again later." });
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, please try again later" });
  }
  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User exists already, please login instead" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res
      .status(500)
      .json("Could not able to create user, please try again..!!");
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });


  try {
    await createdUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Creating a user failed, please try again.." });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {

    return res
      .status(500)
      .json({ message: "Creating a user failed, please try again.. from token" });
  }

  

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging up failed, please try again later" });
  }

  if (!existingUser) {
    return res
      .status(403)
      .json({ message: "Invalid Credetials, Could not log you in." });
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(500)
      .json("Could not logged in, please check credentials and try again.");
  }

  if (!isValidPassword) {
    return res
      .status(403)
      .json({ message: "Invalid Credetials, Could not log you in." });
  }

  let token;
  try{
    
    token = jwt.sign({
      userId : existingUser.id,
      email: existingUser.email
    },
    process.env.JWT_KEY,
      { expiresIn: '1h' }
    )
  
  }catch(err){
    return res
      .status(500)
      .json({ message: "Sign in failed, please try again" });
  }

  res.json({
   userId : existingUser.id,
   email: existingUser.email,
   token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
