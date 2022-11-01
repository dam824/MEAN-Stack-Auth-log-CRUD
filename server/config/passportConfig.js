const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
    (username, password, done) => {
        User.findOne({ email: username },
            (err,user)=> {
                if (err)
                return done(err);
                //unknow user
                else if(!user)
                    return done(null, false, { message: 'Email is not registred' });
                //wrong password
                else if (!user.verifyPassword(password))
                    return done(null, false, { message : 'Mauvais mot de passe.' })
                //authentication succeded
                else
                    return done(null, user);
            });
    } )
);