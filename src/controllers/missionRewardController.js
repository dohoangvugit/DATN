const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const taskLogModel = require('../models/taskLogModel')
const rewardModel = require('../models/rewardModel')


const missionRewardController = {

    startMission: async(req,res) =>{
        try{
            const taskId = req.params.taskId
            const authUserId  = req.user.id

            const {data: users, error: errorGetUsers} = await userModel.getAllUsers()

            if(errorGetUsers){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorGetUsers.message
                })
            }

            const user = users.find(user => user.auth_user_id == authUserId)

            if(!user){
                return res.status(400).json({
                    message: 'Không tìm thấy user',
                    error: 'Không tìm thấy user'
                })
            }

            const {data: tasks, error: errorGetTasks} = await taskModel.get()

            if(errorGetTasks){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorGetTasks.message
                })
            }

            const task = tasks.find(task => task.id == taskId)

            if(!task){
                return res.status(400).json({
                    message: 'Không tìm thấy task',
                    error: 'Không tìm thấy task'
                })
            }

            req.session.missions = req.session.missions || {}
            req.session.missions[taskId] = {
                startTime: Date.now()
            }

            return res.status(200).json({
                message: 'bắt đầu đếm ngược',
                task: task,
            })

        }catch(error){
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    claimReward: async(req,res) =>{
        try{
            
            const taskId = req.params.taskId
            const authUserId  = req.user.id

            const {data: users, error: errorGetUsers} = await userModel.getAllUsers()

            if(errorGetUsers){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorGetUsers.message
                })
            }

            const user = users.find(user => user.auth_user_id == authUserId)

            if(!user){
                return res.status(400).json({
                    message: 'Không tìm thấy user',
                    error: 'Không tìm thấy user'
                })
            }

            const userId = user.id

            const {data: tasks, error: errorGetTasks} = await taskModel.get()

            if(errorGetTasks){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: errorGetTasks.message
                })
            }

            const task = tasks.find(task => task.id == taskId)

            if(!task){
                return res.status(400).json({
                    message: 'Không tìm thấy task',
                    error: 'Không tìm thấy task'
                })
            }

            const mission = req.session.missions?.[taskId]

            if(!mission){
                return res.status(400).json({
                    message: 'chưa bắt đầu',
                    error: 'chưa bắt đầu làm để claim'
                })
            }
            const now = Date.now()
            const requiredTime =  task.cooldown * 1000

            if(now - mission.startTime < requiredTime){
                return res.status(400).json({
                    message: 'chưa đếm đủ thời gian',
                    error: 'chưa xem đủ thời gian yêu cầu'
                })
            }

            const {data, error} = await taskLogModel.createLog(taskId, userId)
            
            if(error){
                return res.status(400).json({
                    message: 'ghi log thất bại',
                    error: error.message
                })
            }
            delete req.session.missions[taskId]

            const {updateData, updateError} = await rewardModel.addBalance(userId, task.reward)

            if(updateError){
                return res.status(400).json({
                    message: 'cộng phần thưởng thất bại',
                    error: updateError.message
                })
            }
            console.log(authUserId, userId)
            return res.status(200).json({
                message: 'Claim thành công',
                task: task
            })

        } catch(error){
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = missionRewardController
