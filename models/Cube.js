const mongoose = require("mongoose");
const schema = mongoose.Schema;
const accessory = require("./Accessory");

const cubeSchema = new schema({
  name: String,
  description: String,
  imageUrl: String,
  difficultyLevel: Number,
  addedAccessories: [{ type: schema.Types.ObjectId, ref: "Accessory" }],
});

const Cube = mongoose.model("Cube", cubeSchema);

module.exports = Cube;
