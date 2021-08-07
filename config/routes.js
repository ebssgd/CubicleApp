// TODO: Require Controllers...
const express = require("express");
const Cube = require("../models/Cube");

module.exports = (app) => {
  app.get("/", function (req, res) {
    res.render("index");
  });
  app.get("/details/:id", function (req, res) {
    // res.render('details');
    res.send(`<h1> No data yet, id is ${req.params.id} </h1>`);
  });
  app.get("/create", function (req, res) {
    res.render("create");
  });
  app.post("/create", function (req, res) {
    console.log("POSTing new body of code. ", req.body);
    const newCube = new Cube({
      name: "My first Cube.",
      description: "This is my first cube.",
      imageUrl: "Image goes here.",
      difficultyLevel: 4,
    });
    console.log(newCube);
    newCube.save(function (err, newCube) {
      if (err) return console.error(err);
      console.log("Cube was saved.");
    });

    res.send("Form Submitted");
  });
  app.get("/about", function (req, res) {
    res.render("about");
  });
  app.get("/*", function (req, res) {
    res.render("404");
  });
};
