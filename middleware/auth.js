
const isAuth = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/home");
    }
  };

  module.exports = isAuth