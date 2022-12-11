const {
  register,
  login,
  passwordReset,
  googleAuthuth,
  githubAuth,
  updatePassword,
  verifyUserConf,
  checkPasswords,
} = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const { userValidator } = require("../validators/userValidator");
const passport = require("passport");
const { auth } = require("../utils/utils");

//register
router.post("/register", [userValidator], register);
// login
router.post("/login", login);
router.put("/resetpassword/:email", passwordReset);

// google authentification
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ['profile', 'email'],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuthuth
);

// github authentification
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  githubAuth
);

// update password
router.put("/changepassword", updatePassword);

router.get("/email/:confirmationCode", verifyUserConf);

router.put("/setpassword/:id", auth, checkPasswords)

module.exports = router;
