// TODO: Require Controllers...
const express = require("express");

module.exports = (app) => {
  app.get("/", function (req, res) {
    res.render("index");
  });
  app.get("/details/:id", function (req, res) {
    res.render("details");
  });
  app.get("/create", function (req, res) {
    res.render("create");
  });
  app.post("/create", function (req, res) {
    console.log("POSTing new body of code. ", req.body);
    res.send("Form Submitted");
  });
  app.get("/about", function (req, res) {
    res.render("about");
  });
  app.get("/*", function (req, res) {
    res.render("404");
  });
};
