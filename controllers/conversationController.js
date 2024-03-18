const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const mongoose = require("mongoose");
exports.post_conversation = async (req, res, next) => {
  try {
    // create an array with the two users _id
    const participants = [req.user.user._id, req.params.participant_id];

    const existsParticipant = await User.findById(
      req.params.participant_id,
      "username"
    );

    if (!existsParticipant) {
      return res.status(404).json({ errors: "Participant user not found." });
    }

    // this other wise the returned input would be new ObjectId('6d123989dasdsnaihdbasuda')
    // we need only the string
    const participantId = existsParticipant._id.toString();

    // not allowing creation of a conversation that already exists between two users.
    const existsConversation = await Conversation.findOne({
      participants: { $all: [req.user.user._id, participantId] },
    });

    if (existsConversation) {
      return res
        .status(409)
        .json({ errors: "You have a conversation with this person already." });
    }
    // not allowing creation of a conversation without any message.
    if (!req.body.content) {
      return res.status(404).json({
        errors:
          "Sending a message is the first step to starting a conversation.",
      });
    }

    // await the creation of a new conversation so we can pass it on property conversation_id of the Message Schema
    const conversation = new Conversation({
      participants: participants,
      creation: Date.now(),
    });

    await conversation.save();

    // having the conversation created, pass it as conversation_id
    const message = new Message({
      conversation_id: conversation._id,
      sender: req.user.user._id,
      recipient: existsParticipant._id,
      content: req.body.content,
      timestamp: Date.now(),
    });

    await message.save();

    return res.status(200).json({
      message: `You've created a conversation with ${existsParticipant.username}`,
    });
  } catch (err) {
    return next(err);
  }
};
