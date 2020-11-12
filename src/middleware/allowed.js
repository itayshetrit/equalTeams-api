// const jwt = require('jsonwebtoken')
// const User = require('../models/user')
// const allowed = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
//         // const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
//         if (!user) {
//             throw new Error()
//         }
//         req.token=token // last token which used - logout
//         req.user = user
//         next()
//     } catch (err) {
//         res.status(401).send({ error: "רק מנהל מורשה לפעולה זו" })
//     }

// }
// module.exports = allowed