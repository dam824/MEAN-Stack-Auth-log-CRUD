const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FriendSchema = Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Friend=mongoose.model("Friend",FriendSchema);

module.exports= Friend;