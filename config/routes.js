// TODO: Require Controllers...
const express = require("express");
const Cube = require("../models/Cube");
const url = require("url");
const Accessory = require("../models/Accessory");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cubeController = require("../controllers/cubeController");

module.exports = (app) => {
  app.get("/", cubeController.homePage);

  app.get("/details/:id", cubeController.details);

  app.get("/create", cubeController.createCube);

  app.post("/create", cubeController.newCube);

  app.get("/about", cubeController.about);

  app.get("/create/accessory", cubeController.createAccessory);

  app.post("/create/accessory", cubeController.newAccessory);

  app.get("/attach/accessory/:id", cubeController.showAttachAccessory);

  app.post("/attach/accessory/:id", cubeController.attachAccessory);

  app.get("/login", cubeController.showLogin);

  app.post("/login", cubeController.login);

  app.get("/register", cubeController.showRegister);

  app.post("/register", cubeController.register);

  app.get("/edit", cubeController.editCube);

  app.get("/delete", cubeController.deleteCube);

  app.get("/*", cubeController.notFound);
};

//{{#if errors}}
// <div id="notifications">

//{/* <div class="alert alert-warning" role="alert">
// {{errors}}
// </div>
//   </div>
//     {{/if}} */

//No idea where this goes, but I guess it handles errors somehow
