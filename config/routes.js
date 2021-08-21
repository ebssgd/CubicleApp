// TODO: Require Controllers...
const express = require("express");
const Cube = require("../models/Cube");
const url = require("url");
const Accessory = require("../models/Accessory");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.get("/", function (req, res) {
    Cube.find(function (err, cubes) {
      if (err) return console.error(err);
      res.render("index", { cubes });
    });
  });
  app.get("/details/:id", function (req, res) {
    Cube.findById(req.params.id, function (err, cube) {
      if (err) return console.error(err);
      Accessory.find(function (err, accessories) {
        if (err) return console.error(err);
      }).then((response) => {
        let attachedArray = [];
        response.forEach((item) => {
          if (cube.addedAccessories.includes(item._id)) {
            attachedArray.push(item);
          }
        });
        res.render("details", { cube, attachedArray });
      });
    });
  });
  app.get("/create", function (req, res) {
    res.render("create");
  });
  app.post("/create", function (req, res) {
    console.log("POSTing new body of code. ", req.body);
    const newCube = new Cube(req.body);
    console.log(newCube);
    newCube.save(function (err, newCube) {
      if (err) return console.error(err);
      console.log("Cube was saved.");
    });

    res.redirect(301, "/");
  });
  app.get("/about", function (req, res) {
    res.render("about");
  });
  app.get("/create/accessory", function (req, res) {
    res.render("createAccessory");
  });
  app.post("/create/accessory", function (req, res) {
    console.log("POSTing body for create accessory. ", req.body);
    const newAccessory = new Accessory(req.body);
    console.log(newAccessory);
    newAccessory.save(function (err, newAccessory) {
      if (err) return console.error(err);
      console.log("Accessory was saved.");
    });

    res.redirect(301, "/create/accessory");
  });

  app.get("/attach/accessory/:id", async function (req, res) {
    try {
      let aCube = await Cube.findById(req.params.id, function (err, cube) {
        if (err) return console.error(err);
        console.log(cube);
      });
      let accessories = await Accessory.find({});
      console.log(accessories);
      res.render("attachAccessory", { cube: aCube, accessories });
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/attach/accessory/:id", function (req, res) {
    console.log(req.body, req.params);

    // Retrieve value of selection menu (chosen accessory)
    const selectedAccessory = req.body.accessory;

    // Retrieve current cube's id from the "/:id" parameter in the url path
    const cubeId = req.params.id;

    // Find current cube by Id
    Cube.findById(cubeId, function (err, cube) {
      if (err) return console.error(err);

      // Get collection of existing accessories
      Accessory.find(function (err, accessories) {
        // Filter out the accessory doc associated with the chosen option
        let attachThisAccessory = accessories.filter(
          (accessory) => accessory.name == selectedAccessory
        )[0];

        if (!cube.addedAccessories.includes(attachThisAccessory._id)) {
          cube.addedAccessories.push(attachThisAccessory);

          cube.save(function (err) {
            if (err) return console.error(err);

            res.redirect(`/details/${cubeId}`);
          });
        } else {
          console.log("Accessory Already Attached to this Cube!");

          res.redirect(`/details/${cubeId}`);
        }
      });
    });
  });

  app.get("/login", function (req, res) {
    console.log("This is the login page.");
    res.render("loginPage");
  });

  app.post("/login", async function (req, res) {
    console.log(req.body);
    await User.findOne({ username: req.body.username }, function (err, user) {
      console.log("User found!!", user);
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        console.log("The password result is", result);
      });
      const token = jwt.sign({ id: user._id }, "Big Secret", {
        expiresIn: "2d",
      });
      console.log(token);
      res.cookie("token", token);
    });
    res.redirect("/");
  });

  app.get("/register", function (req, res) {
    console.log("This is the register page.");
    res.render("registerPage");
  });

  app.post("/register", async function (req, res) {
    const salt = 8;
    await bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Store hash in your password DB.
      console.log("This is the hash, ", hash);
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      console.log(newUser);
      newUser.save(function (err, newUser) {
        if (err) return console.error(err);
        console.log("User was saved.");

        res.redirect("/login");
      });
    });
  });

  app.get("/edit", function (req, res) {
    console.log("This is the edit a Cube page.");
    res.render("editCubePage");
  });

  app.get("/delete", function (req, res) {
    console.log("This is the delete page.");
    res.render("deleteCubePage");
  });

  app.get("/*", function (req, res) {
    res.render("404");
  });
};
