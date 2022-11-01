const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

//auth
router.post('/register', ctrlUser.register,);
router.post('/authenticate',ctrlUser.authenticate);


// user display 
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/list', ctrlUser.getAllUser);
router.get('/user/:id', ctrlUser.userInfo);
router.put("/user/:id",ctrlUser.updateUser);
router.delete("/user/:id",ctrlUser.deleteUser);

//follow
router.patch('/user/follow/:id', ctrlUser.follow);
router.patch('/user/unfollow/:id', ctrlUser.unfollow);



module.exports = router;