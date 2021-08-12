// TODO: Require Controllers...
const express = require("express");
const Cube = require("../models/Cube");
const url = require("url");
const Accessory = require("../models/Accessory");

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
      // const path = url.parse(req.url).pathname;
      // let currentId = path.split("/")[2];
      // let currentCube = cubes.filter((cube) => cube._id == currentId);
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

  app.get("/*", function (req, res) {
    res.render("404");
  });
};
