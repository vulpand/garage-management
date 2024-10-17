require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use('/', authRoutes);

// Use api routes
app.use('/', apiRoutes);

// Database connection
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connected'))
  .catch((error) =>
    console.error(`Database connection error: ${error.message}`)
  );

mongoose.connection.on('error', (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const port = process.env.API_PORT || 7000;
app.listen(port, () => console.log(`Server running on port ${port}`));
