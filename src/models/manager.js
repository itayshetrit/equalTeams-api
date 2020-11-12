const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const managerSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    teams: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

managerSchema.methods.generateAuthAdminToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_ADMIN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

managerSchema.methods.getPublicProfile = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

managerSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

// turnSchema.statics.findDuplicate = async (name) => {
//     const isExist = await Turn.findOne({ name })
//     if (isExist) {
//         return 'אין אופציה להחזיק ב- 2 תורים';
//     }
//     return null
// }

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;