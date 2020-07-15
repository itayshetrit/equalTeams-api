const experss = require('express')
require('./db/mongoose')
const cors = require('cors')

const userRouter = require('./routers/user')
const turnRouter = require('./routers/turn')
const app = experss()
const port = process.env.PORT || 8000
app.use(cors())
app.use(experss.json())
app.use(userRouter)
app.use(turnRouter)




app.listen(port, () => {
    console.log("server is app on port: " + port)
})