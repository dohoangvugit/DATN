const authRoute = require('../routes/authRoute')
const taskRoute = require('../routes/taskRoute')
const userRoute = require('../routes/userRoute')
const missionRewardRoute = require('../routes/missionRewardRoute')
const homeRoute = require('../routes/homeRoute')
const clientRoute = require('../routes/clientRoute')

function route(app){
    
    app.use('/', authRoute)
    app.use('/', taskRoute)
    app.use('/', userRoute)
    app.use('/', missionRewardRoute)
    app.use('/', homeRoute)
    app.use('/', clientRoute)

}

module.exports = route