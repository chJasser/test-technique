const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("../models/utilisateur");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

/**
 *
 *
 * JWT STRATEGY !!
 *
 *
 *
 */

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SEC,
};
passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  User.findOne({ email: jwt_payload.email }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));


/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
google strategy

 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
   
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

/**
 *
 *
 *
 *Github
 *
 *
 */
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GIT_CLIENT_ID,
      clientSecret: process.env.GIT_CLIENT_SECRET,
      callbackURL: process.env.GIT_CALLBACK_URL,
      scope: ["user:email"],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
/**
 *
 *
 *
 */

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });