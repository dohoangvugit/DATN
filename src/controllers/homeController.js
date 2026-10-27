const statisticModel = require('../models/statisticModel')

const homeController = {
    async index (req, res){
        const { data: count, error } = await statisticModel.totalUser()
        // console.log(count, typeof count)
        res.render('main',{
            count
        })
    },
}

module.exports = homeController
