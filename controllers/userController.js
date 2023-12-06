const  User = require('../models/User');
const  Thought = require('../models/Thought');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No User with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
//delete user
async deleteUser(req, res) {
  try {
    const userId = req.params.userId; // Assuming you're getting userId from req.params
    const user = await User.findById(userId);
    console.log(user,userId);
    if (!user) {
      return res.status(404).json({ message: 'No user with this id!' });
    }

    // Assuming Post model has a 'user' field referencing User's ObjectId
    await Thought.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User successfully deleted!' });
  } catch (err) {
    console.error(err); // Log the full error to the console
    res.status(500).json({ message: err.message }); // Send a more detailed message to the client
  }
},

  //create a new freind 
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId }, // Assuming the user's ID is passed as 'userId'
        { $addToSet: { friends: req.params.friendId } }, // Add the friend's ID to the friends array
        { runValidators: true, new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId }, // Assuming the user's ID is passed as 'userId'
        { $pull: { friends: req.params.friendId } }, // Remove the friend's ID from the friends array
        { runValidators: true, new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
}
