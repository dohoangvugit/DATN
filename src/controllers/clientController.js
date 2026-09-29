const {get} = require('../models/taskModel')
const {getUsername, getBalance} = require('../models/getInforModel')
const clientController = {

    listTasks: async (req, res) =>{
        try{


            const {data: tasks, error: errorTasks} = await get()

            if(errorTasks){
                return res.status(400).json({
                    message: 'lấy PTC thất bại',
                    error: error.message
                })
            }


            const {data: username, error: errorUsername} = await getUsername(req.user.id)

            if(errorUsername){
                return res.status(400).json({
                    message: 'lấy username thất bại',
                    error: error.message
                })
            }

            const {data: balance, error: errorBalance} = await getBalance(req.user.id)

            if(errorBalance){
                return res.status(400).json({
                    message: 'lấy balance thất bại',
                    error: error.message
                })
            }

            return res.render('client', {
                tasks,
                username,
                balance
            })


        }catch(error){
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = clientController