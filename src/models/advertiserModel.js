const supabase = require('../config/db')

const advertiserModel = {
    createDeposit: async (deposit) => {
        const { data, error } = await supabase
            .from('deposits')
            .insert([
                {
                    user_id: deposit.user_id,
                    amount: deposit.amount,
                    currency: deposit.currency,
                    status: deposit.status,
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

    addAdBalance: async (id, amount) => {
        const { data: dataAdBalance, error: errorAdBalance } = await supabase
            .from('users')
            .select('ad_balance')
            .eq('id', id)
            .single()

        const { data, error } = await supabase
            .from('users')
            .update({ ad_balance: dataAdBalance.ad_balance + amount })
            .eq('id', id)
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
