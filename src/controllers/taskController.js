const taskModel = require('../models/taskModel')
const {createdLog} = require('../models/managerHistoryTasksModel')

const taskController = {

    getAllTasks: async(req,res) =>{

        try{
            const {data: tasks, error: errorTasks} = await taskModel.get()

            if(errorTasks){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: error.message
                })
            }
            res.render('adminManagerTasks', {
                tasks
            })
        }catch(error){
            console.error('có lỗi',error)
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    createTask: async(req,res) =>{
        try{
            // console.log('Thông tin req.user là:', req.user)
            const {title,description,reward,cooldown,url} = req.body
            const actor = req.user.email
            const {data: dataCreateTask,error: errorCreateTask} = await taskModel.create(
                {
                    title,
                    description,
                    reward,
                    cooldown,url
                })

            if(errorCreateTask){
                return res.status(400).json({
                    message: 'thêm thất bại',
                    error: errorCreateTask.message
                })
            }

            const changes = {
                new: {
                    title,
                    description,
                    reward,
                    cooldown,
                    url
                }
            }

            const {data: dataCreatedLog,error: errorCreatedLog} = await createdLog(
                actor,
                'Thêm',
                dataCreateTask.id, 
                dataCreateTask.title, 
                changes
            )

            if(errorCreatedLog){
                return res.status(400).json({
                    message: 'thêm vào log thất bại',
                    error: errorCreatedLog.message
                })
            }

            res.status(200).json({
                message: 'thêm task và log thành công',
                dataCreateTask,
                dataCreatedLog
            })

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    updateTask: async(req,res) =>{
        try{
            const actor = req.user.email

            const taskId = req.params.taskId
            const {title,description,reward,cooldown,url} = req.body

            const {data: dataUpdateTask,error: errorUpdateTask} = await taskModel.update(taskId,{title,description,reward,cooldown,url})

            if(errorUpdateTask){
                return res.status(400).json({
                    message: 'cập nhật thất bại',
                    error: errorUpdateTask.message
                })
            }

            const changes = {
                new: {
                    title,
                    description,
                    reward,
                    cooldown,
                    url
                }
            }     
            
            const {data: dataCreatedLog,error: errorCreatedLog} = await createdLog(
                actor,
                'Sửa',
                dataUpdateTask.id, 
                dataUpdateTask.title, 
                changes
            )

            if(errorCreatedLog){
                return res.status(400).json({
                    message: 'thêm vào log thất bại',
                    error: errorCreatedLog.message
                })
            }    

            res.status(200).json({
                message: 'cập nhật task và log thành công',
                dataUpdateTask,
                dataCreatedLog
            })

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    deleteTask: async(req, res) =>{
        try{

            const actor = req.user.email

            const taskId = req.params.taskId
            console.log(typeof taskId)

            const {data: taskAll,error: errorTask} = await taskModel.get()
            const task = taskAll.find(task => task.id == taskId)

            if(errorTask){
                return res.status(400).json({
                    message: 'không tìm thấy task',
                    error: errorTask.message
                })
            }

            const changes = {
                old: {
                    title: task.title,
                    description: task.description,
                    reward: task.reward,
                    cooldown: task.cooldown,
                    url: task.url
                }
            }

            const {data: dataDeleteTask,error: errorDeleteTask} = await taskModel.delete(taskId)

            if(errorDeleteTask){
                return res.status(400).json({
                    message: 'xóa task thất bại',
                    error: errorDeleteTask.message
                })
            }

            const {data: dataCreatedLog,error: errorCreatedLog} = await createdLog(
                    actor,
                    'Xóa',
                    task.id,
                    task.title,
                    changes
                )

            if(errorCreatedLog){
                return res.status(400).json({
                    message: 'thêm vào log thất bại',
                    error: errorCreatedLog.message
                })
            }

            res.status(200).json({
                message: 'xóa task và log thành công',
                dataDeleteTask,
                dataCreatedLog
            })

        }catch(error){

            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }

}

module.exports = taskController
