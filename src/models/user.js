const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const KindEnum = {
	parent: 'parent',
	child: 'child',
	regular: 'regular'
}

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
    dinamic_list: {
        type: Array
    },
    static_list: {
        type: Array
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: Number
    },
    kind: {
        type: String,
        required: false,
        default: KindEnum.regular
    },
    flag: {
        type: Boolean,
        default: false
    },
    changes: {
        type: Number,
        default: 0
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
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Email is not exist') // does not shown - ask Igor - because throw instead return? what is better?
        // return Error(404,'Email is not exist'); // does not shown - ask Igor - because throw instead return? what is better?
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Wrong Password') // does not shown - ask Igor - because throw instead return? what is better?
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