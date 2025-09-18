const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL,
);

if (!isGoogleConfigured) {
  console.warn('Google OAuth is not configured. Skipping GoogleStrategy initialization.');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // TODO: Replace with DB logic to create or find a user

        let data = await User.findOne({ email: profile.emails[0].value });
        if (data) {
          done(null, data);
        } else {
          try {
            let response = await User.create({
              username: profile.displayName,
              password: 'googlebro',
              image: profile.photos[0].value,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
            const data = await response.save();
            return done(null, data);
          } catch (error) {
            console.log(error);
          }
        }
      },
    ),
  );
}

passport.serializeUser((user, done) => {
  console.log('Uservalues', user);
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    let user = await User.findOne({ email: email });

    if (user) {
      done(null, user);
    }
  } catch (error) {
    console.log(error);
  }
});
