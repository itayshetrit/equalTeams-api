const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
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
userSchema.methods.getPublicProfile = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

// jwt at Login
userSchema.methods.generateAuthToken = async function() {
    const user = this
    // const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.generateAuthAdminToken = async function() {
    const user = this
    // const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_ADMIN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// Login checking
userSchema.statics.findByCredentials = async (phone, password) => {
    const user = await User.findOne({phone})
    if(!user){
        throw new Error('מספר פלאפון לא קיים במערכת') 
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('סיסמא שגויה') // does not shown - ask Igor - because throw instead return? what is better?
    }
    return user
}

// hash the password for post and patch
// middleware before save
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User