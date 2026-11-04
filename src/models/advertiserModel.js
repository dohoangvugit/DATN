const supabase = require('../config/db')

const advertiserModel = {
    getRoles: async (authId) => {
        const { data, error } = await supabase
            .from('users')
            .select('roles')
            .eq('auth_user_id', authId)
            .single()

        return { data, error }
    },

    updateRoles: async (authId, roles) => {
        const { data, error } = await supabase
            .from('users')
            .update({ roles })
            .eq('auth_user_id', authId)
            .select('roles')
            .single()

        return { data, error }
    },

    getUserByAuthId: async (authId) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, ad_balance')
            .eq('auth_user_id', authId)
            .maybeSingle()

        return { data, error }
    },

    updateAdBalance: async (authId, newBalance) => {
        const { data, error } = await supabase
            .from('users')
            .update({ ad_balance: newBalance })
            .eq('auth_user_id', authId)
            .select()
            .single()

        return { data, error }
    },

    createTask: async (task) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                title: task.title,
                description: task.description,
                url: task.url,
                reward: task.reward,
                quantity: task.quantity,
                created_by: task.created_by
            }])
            .select()
            .single()

        return { data, error }
    },

    createDeposit: async (deposit) => {
        const { data, error } = await supabase
            .from('deposits')
            .insert([
                {
                    user_uuid: deposit.user_uuid,
                    amount: deposit.amount,
                    currency: deposit.currency,
                    tx_hash: deposit.tx_hash
                }
            ])
            .select()
            .single()

        if (error) {
            console.log('lỗi khi tạo bản ghi nạp tiền')
            // throw error
        }

        return { data, error }
    },

    findHash: async (tx_hash) => {
        const { data, error } = await supabase
            .from('deposits')
            .select('tx_hash')
            .eq('tx_hash', tx_hash)
            .maybeSingle()

        if (error) {
            console.log('lỗi khi tìm kiếm hash')
            // throw error
        }

        return { data, error }
    },

    addAdBalance: async (authId, amount) => {
        const { data: dataAdBalance, error: errorAdBalance } = await supabase
            .from('users')
            .select('ad_balance')
            .eq('auth_user_id', authId)
            .single()

        const adBalance = dataAdBalance.ad_balance + amount

        const { data, error } = await supabase
            .from('users')
            .update({ ad_balance: adBalance })
            .eq('auth_user_id', authId)
            .select()
        if (error) {
            console.log('lỗi khi cập nhật số dư quảng cáo', error)
            // throw error
        }

        return { data, error }
    },
}

module.exports = advertiserModel

// advertiserModel.getInfor(16).then((result) => {
//     console.log('result: ', result)
//     return result
// }).catch(
//     (error) => {
//         console.log('error: ', error)
//         return error
//     }   
// )
