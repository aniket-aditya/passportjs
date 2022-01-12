const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, cb) => {
        const user = getUserByEmail(email)
        if(user == null) {
            return cb(null, false, { message: 'No user with that email' })
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return cb(null, user)
            } else {
                return cb(null, false, { message: 'Password Incorrect' })
            }
        } catch(e) {
            return cb(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

module.exports = initialize
