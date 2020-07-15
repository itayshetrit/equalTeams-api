const mongoose = require('mongoose')
const validator = require('validator')
const turnSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    }

})

turnSchema.statics.findDuplicate = async (name) => {
    const isExist = await Turn.findOne({ name })
    if (isExist) {
        return 'אין אופציה להחזיק ב- 2 תורים';
    }
    return null
}

const Turn = mongoose.model('Turn', turnSchema)

module.exports = Turn