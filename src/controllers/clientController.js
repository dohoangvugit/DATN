const {get} = require('../models/taskModel')
const {getUsername, getBalance} = require('../models/getInforModel')
const userModel = require('../models/userModel')
const taskLogModel = require('../models/taskLogModel')
const clientController = {

    listTasks: async (req, res) =>{
        try{

            const {data: tasks, error: errorTasks} = await get()

            if(errorTasks){
                return res.status(400).json({
                    message: 'lấy PTC thất bại',
                    error: errorTasks.message
                })
            }

            const {data: user, error: errorUser} = await userModel.getUserByAuthId(req.user.id)

            if(errorUser){
                return res.status(400).json({
                    message: 'lấy user thất bại',
                    error: errorUser.message
                })
            }

            const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const {data: logs, error: errorLogs} = await taskLogModel.getLogsSince(user.id, since)

            if(errorLogs){
                return res.status(400).json({
                    message: 'lấy lịch sử PTC thất bại',
                    error: errorLogs.message
                })
            }

            const viewedTaskIds = logs.map(log => log.task_id)
            const availableTasks = tasks.filter(task =>
                task.quantity !== 0 && !viewedTaskIds.includes(task.id)
            )

            const {data: username, error: errorUsername} = await getUsername(req.user.id)

            if(errorUsername){
                return res.status(400).json({
                    message: 'lấy username thất bại',
                    error: errorUsername.message
                })
            }

            const {data: balance, error: errorBalance} = await getBalance(req.user.id)

            if(errorBalance){
                return res.status(400).json({
                    message: 'lấy balance thất bại',
                    error: errorBalance.message
                })
            }

            return res.render('client', {
                tasks: availableTasks,
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