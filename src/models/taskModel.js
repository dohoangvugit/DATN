const supabase = require('../config/db')

const taskModel = {

    create: async (taskData) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                { 
                    title: taskData.title,
                    description: taskData.description,
                    reward: taskData.reward,
                    cooldown: taskData.cooldown,
                    url: taskData.url
                }
            ])
            .select()

        if (error) {
            console.error('thêm thất bại', error.message)
            throw error
        }
        console.log('thêm thành công', data)
        return data
    },

    get: async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')

        if (error) {
            console.error('lấy thất bại', error.message)
            throw error
        }
        console.log('lấy thành công', data)
        return data
    },
    
    update: async (taskId, taskData) => {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                title: taskData.title,
                description: taskData.description,
                reward: taskData.reward,
                cooldown: taskData.cooldown,
                url: taskData.url
            })
            .eq('id', taskId)
            .select()
        
        if (error) {
            console.error('cập nhật thất bại', error.message)
            throw error
        }
        console.log('cập nhật thành công', data)
        return data
    },

    delete: async (taskId) => {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .select()

        if (error) {
            console.error('xóa thất bại', error.message)
            throw error
        }
        console.log('xóa thành công', data)
        return data
    }
}

module.exports = taskModel

// taskModel.create({'title': 'testTitle2', 'description': 'testDescription', 'reward': 0.001, 'cooldown': 20, 'url': 'testUrl'})
// taskModel.get()
// taskModel.update(5, 
//     {'title': 'testTitleUpdate',
//      'description': 'testDescriptionUpdate',
//     'reward': 0.5, 'cooldown': 50,
//     'url': 'testUrlUpdate'})
// taskModel.delete(5)