const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: String,
  genre: String,
  // Shaun just let (authorID) to be a String
  authorID: {
    type: Schema.Types.ObjectId,
    ref: "Author"
  }
});

module.exports = mongoose.model("Book", BookSchema, "books");
