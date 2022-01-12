require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth-routes");
const passport = require("passport");
const session = require("express-session");
const isAuth = require("./middleware/auth");
const flash = require("express-flash");


app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set("view-engine", "ejs");
app.use("/auth", authRoutes);
app.use(isAuth);

app.get("/", isAuth, (req, res) => {
  res.render("index.ejs", { name: req.user.username || req.user.name });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
