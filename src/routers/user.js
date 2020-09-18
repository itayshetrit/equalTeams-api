const experss = require('express');
const User = require('../models/user');
const allowed = require('../middleware/allowed');
const auth = require('../middleware/auth');
// import * as validateAuth from '../validators/Auth';

const router = new experss.Router()

// pass name, email and password at body
router.post('/users', async (req, res) => {
    const user = new User({ ...req.body })
    try {
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// pass email and password at body, return token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.phone, req.body.password)
        if (user.flag === false) {
            res.status(406).send("המשתמש עדיין ממתין לאישור המנהל")
        }
        let token;
        if (user.role == 2) {
            token = await user.generateAuthAdminToken()
        }
        else {
            token = await user.generateAuthToken()
        }
        // res.send({user,token}) - it possible to use it but change "getPublicProfile" func at model to "toJSON" which affects every user response
        res.send({ user: user.getPublicProfile(), token }) // without tokens[] and password
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// check auth - pass token at headers like every request
router.get('/users/checkAuth/me', auth, async (req, res) => {
    res.status(200).send(req.user.getPublicProfile())
});
// logout from current device - pass token at headers like every request
router.post('/users/logout', auth, async (req, res) => { // this session

    try {
        // req.user.tokens = req.user.tokens.filter((token) => {return token.token!==req.token}) - why mead used "return"?
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

// logout from all devices - pass token at headers like every request
router.post('/users/logoutAll', auth, async (req, res) => { // all sessions
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (err) {
        res.status(500).send(err)
    }
})

// 
router.get('/users', allowed, async (req, res) => {
    try {
        const users = await User.find({}).select(['name', 'phone', 'end_date', 'flag'])
        // .sort({ flag: 1 })
        res.send(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    console.log(req)
    res.status(200).send(req.user.getPublicProfile())
})

// pass user.id at params
router.get('/users/:id', allowed, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()// does not work, return 400 instead 404 - ask Igor
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// pass user.id at params
// pass name, email and password (optional)
router.patch('/users/:id', allowed, async (req, res) => {
    const updates = Object.keys(req.body)
    const allows = ['name', 'phone', 'password', 'flag', 'end_date']
    const isValid = updates.every((update) => allows.includes(update))
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()// does not work, return 400 instead 404 - ask Igor
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
        // change it for pre save at user model which hash the password only at 'save'

        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.get('/users/me/changes', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allows = ['static_list', 'dinamic_list']
    const isValid = updates.every((update) => allows.includes(update))
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})
// pass name, email and password (optional)
router.patch('/users/me/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allows = ['static_list', 'dinamic_list']
    const isValid = updates.every((update) => allows.includes(update))
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// pass user.id at params
router.delete('/users/:id', allowed, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.delete('/users/me/remove', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
module.exports = router