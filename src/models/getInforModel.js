const supabase = require('../config/db')

const getInforModel = {

    getUsername: async (authId) => {
        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('auth_user_id', authId)
            .single()

        if(error || !data){
            console.error('error: ', error)
            // throw error
        }

        return {data, error}
    },

    getRole: async (authId) => {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('auth_user_id', authId)
            .single()

        if(error || !data){
            console.error('error: ', error)
            // throw error
        }

        return {data, error}
    },

    getBalance: async (authId) => {
        const { data, error } = await supabase
            .from('users')
            .select('balance')
            .eq('auth_user_id', authId)
            .single()

        if(error || !data){
            console.error('error: ', error)
            // throw error
        }

        return {data, error}
    }
}

module.exports = getInforModel