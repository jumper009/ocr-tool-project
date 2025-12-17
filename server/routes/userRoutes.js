const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  register,
  login
} = require('../controllers/userController');

// 认证路由
router.post('/register', register);
router.post('/login', login);

// CRUD路由
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
