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
            .single()

        if (error) {
            console.error('thêm thất bại', error.message)
            // throw error
        }
        // console.log('thêm thành công', data)
        return {data, error}
    },

    get: async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')

        if (error) {
            console.error('lấy thất bại', error.message)
            // throw error
        }
        return {data, error}
    },

    getById: async (taskId) => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single()

        if (error) {
            console.error('không tìm thấy task', error.message)
        }
        return {data, error}
    },

    decreaseQuantity: async (taskId) => {
        for (let attempt = 0; attempt < 5; attempt++) {
            const { data: task, error: getError } = await supabase
                .from('tasks')
                .select('quantity')
                .eq('id', taskId)
                .single()

            if (getError) {
                return { data: null, error: getError }
            }

            const quantity = Number(task.quantity)
            if (!Number.isFinite(quantity) || quantity <= 0) {
                return { data: null, error: new Error('Nhiệm vụ đã hết lượt') }
            }

            const { data, error } = await supabase
                .from('tasks')
                .update({ quantity: quantity - 1 })
                .eq('id', taskId)
                .eq('quantity', task.quantity)
                .select('quantity')
                .maybeSingle()

            if (error) {
                return { data: null, error }
            }

            if (data) {
                return { data, error: null }
            }
        }

        return {
            data: null,
            error: new Error('Không thể cập nhật số lượt, vui lòng thử lại')
        }
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
            .single()
        
        if (error) {
            console.error('cập nhật thất bại', error.message)
            // throw error
        }
        // console.log('cập nhật thành công', data)
        return {data, error}
    },

    delete: async (taskId) => {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .select()

        if (error) {
            console.error('xóa thất bại', error.message)
            // throw error
        }
        // console.log('xóa thành công', data)
        return {data, error}
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