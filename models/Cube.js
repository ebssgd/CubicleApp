const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cubeSchema = new schema({
  name: String,
  description: String,
  imageUrl: String,
  difficultyLevel: Number,
  addedAccessories: [], //{ type: schema.Types.ObjectId, ref: "Attached" }
});

const Cube = mongoose.model("Cube", cubeSchema);

module.exports = Cube;
