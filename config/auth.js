module.exports = {

    ensureAuthenticatedStudent: function(req, res, next) {
    if (req.user.role ==="student") {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },


   ensureAuthenticatedProfessor: function(req, res, next) {
    if (req.user.role ==="professor") {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  }

}
