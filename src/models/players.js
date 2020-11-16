const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const playerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    team: {
        type: String,
        required: true,
        trim: true
    },
    laundry: {
        type: Number,
        default: 0,
        trim: true
    },
    uid: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 6
    },
    attack: {
        type: Number,
        default: 1
    },
    defense: {
        type: Number,
        default: 1
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// methods - instance's methods, individual user

// return values at login
playerSchema.methods.getPublicProfile = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

// jwt at Login
playerSchema.methods.generateAuthToken = async function() {
    const user = this
    
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

playerSchema.methods.generateAuthAdminToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_ADMIN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// Login checking
playerSchema.statics.findByCredentials = async (phone, password) => {
    const user = await User.findOne({phone})
    if(!user){
        throw new Error('מספר פלאפון לא קיים במערכת') 
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('סיסמא שגויה')
    }
    return user
}

// hash the password for post and patch
// middleware before save
playerSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;