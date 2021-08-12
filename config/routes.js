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
    Cube.find(function (err, cubes) {
      if (err) return console.error(err);
      const path = url.parse(req.url).pathname;
      let currentId = path.split("/")[2];
      let currentCube = cubes.filter((cube) => cube._id == currentId);
      res.render("details", { currentCube });
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

  app.get("/*", function (req, res) {
    res.render("404");
  });
};
