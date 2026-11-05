const supabase = require('../config/db')

const rewardModel = {

    addBalance: async (userId, reward) => {
        const { data, error } = await supabase
            .from('users')
            .select('balance')
            .eq('id', userId)
            .single()

        if(error || !data){
            return {updateData: null, updateError: error}
        }

        const newBalance = Number(data.balance) + Number(reward)

        const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', userId)
            .select()

        // console.log('cộng phần thưởng thành công', data)
        return {updateData, newBalance, updateError}
    },

}

module.exports = rewardModel


// rewardModel.addBalance(50, 0.0001 )
// .then(result => {
//     console.log('Kết quả:', result)
// })
// .catch(error => {
//     console.log('Lỗi:', error)
// })