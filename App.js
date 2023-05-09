const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes); //=> /api/places...
app.use("/api/users", usersRoutes);

// app.use((error, req, res, next) =>{
//     if(res.headerSent){
//         return next(error);
//     }
//     res.status(error.code || 500)
//     res.json({message:error.message || 'An unknown error occured!'});
// })
// sanky
// sanket123
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-s3oxqkb-shard-00-00.gtskve2.mongodb.net:27017,ac-s3oxqkb-shard-00-01.gtskve2.mongodb.net:27017,ac-s3oxqkb-shard-00-02.gtskve2.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-x3giwx-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Running");
    app.listen( process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
console.log("Running outside");
// app.listen(5000);
