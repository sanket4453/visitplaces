const express = require('express');
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload') 
const usersController = require('../controller/user-controller');

const router = express.Router();

router.get('/',usersController.getUsers);

router.post('/signup',fileUpload.single('image'),usersController.signup);

router.post('/login', usersController.login);

module.exports = router;

//Validation for SignUp method 
// [
//     check('name')
//     .not()
//     .isEmpty(),
//     check('email')
//     .normalizeEmail()
//     .isEmail(),
//     check('password')
//     .isLength({min:6})
// ],