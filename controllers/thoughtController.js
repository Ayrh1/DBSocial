const { Thought, User } = require('../models');

module.exports = {
    // Function to get all of the Thoughts by invoking the find() method with no arguments.
    // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
    async getThoughts(req, res) {
      try {
        const thoughts = await Thought.find();
        res.json(thoughts);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Gets a single Thought using the findOneAndUpdate method. We pass in the ID of the Thought and then respond with it, or an error if not found
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No Thought with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Creates a new Thought. Accepts a request body with the entire Thought object.
    // Because Thought are associated with Users, we then update the User who created the app and add the ID of the Thought to the Thoughts array
    async createThought(req, res) {
      try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
  
        if (!user) {
          return res.status(404).json({
            message: 'Thought created, but found no user with that ID',
          })
        }
  
        res.json('Created the Thought 🎉');
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    // Updates and Thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    // Deletes an thought from the database. Looks for an app by ID.
    // Then if the app exists, we look for any users associated with the app based on he app ID and update the thoughts array for the User.
    async deleteThought(req, res) {
      try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.applicationId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        const user = await User.findOneAndUpdate(
          { thought: req.params.thoughtId },
          { $pull: { thought: req.params.thoughtId } },
          { new: true }
        );
  
        if (!user) {
          return res.status(404).json({
            message: 'thought created but no user with this id!',
          });
        }
  
        res.json({ message: 'thought successfully deleted!' });
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Adds a reaction to an thought. This method is unique in that we add the entire body of the Reaction rather than the ID with the mongodb $addToSet operator.
    async addReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: {  reactions: req.body } },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Remove thought Reaction. This method finds the thought based on ID. It then updates the Reactions array associated with the app in question by removing it's ReactionId from the Reactions array.
    async removeReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
  };
  