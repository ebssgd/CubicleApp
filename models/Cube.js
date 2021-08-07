const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cubeSchema = new schema({
  name: String,
  description: String,
  imageUrl: String,
  difficultyLevel: Number,
});

const Cube = mongoose.model("Cube", cubeSchema);

module.exports = Cube;
