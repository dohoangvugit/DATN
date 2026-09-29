const taskModel = require('../models/taskModel')

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
            const {title,description,reward,cooldown,url} = req.body
            const newTask = await taskModel.create({title,description,reward,cooldown,url})

            res.status(201).json(newTask)

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    updateTask: async(req,res) =>{
        try{
            const taskId = req.params.taskId
            const {title,description,reward,cooldown,url} = req.body
            const updatedTask = await taskModel.update(taskId,{title,description,reward,cooldown,url})

            res.status(201).json(updatedTask)

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    deleteTask: async(req,res) =>{
        try{
            const taskId = req.params.taskId
            const deletedTask = await taskModel.delete(taskId)

            res.status(200).json(deletedTask)

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

}

module.exports = taskController
