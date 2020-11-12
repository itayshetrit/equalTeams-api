const experss = require('express')
require('./db/mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth/index.js')
const managerRouter = require('./routes/manager/index.js')
const playersRouter = require('./routes/players/index.js')
const electionsRouter = require('./routes/elections/index.js')

const app = experss()

var corsOptions = {
    origin: 'https://be-simple-2.web.app',
    optionSuccessStatus: 200
}
const port = process.env.PORT || 8000
// app.use(cors(corsOptions))
app.use(cors())
// app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "https://be-simple-api.herokuapp.com/");
//     next();
// });
app.use(experss.json())
app.use(authRouter)
app.use(managerRouter)
app.use(playersRouter)
app.use(electionsRouter)




app.listen(port, () => {
    console.log("server is app on port: " + port)
})