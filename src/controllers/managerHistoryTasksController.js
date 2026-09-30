const {getAllTaskLogs} = require('../models/managerHistoryTasksModel')

const managerHistoryTasksController = {

    getAllTaskLogs: async(req,res) =>{
        try{
            const {data: logs, error: errorLogs} = await getAllTaskLogs()

            if(errorLogs){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorLogs.message
                })
            }

            res.render('historyTask',{
                logs
            })

        }catch(error){
            console.error('có lỗi',error)
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = managerHistoryTasksController