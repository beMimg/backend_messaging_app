const Conversation = require("../models/conversation");
const Message = require("../models/message");

exports.post_message = async (req, res, next) => {
  try {
    // verifies if the user is in this conversation.
    const conversation = await Conversation.findById(
      req.params.conversation_id
    );

    if (!conversation) {
      return res
        .status(404)
        .json({ errors: "This conversation doesn't exists." });
    }

    const isUserInConversation = conversation.participants.includes(
      req.user.user._id
    );

    if (!isUserInConversation) {
      return res
        .status(401)
        .json({ errors: "Your are not in this conversation" });
    }

    // No message return
    if (!req.body.content) {
      return res
        .status(409)
        .json({ errors: "You can't send an empty message." });
    }
    // Filtering through the conversation.participants array,
    // we get the ID of the user that doesn't much the user that sends the menssage.
    const recipient = conversation.participants.filter(
      (participant) => participant !== req.user.user._id
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
