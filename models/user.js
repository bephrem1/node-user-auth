const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define the database schema by passing in object with keys and values for each field containing info about the attribute
const UserSchema = new mongoose.Schema({
    email: {
        type: String, //Data type of the field
        unique: true, //This attribute cannot already exist in the database
        required: true, //Mongodb will enforce the presence of this field
        trim: true //Removes white space that may be before or after entry
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

//Authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback){
  User.findOne({ email : email})
      .exec(function(error, user){ //Execute the search
        if(error){
          return callback(error);
        } else if (!user){
          //User not found
          const err = new Error('User not found!');
          err.status = 401;
          return callback(err);
        }
        //If code comes to this point then a user was found in the database
        //Compare the password to the found user
        bcrypt.compare(password, user.password, function(error, result){
            if(result === true){
              //Passwords match
              return callback(null, user); //Return null (for the error value) and the user document since we know it matches
            } else {
              return callback();
            }
        })

      })
}

//Presave middleware: function that is run right before something is saved into mongo
UserSchema.pre('save', function(next) {
    const user = this; //User here holds the user object ant its attributes all that the user entered into the form
    //Hash the password
    bcrypt.hash(user.password, 10, function(err, hash) {
        //Handle any errors and pass it to the error handler
        if(err){
          next(err);
        }
        //Store the hash into the user password field before document is persisted to the database
        user.password = hash;

        //The middleware is finished, pass execution to the next function
        next();
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User; //Export the User object now with a schema defined above
