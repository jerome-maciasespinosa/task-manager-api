const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// THE ITINIAL OBJECT SCHEMA CAN BE DIRECTLY SET INSIDE  MONGOOSE.SCHEMA IN THE SECOND PARAMTER
// BUT IF WE NEED MORE CONFIGURATION LIKE METHODS OR STATICS OR PRE OR ... , WE NEED TO USE THE NEW MONGOOSE.SCHEMA AS BELOW
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true,
    },
    age : {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) 
                throw new Error('age must be positif')
        }
    },
    email:{
        type: String,
        trim:true,
        unique: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value))
                throw new Error('the input is not a correct email format');
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
        validate(value) { // Allow the create a custome validation
            if (value.toLowerCase().includes('password')) 
                throw new Error('password can\'t contains password');
        }
    },
    salt: {
        type: String,
    }, 
    // WE CAN SET ARRAYS & TO GET IT, DO IT INSIDE STRING => eex : await User.findOne({_id: decoded._id, 'tokens.token': token})
    // SEE AUTH MIDDLEWARE
    tokens: [{ 
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {timestamps: true})

// FOR BELOW METHODS, USE REGULAR FUNCTION TO KEEP THE SCOPE OF THE CURRENT USER INSTANCE
// do not use arrow function because we need the this that would be the current user

// METHODS ALLOW US TO USE A METHOD FROM THE MODEL
userSchema.statics.findByCredentials = async (email, password) => { // Allow to add methods to User schema
    const user = await User.findOne({ email});
    if (!user) 
        throw new Error('no user found');
    if (!await bcrypt.compare(password, user.password))
        throw new Error('invalid password');
    return user;
}

// METHODS ALLOW US TO USE A METHOD FROM AN INSTANCE
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '10 minutes'});
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return userObj;
}

// EXECUTED JUST BEFORE SAVING
userSchema.pre('save', async function (next) { // Allow to do some stuff before saving!
    const user = this;
    if (user.isModified('password')) {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
        // user.salt = salt;
    }
    next(); // Required to execute next() to continue the execution
})

// EXECUTED JUSTE BEFORE REMOVAL
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

// SIMULATE TASKS INSIDE USER AND CREATE THE RELATION WITH TASK
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

const User = mongoose.model('User', userSchema)

module.exports = User;