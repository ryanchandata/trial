let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");

let jwt = require('jsonwebtoken');
let DB = require('../config/db');

let userModel = require("../models/user");
let User = userModel.User; // alias

// * controller for processing Login page
module.exports.processLoginPage = (req,res, next) =>{
    passport.authenticate('local',
    (err, user, info) => {
        // server err?
        if(err)
        {
            return next(err);
        }
        //is there a user login error?
        if(!user)
        {
            return res.json({success: false, msg: 'Error: Failed to log in user!'});
        }

        req.login(user, (err) => {
            // server error?
            if(err)
            {
                return next(err);
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
                expiresIn: 604800 // 1 week
            });
            
            return res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }, token: authToken});

        });
    })(req, res, next);
}



//* controller for processing registration page
module.exports.processRegisterPage = (req, res, next) => {
    // define a new user object
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            if (err.name == "UserExistsError") {  
                //return res.json({success: false, msg: 'Username taken, please choose another username.'});
            }
            return res.json({success: false, msg: 'Error: failed to create user.'});
        } else {
        // if no error exists, then registration is successful
        return res.json({success: true, msg: 'User Registered Successfully!'});
        }
    });
};

//* controller for update user
module.exports.processUpdateUser = (req, res, next) => {
    const id = req.body.id;
    const newDisplayName = req.body.displayName;
    const newEmail = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    User.findByUsername(username).then((foundUser) => {
        if (foundUser){
            foundUser.changePassword(password, newPassword, (err) => {
                if (err) {
                    res.json({success: false, message: 'old password does not match.'});
                } else {
                    // if passwords match, update displayname and date updated
                    User.updateOne({_id: id}, {
                        displayName: newDisplayName,
                        email: newEmail,
                        update: Date.now()
                    }, (err) => {
                        // there should be no error since we searched for the user before
                    })
                    foundUser.save();
                    res.json({success: true, message: 'password reset successful.'});
                }
            });
        } else {
            res.status(500).json({success: false, message: 'This user does not exist'});
        }
    }, (err) => {
        console.error(err);
    })

}

//* controller for processing logout
module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.json({success: true, msg: 'User Successfully Logged out!'});
};
