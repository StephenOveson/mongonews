let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CommentSchema = new Schema({
  name: String,
  body: String
});

let Comment = mongoose.model("Note", CommentSchema);

module.exports = Comment;