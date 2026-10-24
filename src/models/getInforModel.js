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
            console.error('error: không tìm thấy người dùng ', error)
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
    },

    getAdBalance: async (authId)=>{
        const {data, error} = await supabase
            .from('users')
            .select('ad_balance')
            .eq('auth_user_id', authId)
            .single()

        if(error || !data){
            console.log('Không tìm thấy dữ liệu')
            throw error
        }
        
        return { data, error }
    }
}

module.exports = getInforModel