const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware/index'); //custom middleware

// GET /login ... as you can see the custom moddleware we made is literally in the middle of the req and res cycle filtering things
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Login' });
});

// POST /login
router.post('/login', function(req, res, next) {
  if(req.body.email && req.body.password){
    //Authenticate the user based on the code we wrote in the model's user schema
    User.authenticate(req.body.email, req.body.password, function(error, user){
      //Handle any errors the function spits back up
        if(error || !user){
            let err = new Error('Wrong email or wrong password!');
            err.status = 401;
            next(err);
        } else {
            //At this point we are good, the user is found and we can create a session with the user id
            req.session.userId = user._id; //Express creates the session id cookie for us, all we do is make the session with the user id
            return res.redirect("/profile");
        }
    });
  } else {
    //Pass error to error function
    let err = new Error('Email and Password are required');
    err.status = 401; //401: Unauthorized
    return next(err);
  }
});

// GET /register ... as you can see the custom moddleware we made is literally in the middle of the req and res cycle filtering things
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  //Form error checking code
  if(req.body.email &&
     req.body.name &&
     req.body.favoriteBook &&
     req.body.password &&
     req.body.confirmPassword){

       //Conform that user entered the same password and confirmPassword
       if(req.body.password != req.body.confirmPassword){
         //Pass error to error function
         let err = new Error('The passwords here don\'t match!');
         err.status = 400; //400: Bad Request
         return next(err);
       }

     //By this point in our code we know that the input was valid
     //We will now extract the form information into an object
     const userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
     }

     //Use schema's 'create' method to insert this entry into mongo
     User.create(userData, (error, user) => {
       if(error){
          next(error);
       } else {
          //Success, create a session with the user's id and redirect to profile route
          req.session.userId = user._id;
          return res.redirect('/profile');
       }

     });

  } else{
    //Pass error to error function
    let err = new Error('All fields are required');
    err.status = 400; //400: Bad Request
    return next(err);
  }

});

//GET /logout
router.get('/logout', function(req, res, next) {
    if(req.session){
      //If session exists destroy the session and redirect
      req.session.destroy(function(err){
          if(err){
            next(err);
          } else {
            return res.redirect('/');
          }
      });
    }
});

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  //There is a session id based on the user's id, let us find this user by id so we can customize the page for them
  User.findById(req.session.userId)
      .exec(function (error, user) { //Execute the search
        if (error) {
          //If there is an error pass it to the error handler
          return next(error);
        } else {
          //The user id matches an entry and a document has been found. It is in the user variable and we pass the attributes to the profile view
          return res.render('profile', {
            title: 'Profile',
            name: user.name,
            favorite: user.favoriteBook
          });
        }
      });
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
