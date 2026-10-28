const {getAllUserLogs} = require('../models/managerHistoryUserModel')

const managerHistoryUserController = {

    getAllUserLogs: async(req,res) =>{
        try{
            const {data: logs, error: errorLogs} = await getAllUserLogs()

            if(errorLogs){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorLogs.message
                })
            }

            return res.render('historyUser',{
                logs
            })

        }catch(error){
            console.error('Lỗi lấy lịch sử người dùng:',error)
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = managerHistoryUserController