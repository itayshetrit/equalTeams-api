const mongoose = require('mongoose')
const tableSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true
    },
    tables: {
        type: Array,
        required: true
    }
})

// turnSchema.statics.findDuplicate = async (name) => {
//     const isExist = await Turn.findOne({ name })
//     if (isExist) {
//         return 'אין אופציה להחזיק ב- 2 תורים';
//     }
//     return null
// }

const Table = mongoose.model('Table', tableSchema)

module.exports = Table