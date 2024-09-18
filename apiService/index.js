const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user)
        return done(null, false, { message: 'No user with that username' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Password incorrect' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);
        const newUser = new User({
          googleId: profile.id,
          username: profile.emails[0].value
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ facebookId: profile.id });
        if (user) return done(null, user);
        const newUser = new User({
          facebookId: profile.id,
          username: profile.emails[0].value
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  }
);

// Google authentication routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.redirect(`/login?token=${token}`);
  }
);

// Facebook authentication routes
app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.redirect(`/login?token=${token}`);
  }
);

app.listen(port, () => {
  console.log(`API Service running on http://localhost:${port}`);
});
