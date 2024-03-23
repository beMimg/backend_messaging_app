const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const mongoose = require("mongoose");

exports.post_conversation = async (req, res, next) => {
  try {
    // need to get both to populate the Schema.Types.ObjectId, string of the _id is not enough.
    const user = await User.findById(req.user.user._id);
    const participant = await User.findById(req.params.participant_id);

    // create an array with the two users _id
    const participants = [user._id, participant._id];

    if (!participant) {
      return res.status(404).json({ errors: "Participant user not found." });
    }

    // not allowing creation of a conversation that already exists between two users.
    const existsConversation = await Conversation.findOne({
      participants: {
        $all: [user._id, participant._id],
      },
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
      sender: user._id,
      recipient: participant._id,
      content: req.body.content,
      timestamp: Date.now(),
    });

    await message.save();

    return res.status(200).json({
      message: `You've created a conversation with ${participant._id}`,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_conversations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id);

    let conversations = await Conversation.find({
      participants: { $all: [user._id] },
    }).populate({ path: "participants", select: "username first_name" });

    // Only need to send the information of the other participant.
    // Filter through participants and send the information of the _id,
    // that doesn't match the user._id.
    const userIdString = user._id.toString();

    const allUserConversations = conversations.map((conversation) => {
      // Filter out the current user's participant object
      const participantsExceptCurrentUser = conversation.participants.filter(
        (participant) => participant._id.toString() !== userIdString
      );

      // remove the [], just return the object of the participant
      return participantsExceptCurrentUser[0];
    });

    return res.json({ allUserConversations });
  } catch (err) {
    return next(err);
  }
};
