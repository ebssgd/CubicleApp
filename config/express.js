const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

module.exports = (app) => {
  //   // View Engine Setup

  // app.set('views', path.join(__dirname, 'views')); // setting folder for public files

  // // register the partials, hint if it says module not found after you do this, its because the module most likely isn't there! Import it!

  // hbs.registerPartials(__dirname + '/views/partials');

  // // setting view engine to hbs, engine compiles views and data into HTML

  // app.set('view engine', 'hbs');
  //TODO: Set up the views and the engine
  app.set("view engine", "hbs");
  app.engine(
    "hbs",
    exphbs({
      extname: "hbs",
      defaultLayout: "",
      layoutsDir: __dirname + "/views",
      partialsDir: __dirname + "/views",
    })
  );

  //TODO: Setup the body parser
  app.use(bodyParser.urlencoded({ extended: true }));

  //TODO: Set up the static files
  app.use(express.static("static"));
};
