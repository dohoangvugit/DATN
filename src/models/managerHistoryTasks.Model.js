const supabase = require('../config/db')

const managerHistoryTasks = {

    createdLog: async(actor, action, taskId, taskTitle, changes) =>{
        const { data, error } = await supabase
            .from('admin_task_logs')
            .insert([
                {
                    actor,
                    action,
                    task_id: taskId,
                    task_title: taskTitle,
                    changes 
                }
            ])
            .select()

            if(error || !data){
                console.error('error: ', error)
                // throw error
            }

        return {data, error}
    }
}

module.exports = managerHistoryTasks