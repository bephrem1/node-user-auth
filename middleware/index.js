function loggedOut(req, res, next){
    if(req.session && req.session.userId){
      //This means the user is logged in
      //Take them to their profile page
      return res.redirect('/profile');
    }
    return next();
}

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
      return next();
    } else {
      const error = new Error('You must be logged in to view this page');
      error.status = 401;
      return next(error);
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
