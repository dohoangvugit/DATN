const supabase = require('../config/db')

const updateBalanceModel = {
    updateBalance: async (authUserId, newBalance) => {
        const { data, error } = await supabase
            .from('users')
            .update({balance: newBalance})
            .eq('auth_user_id', authUserId)
            .select()
            .single()

        if(error || !data){
            console.error('error: ', error)
            // throw error
        }

        return {data, error}
    }
}

module.exports = updateBalanceModel