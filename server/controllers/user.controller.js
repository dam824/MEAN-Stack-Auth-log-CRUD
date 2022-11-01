const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { rest } = require('lodash');
const User = mongoose.model('User');
// updated crud code



ObjectId = require('mongoose').Types.ObjectId; //catch collection Id
// end updated crud code



module.exports.register = (req, res, next) => {
    //console.log('inside register function');
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;
    user.followers = req.body.followers;
    user.following = req.body.following;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code = 1100)
                res.status(422).send(['L\'adresse email existe déja.']);
                else
                    return next(err);
        } 

    });
}

module.exports.authenticate = (req, res, next) => {
    //call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        //error from passport middleware
        if (err) return res.status(404).json(err);
        //registered user
        else if(user) return res.status(200).json({ "token" : user.generateJwt() });
        //unknow user or wrong password
        else return res.status(401).json(info);
    })(req,res);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
            return res.status(404).json({ status: false, message: 'User record not found'});
            else
            return res.status(200).json({ status: true, user: _.pick(user,['fullName', 'email', 'role', 'friends','followers','following']) });
        })
}

module.exports.getAllUser = async (req, res) => {
   const users = await User.find().select('-password');
   res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
  return res.status(400).send('ID unknown :' + req.params.id)

  User.findById(req.params.id, (err,docs) => {
    if(!err) res.send(docs);
    else console.log('ID unknown ; ' . err);
  }) .select('-password');

};

module.exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
  return res.status(400).send('ID unknown :' + req.params.id)

  try {
    await User.findOneAndUpdate(
      {_id: req.params.id},
      {
        $set: {
          role : req.body.role
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true},
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    
  } catch (err){
    return res.status(500).json({ message: err});
  }
}

module.exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
  return res.status(400).send('ID unknown :' + req.params.id)

  try {
    await User.remove({_id: req.params.id}).exec();
    res.status(200).json({ message: "Successfully deleted. "});
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

module.exports.follow = async (req, res) => {
  /* if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.params.idToFollow))
  return res.status(400).send('ID unknown :' + req.params.id) */
   
  try {
    // add to the follower list
    await User.findByIdAndUpdate(
      req.params.id, // id wanted to being followed
      { $addToSet: { following: req.body.idToFollow } }, // id being followed
      { new : true, upsert: true },
      
    );
    // add to following list
    await User.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id}},
      { new: true, upsert: true },
    )
    return res.status(201).json(docs);

  }catch (err) {
    return res.status(500).json({ message: err });
  }
};

/* module.exports.follow = async (req, res, next) => {
  const { follower, following, action } = req.body;
  try {
      switch(action) {
          case 'follow':
              await Promise.all([ 
                  User.findByIdAndUpdate(follower, { $push: { following: following }}),
                  User.findByIdAndUpdate(following, { $push: { followers: follower }})
              
              ]);
          break;

          case 'unfollow':
              await Promise.all([ 
                  User.findByIdAndUpdate(follower, { $pull: { following: following }}),
                  User.findByIdAndUpdate(following, { $pull: { followers: follower }})
              
              ]); 
          break;

          default:
              break;
      }

      res.json({ done: true });
      
  } catch(err) {
      res.json({ done: false });
  }
}; */



module.exports.unfollow = async (req, res) => {
  /* if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.params.idToFollow))
  return res.status(400).send('ID unknown :' + req.params.id) */
   
  try {
    // add to the follower list
    await User.findByIdAndUpdate(
      req.params.id, // id wanted to being followed
      { $pull: { following: req.body.idToUnFollow } }, // id being followed
      { new : true, upsert: true },
      
    );
    // add to following list
    await User.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { followers: req.params.id}},
      { new: true, upsert: true },
    )
    return res.status(201).json(docs);

  }catch (err) {
    return res.status(500).json({ message: err });
  }
};

/* 
  module.exports.updatelUser = async (req, res) => {
  const users = await User.find().select();
  res.status(200).json(users);
};

*/

//update crud code

/* const addUser = async (req, res) => {
  try {
      let utilisateur = new userSchema(
          req.body.fullName,
          req.body.email,
          req.body.role
      );

      let result = await client
      .bd()
      .collection("user")
      .insertOne(utilisateur);

      res.status(200).json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }  
};

module.exports = { addUser }; */



/*
   
  exports.createUser = async (req, res) => {
    try {
      const User = await userCrudService.createUser(req.body);
      res.json({ data: User, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
   
  exports.getUserById = async (req, res) => {
    try {
      const User = await userCrudService.getUserById(req.params.id);
      res.json({ data: User, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
   
  exports.updateUser = async (req, res) => {
    try {
      const User = await userCrudService.updateUser(req.params.id, req.body);
      res.json({ data: User, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
   
  exports.deleteUser = async (req, res) => {
    try {
      const User = await userCrudService.deleteUser(req.params.id);
      res.json({ data: User, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };*/

// end updated crud code

