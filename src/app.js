//* podemos usar esto para generar nuestros uuid originales! https://www.uuidgenerator.net/version4

const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();
require("dotenv").config();

//settings
app.set("port", process.env.PORT || 8000);
//views:
app.set("views", path.join(__dirname, "views"));
//ejs:
app.set("view engine", "ejs");
//estáticos
app.use(express.static(path.join(__dirname, 'public')))


//middlewares
app.use(morgan("tiny"));
//*este middleware es el que va a interpretar la data que venga de los formularios, los va a convertir en json
app.use(express.urlencoded({ extended: false }));

//routes:
app.use(require("./routes/routes"));
//404:
//*si corremos el server antes de crear las rutas, va a caer en este app.use:
app.use((req, res, next) => {
  res.status(404).render('error')
  next()
})


module.exports = app;
