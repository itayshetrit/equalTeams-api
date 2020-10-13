const experss = require('express')
require('./db/mongoose')
const cors = require('cors')

const usersRouter = require('./routes/users/index.js')
const guestRouter = require('./routes/guests/index.js')
const tablesRouter = require('./routes/tables/index.js')

const app = experss()
const port = process.env.PORT || 8000
app.use(cors())
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://be-simple-api.herokuapp.com/");
    next();
});
app.use(experss.json())
app.use(usersRouter)
app.use(guestRouter)
app.use(tablesRouter)




app.listen(port, () => {
    console.log("server is app on port: " + port)
})