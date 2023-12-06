const router = require('express').Router();
const {
  getUsers,
  getSingleUser, 
  createUser,//post
  deleteUser, 
  updateUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId')
.get(getSingleUser)
.put(updateUser) //update user by id
.delete(deleteUser); //delete user by id

router.route('/:userId/friends/:friendId')
.post(addFriend) // add new friend 
.delete(removeFriend); // delete friend

module.exports = router;
