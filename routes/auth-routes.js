const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

const users = [];

const initializePassport = require("../config/passport-setup");
initializePassport(passport, (email) =>
  users.find((user) => user.email === email)
);

router.get("/home", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("home.ejs");
});

router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true
  })
);

router.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch {
    res.redirect("/auth/register");
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/home");
});

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/home" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
