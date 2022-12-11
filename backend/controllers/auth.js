




const { validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/utilisateur");
const { issueJWT, sendConfirmationEmail, validatePassword, resetPassword } = require('../utils/utils');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

 const register = async (req, res) => {

      const errors = validationResult(req).errors;
      if (errors.length !== 0) return res.status(400).json(errors);
      else {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ message: "email already used" });
        } else {
          const {
            first_name,
            last_name,
            email,
            password,
            phoneNumber
          } = req.body;
          let hashedPassword = await bcrypt.hash(password, 10);
          let user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
        
          });
     
          const userToken = issueJWT(user);
          user.confirmationCode = userToken.token.substring(7);
          user.save((err, user) => {
            if (err) {
              console.log(err)
              res.status(500).send({ message: err });
              return;
            }
            res.status(200).json({
              message:
              " registered successfully! Please check your email",
              user_id: user._id,
            });
  
            sendConfirmationEmail(
              first_name + " " + last_name ,
              user.email,
              user.confirmationCode
            );
          });
        }
      }
  };
  
  const login = async (req, res) => {

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "you need to register first" });
        
      } else if (user.status != "Active") {
        return res.status(401).send({
          success: false,
          message: "Pending Account. Please Verify Your Email!",
        });
      } 
        else {
          validatePassword(req.body.password, user.password).then((match) => {
            if (match) {
              const userToken = issueJWT(user);
              res.status(200).json({
                success: true,
                token: userToken.token,
                expiresIn: userToken.expires,
              });
            } else {
              res
                .status(401)
                .json({ success: false, message: "wrong password !" });
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: err.message });
      });
  };



  const verifyUserConf = (req, res, next) => {
    User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User Not found." });
        }
  
        user.status = "Active";
        user.save((err) => {
          if (err) res.status(500).json({ success: false, message: err });
          res.redirect(301, "http://localhost:3000/");
        });
      })
      .catch((e) => console.log("error", e));
  };


  
// google authentication
const googleAuthuth = (req, res) => {

    const email = req.user.emails[0].value;

    try {
      User.findOne({ email: email }).then((match, noMatch) => {
   
        if (match) {
          const accessToken = issueJWT(match);
          res.redirect("http://localhost:3000/?token=" + accessToken.token);
        } else {
          const { familyName, givenName } = req.user.name;
          let newUser = new User({
    
            first_name: givenName,
            last_name: familyName,
            email: email,
            status: "Active",
          });
          newUser.save().then((user, err) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "errors has occurred",
              });
            } else {
              // built-in utility
              const tokenForNewUser = issueJWT(user);
              res.redirect(
                "http://localhost:3000/register/?id=" +
                  user._id +
                  "&token=" +
                  tokenForNewUser.token
              );
            }
          });
        }
      });
    } catch (error) {
      res.json("error");
    }
  }
// github authentication

const githubAuth=  (req, res) =>{
  const email = req.user.emails[0].value;
  try {
    User.findOne({ email: email }).then((match, noMatch) => {
      if (match) {
        const accessToken = issueJWT(match);
        res.redirect("http://localhost:3000?token=" + accessToken.token);
      } else {
        let newUser = new User({
          first_name: req.user.username,
          last_name: req.user.username,
          email: email,
          status: "Active",
        });
        newUser.save().then((done, err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "errors has occurred",
            });
          } else {
            const tokenForNewUser = issueJWT(done);
            res.redirect(
              "http://localhost:3000register/?id=" +
                done._id +
                "&token=" +
                tokenForNewUser.token
            );
          }
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error",
    });
  }
}

const passwordReset =   async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(400).json({ success: false, message:"user not found" });
  } else {
    const id = crypto.randomBytes(4).toString("hex");
    User.findByIdAndUpdate(
      user._id,
      { $set: { resetPasswordCode: id.toUpperCase() } },
      { useFindAndModify: false },
      (err, data) => {
        if (err) {
          return res.status(400).json({ success: false, message:err});;
        } else {
          res.status(200).json({ success: true, email: data.email  });
          resetPassword(
            user.last_name + " " + user.first_name,
            user.email,
            id.toUpperCase()
          );
        }
      }
    );
  }
}; 

// update password
const updatePassword = async (req, res) => {
  console.log(req.body.email,)
    if (!req.body.code) res.json("code is required");
    if (req.body.password)
      var hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ success: false, message: "User Not found." });
        }
        if (user.resetPasswordCode.toUpperCase() == req.body.code.toUpperCase()) {
          const { password, confirmPassword } = req.body;
          console.log(password);
          console.log(confirmPassword)
          if (password && confirmPassword) {
            if (password == confirmPassword) {
              User.findByIdAndUpdate(
                user._id,
                { $set: { password: hashedPassword, resetPasswordCode: null } },
                { new: true },
                (err, data) => {
                  if (err) {
                    console.error(err);
                  } else {
                    const userToken = issueJWT(data);
                    res.status(200).json({
                      token: userToken.token,
                      success: true,
                      message: "your password has been updated",
                    });
                  }
                }
              );
            } else {
              res
                .status(400)
                .json({ success: false, message: "passwords not match" });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "password and confirmPassword are required",
            });
          }
        } else {
          res.status(400).json({ success: false, message: "code incorrect" });
        }
      })
      .catch((e) => console.log("error", e));
  ;
}

// logged in first time with google or github accounts
const checkPasswords = async (req, res) => {
  const { password, password2 } = req.body;
  if (password !== password2) {
    res
      .status(400)
      .json({ success: false, message: "Paswwords does not match" });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(400).json({ success: false, message: "User not found !" });
        } else {
          if (req.user._id != user._id.toString()) {
            res
              .status(400)
              .json({ success: false, message: "Access denied !" });
          } else {
            User.findByIdAndUpdate(
              user._id,
              { $set: { password: hashedPassword, status: "Active" } },
              { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  console.error(err.message);
                } else {
                  const accessToken = issueJWT(data);
                  return res.status(200).json({
                    success: true,
                    token: accessToken.token,
                    expiresIn: accessToken.expires,
                    message: "User was registered successfully!",
                  });
                }
              }
            );
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};


  module.exports = {
   register,
   login,
   passwordReset,
   verifyUserConf,
   githubAuth,
   googleAuthuth,
   checkPasswords,
   updatePassword
}