const { Thought, User } = require("../models");

const thoughtController = {
  //thoughtController, bit ominous not gonna lie

  // get all thoughts, doesnt matter if they are intrusive or not
  getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });
  },
  //get a single thought
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //post thought
  addThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { username: body.username },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "We couldn't find this user" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // lets talk about how to properly react to things
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message:
              "The thought must have been forgotten because its nowhere to be found",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  // update thoughts, this is where you grow as a person
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((updatedThought) => {
        if (!updatedThought) {
          return res.status(404).json({
            message:
              "The thought must have been forgotten because its nowhere to be found",
          });
        }
        res.json(updatedThought);
      })
      .catch((err) => res.json(err));
  },

  //remove thoughts huh, this could be useful
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message:
              "The thought must have been forgotten because its nowhere to be found",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
  
  //remove reactions, the spock approach 
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
  )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
},
};

module.exports = thoughtController;
