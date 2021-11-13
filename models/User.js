const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'You need to provide a username!',
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: 'You need to provide an email!',
      trim: true,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);


UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});


// create the User model using the UserSchema
const User = model("User", UserSchema);

// export the User model
module.exports = User;
