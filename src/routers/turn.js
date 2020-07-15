const experss = require('express')
const Turn = require('../models/turn')
const auth = require('../middleware/auth')
const allowed = require('../middleware/allowed')
const router = new experss.Router()
// pass date and hour at body
router.post('/turns', auth, async (req, res) => {
    const isExist = await Turn.findOne({date: req.body.date,time: req.body.time}) // avoid duplicates
    const turn = new Turn({...req.body, name:'',phone:''})
    if(isExist){
        return res.status(409).send('allready exist') // 409 is "conflict" by httpstatuses.com - is it ok?
    }
    try {
        await turn.save()
        res.status(201).send(turn)
    } catch (err) {
        res.status(400).send(err.message)
    }
})
// option to search by types

// pass at query
// pass (optional) date,time,name, limit= result per page, page= num of page,
// showtime=xxx return only hour, showname=xxx return only name , both => both, nothing => all data
// sort by hour at asc
router.get('/turns', auth, async (req, res) => {
    try {
        const turns = await Turn.find(req.query)        
        .select(['time','name','phone']) // shown by choise, default for all
        .limit(parseInt(req.query.limit)) // results per page
        .skip(parseInt(req.query.limit) * parseInt(req.query.page)) // second arg mean to num of page (start at 0)
        .sort({
            time: 'asc' // or desc
        })
        res.send(turns)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// user reserve empty turn only and can't hold more then 1 turn, pass turn.id at params
router.patch('/turns/:id', auth, async (req, res) => {
    const empty = await Turn.findById(req.params.id)
    if (empty.name!==''){
        return res.status(400).send({error: 'you rogue'})
    }
    const updates = Object.keys(req.body)
    // const allows = ['time', 'date', 'name']
    const allows = ['name','phone'] // are allowed to update
    const isValid = updates.every((update) => allows.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid updates'})
    }


    // First Option is here:
    // const isExist = await Turn.findOne({name: req.body.name}) // avoid duplicates
    // if(isExist){
    //     return res.status(409).send('there is no option to hold 2 queues') // 409 is "conflict" by httpstatuses.com - is it ok?
    // }

    //Second Option is at the Model
        const isExist = await Turn.findDuplicate(req.user.name)
        if(isExist !== null){
            return res.status(409).send(isExist)
        }


    try {
        const turn = await Turn.findByIdAndUpdate(req.params.id,{name: req.user.name, phone: req.user.phone }, {new: true, runValidators: true})
        if (!turn) {
            return res.status(404).send()// does not work, return 400 instead 404 - ask Igor
        }
        res.send(turn)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get('/turns/me', auth, async (req, res) => {
    try {
        const isExist = await Turn.findOne({ name: req.user.name })
        if (!isExist) {
            return res.status(404).send({error: 'no turns'})
        }
        res.send(isExist)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// Unnecessary

// router.get('/turns/:id', auth, async (req, res) => {
//     try {
//         const turn = await Turn.findById(req.params.id)
//         if (!turn) {
//             return res.status(404).send()
//         }
//         res.send(turn)
//     } catch (err) {
//         res.status(500).send(err.message)
//     }
// })


router.patch('/turns/delete/me', auth, async (req, res) => {
    try {
        const turn = await Turn.findOne({ name: req.user.name })
        // const turn = await Turn.findOneAndUpdate(req.params.id,{name: ''}, {new: true, runValidators: true})
        if (!turn) {
            return res.status(404).send()
        }
        turn.name=''
        turn.phone=''
        await turn.save()
        res.send(turn)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// pass turn.id at params
router.delete('/turns/:id', allowed, async (req, res) => {
    try {
        const turn = await Turn.findByIdAndDelete(req.params.id)
        if (!turn) {
            return res.status(404).send()
        }
        res.send(turn)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// pass day at query
router.delete('/turns/delete/day', auth, async (req, res) => {
    try {
        await Turn.deleteMany({date:req.query.date})
        res.status(200).send("success")
    } catch (err) {
        res.status(500).send(err.message)
    }
})
module.exports = router