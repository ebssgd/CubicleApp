const Cube = require("../models/Cube");
const Accessory = require("../models/Accessory");

exports.homePage = function (req, res) {
  Cube.find(function (err, cubes) {
    if (err) return console.error(err);
    let loggedIn = res.cookie.loggedIn;
    res.render("index", { cubes });
  });
};

exports.details = function (req, res) {
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
};

exports.createCube = function (req, res) {
  res.render("create");
};

exports.newCube = function (req, res) {
  console.log("POSTing new body of code. ", req.body);
  const newCube = new Cube(req.body);
  console.log(newCube);
  newCube.save(function (err, newCube) {
    if (err) return console.error(err);
    console.log("Cube was saved.");
  });

  res.redirect(301, "/");
};

exports.about = function (req, res) {
  res.render("about");
};

exports.createAccessory = function (req, res) {
  res.render("createAccessory");
};

exports.newAccessory = function (req, res) {
  console.log("POSTing body for create accessory. ", req.body);
  const newAccessory = new Accessory(req.body);
  console.log(newAccessory);
  newAccessory.save(function (err, newAccessory) {
    if (err) return console.error(err);
    console.log("Accessory was saved.");
  });

  res.redirect(301, "/create/accessory");
};

exports.showAttachAccessory = async function (req, res) {
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
};

exports.attachAccessory = function (req, res) {
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
};

exports.showLogin = function (req, res) {
  // console.log("This is the login page.");
  res.render("loginPage");
};

exports.login = async function (req, res) {
  console.log(req.body);
  await User.findOne({ username: req.body.username }, function (err, user) {
    console.log("User found!!", user);
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      console.log("The password result is", result);
    });
    const token = jwt.sign({ id: user._id }, "Big Secret", {
      expiresIn: "12h",
    });
    console.log(token);
    res.cookie("token", token);
    res.cookie("loggedIn", true);
  });
  res.redirect("/");
};

exports.showRegister = function (req, res) {
  // console.log("This is the register page.");
  res.render("registerPage");
};

exports.register = async function (req, res) {
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
};

exports.editCube = function (req, res) {
  console.log("This is the edit a Cube page.");
  res.render("editCubePage");
};

exports.deleteCube = function (req, res) {
  console.log("This is the delete page.");
  res.render("deleteCubePage");
};

exports.logout = function (req, res) {
  res.clearCookie("token");
  res.clearCookie("loggedIn");
  res.redirect("/");
};

exports.notFound = function (req, res) {
  res.render("404");
};

// {{#if loggedIn}}
//           <a class="btn btn-info" href="/edit/{{cube._id}}">Edit</a>
//           <a class="btn btn-danger" href="/delete/{{cube._id}}">Delete</a>
//           {{/if}}
