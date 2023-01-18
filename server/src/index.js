const { config } = require("dotenv");
config();

const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const upload = multer();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const passport = require("passport");

const getFilesController = require("./controllers/getFilesController");
const getFileController = require("./controllers/getFileController");
const postFileController = require("./controllers/postFileController");
const isAuthenticated = require("./middleware/isAuthenticated");

const GoogleStrategy = require("passport-google-oauth2").Strategy;

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SECRET],
    maxAge: 2 * 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/error",
  })
);

app.get("/error", (req, res) => {
  res.send("something went wrong..");
});

app.post("/files", isAuthenticated, upload.single("file"), postFileController);

app.get("/files", isAuthenticated, getFilesController);

app.get("/files/:filename", isAuthenticated, getFileController);

mongoose.set("strictQuery", false);

mongoose.connect(MONGO_URL).then(() => {
  console.log(`listening on port ${PORT}`);
  app.listen(PORT);
});
