const supabase = require('../config/db')

const managerHistoryUsers = {

    createdLog: async(actor, action, userId, username, changes) =>{
        const { data, error } = await supabase
            .from('admin_user_logs')
            .insert([
                {
                    actor,
                    action,
                    target_user_id: userId,
                    target_username: username,
                    changes 
                }
            ])
            .select()

            if(error || !data){
                console.error('error: ', error)
                // throw error
            }

        return {data, error}
    },

    getAllUserLogs: async() =>{
        const { data, error } = await supabase
            .from('admin_user_logs')
            .select('*')

        if(error || !data){
            console.error('error: ', error)
            // throw error
        }

        return {data, error}
    }
}

module.exports = managerHistoryUsers