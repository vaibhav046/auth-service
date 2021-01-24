// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// var validateEmail = function (email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };

// /**
//  *  User schema. 
//  */
// var userSchema = new Schema({
//     username: {
//         type: String,
//         unique: true,
//         trim: true,
//         required: true
//     },
//     email: {
//         type: String,
//         index: { unique: true },
//         trim: true,
//         unique: true,
//         required: true,
//         lowercase: true,
//         validate: [validateEmail, 'Please fill a valid email address'],
//         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     _permisssions: {
//         type: Schema.Types.ObjectId,
//         ref: 'permissions'
//     },
//     _roles: {
//         type: Schema.Types.ObjectId,
//         ref: 'roles'
//     }
// });


// /*
// * TODO:encryption storage
// */

// /*
// userSchema.pre('save', function (next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });*/

// mongoose.model('users', userSchema);



class Users {
    constructor(email, username, password, active = true) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.active = active;
    }
}

module.exports = Users;