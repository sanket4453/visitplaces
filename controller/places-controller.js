// const uuid = require('uuid/v4');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const getCoordinate = require('../util/location')
const fileUpload = require('../middleware/file-upload')

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something wents wrong, could not find a place!" });
  }

  if (!place) {
    return res
      .status(404)
      .json({ message: "Could not find a place for the provided place id." });
  } else {
    res.json({ place: place.toObject({ getters: true }) });
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching data failed, Please try again" });
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return res
      .status(404)
      .json({ message: "Could not find a place for the provided user id." });
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

let coordinates = {
  lat : 40.7884474,
  lng: -73.9871516
  // "lat" :
  // //  getCoordinate.lat,
  // "lng" : getCoordinate.lng  
}

const createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Creating Place failed, Please try again" });
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "User is not found,Please check again" });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Creating place failed, please try again!" });
  }
  res.status(201).json({ place: createPlace });
};

const updatePlace = async (req, res, next) => {
  
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, could not update a place" });
  }

  if(place.creator.toString() !== req.userData.userId){
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this place" });
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, could not update a place" });
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, could not delete a place" });
  }

  if (!place) {
    return res
      .status(404)
      .json({ message: "Could not find place for this id" });
  }

  if(place.creator.id !== req.userData.userId){
    return res
    .status(401)
    .json({ message: "You are not allowed to edit this place" });

  }
  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, could not delete a place" });
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });
  res.status(200).json({ message: "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace; 
exports.deletePlace = deletePlace; 
