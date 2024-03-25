const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");

exports.get_messages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversation_id
    );

    if (!conversation) {
      return res
        .status(404)
        .json({ errors: "This conversation doesn't exists." });
    }

    // verifies if the user is in this conversation
    const isUserInConversation = conversation.participants.includes(
      req.user.user._id
    );

    // return error if the user is not in the conversation
    if (!isUserInConversation) {
      return res
        .status(401)
        .json({ errors: "Your are not in this conversation" });
    }

    // finds all messages in the conversation id passed in req.params.conversation_id
    // sorts by most recent
    const allMessagesInConversation = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort({ timestamp: 1 });

    return res.status(200).json({ allMessages: allMessagesInConversation });
  } catch (err) {
    return next(err);
  }
};

exports.post_message = async (req, res, next) => {
  try {
    // finds the conversation
    const conversation = await Conversation.findById(
      req.params.conversation_id
    );

    if (!conversation) {
      return res
        .status(404)
        .json({ errors: "This conversation doesn't exists." });
    }

    // verifies if the user is in this conversation
    const isUserInConversation = conversation.participants.includes(
      req.user.user._id
    );

    // return error if the user is not in the conversation
    if (!isUserInConversation) {
      return res
        .status(401)
        .json({ errors: "Your are not in this conversation" });
    }

    // if the req.body.content is empty, meaning no message sent, return error
    if (!req.body.content) {
      return res
        .status(409)
        .json({ errors: "You can't send an empty message." });
    }

    // Filter through the conversation.participants array,
    // we get the ID of the user that doesn't match the user that sends the menssage.
    // This way we get the ID of the participant
    const recipient = conversation.participants.filter(
      (participant) =>
        participant._id.toString() !== req.user.user._id.toString()
    );

    const message = new Message({
      conversation_id: conversation._id,
      sender: req.user.user._id,
      recipient: recipient,
      content: req.body.content,
      timestamp: Date.now(),
    });

    await message.save();
    return res
      .status(200)
      .json({ message: `You have sucessfully send a message to ${recipient}` });
  } catch (err) {
    return next(err);
  }
};
