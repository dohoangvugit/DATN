const supabase = require('../config/db')

const taskLogModel = {

    createLog: async (taskId, userId) => {
        const { data, error } = await supabase
            .from('task_logs')
            .insert([
                { 
                    task_id: taskId,
                    user_id: userId
                }
            ])
            .select()

        if (error) {
            console.error('ghi log thất bại', error.message)
            // throw error
        }

        return {data, error}
    },

    getLogsSince: async (userId, since) => {
        const { data, error } = await supabase
            .from('task_logs')
            .select('task_id')
            .eq('user_id', userId)
            .gte('create_at', since)

        if (error) {
            console.error('lấy danh sách log thất bại', error.message)
        }

        return {data, error}
    }
}

module.exports = taskLogModel

// taskLogModel.createLog(6, 14)
//     .then(result => {
//         console.log('Kết quả:', result)
//     })
//     .catch(error => {
//         console.log('Lỗi:', error)
//     })
// taskLogModel.get10LatestLogbyUser(5)
//     .then(result => {
//         console.log('Kết quả:', result)
//     })
//     .catch(error => {
//         console.log('Lỗi:', error)
//     })
