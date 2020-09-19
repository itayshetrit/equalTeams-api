const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const guestSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true
    },
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
    sum: {
        type: Number,
        required: true,
        trim: true
    },
    closeness: {
        type: String,
        required: true,
        trim: true
    },
    accept: {
        type: Number,
        trim: true
    },
    table: {
        type: Number,
        trim: true
    },
    arrived: {
        type: Number,
        trim: true
    },
    gift: {
        type: Number,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }

})

// methods - instance's methods, individual user

// return values at login
guestSchema.methods.getPublicProfile = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

// jwt at Login
guestSchema.methods.generateAuthToken = async function() {
    const user = this
    // const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

guestSchema.methods.generateAuthAdminToken = async function() {
    const user = this
    // const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_ADMIN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// Login checking
guestSchema.statics.findByCredentials = async (phone, password) => {
    const user = await Guest.findOne({phone})
    if(!user){
        throw new Error('מספר פלאפון לא קיים במערכת') 
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('סיסמא שגויה') // does not shown - ask Igor - because throw instead return? what is better?
    }
    return user
}



const Guest = mongoose.model('Guest', guestSchema)

module.exports = Guest