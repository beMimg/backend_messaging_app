const Conversation = require("../models/conversation");
const User = require("../models/user");

exports.post_conversation = async (req, res, next) => {
  try {
    // create an array with the two users _id
    const participants = [req.user.user._id, req.body.participant];

    const existsParticipant = await User.findById(
      req.body.participant,
      "username"
    );

    if (!existsParticipant) {
      return res.status(404).json({ errors: "Participant user not found." });
    }

    // not allowing a creation of a conversation that already exists between two users.
    const participantsCondition = req.user.user._id && req.body.participant;
    const existsConversation = await Conversation.findOne({
      participants: participantsCondition,
    });

    if (existsConversation) {
      return res
        .status(409)
        .json({ errors: "You have a conversation with this person already." });
    }

    const conversation = new Conversation({
      participants: participants,
      creation: Date.now(),
    });

    await conversation.save();
    return res.status(200).json({
      message: `You've created a conversation with ${existsParticipant.username}`,
    });
  } catch (err) {
    return next(err);
  }
};
