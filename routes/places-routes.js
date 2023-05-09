const express = require("express");
const { check } = require('express-validator') 

const HttpError = require('../models/http-error')
const router = express.Router();
const placesControllers = require('../controller/places-controller');
const fileUpload = require("../middleware/file-upload");
const checkAuth = require('../middleware/check-auth')

router.get('/:pid',placesControllers.getPlaceById );

router.get('/user/:uid',placesControllers.getPlacesByUserId );

router.use(checkAuth);

router.post('/',fileUpload.single('image'), placesControllers.createPlace);   //Add Validation later

router.patch('/:pid',placesControllers.updatePlace);

router.delete('/:pid',placesControllers.deletePlace);


module.exports = router;


//Validation for post method (second Parameter)
// [
//     check('title')
//     .not()
//     .isEmpty(),
//     check('description').isLength({min:5}),
//     check('address').not().isEmpty()
// ]

//Validation for Patch method (second Parameter)
// [
//     check('title')
//     .not()
//     .isEmpty(),
//     check('description').isLength({min:5})
// ]

//CRUD
// Create => Read => Update => Delete