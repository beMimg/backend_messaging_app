const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: {
    type: Array,
    contentType: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creation: { type: Date, required: true },
  update: { type: Date },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
