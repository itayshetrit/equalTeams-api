const jwt = require('jsonwebtoken')
const Manager = require('../models/manager')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
        const user = await Manager.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({ error: "Please authenticate" })
    }

}
module.exports = auth