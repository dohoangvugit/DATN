const supabase = require('../config/db')

const userModel = {

    getUserById: async (id) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, email, role, balance, ad_balance')
            .eq('id', id)
            .single()

        if (error) {
            console.error('không tìm thấy người dùng', error.message)
        }

        return {data, error}
    },

    updateUserRole: async (id, role) => {
        const { data, error } =  await supabase
            .from('users')
            .update({ role })
            .eq('id', id)
            .select()
            .single()
        if (error) {
            console.error('cập nhật thất bại', error.message)
            // throw error
        }
        return {data, error}
    },

    delete: async (id) =>{

        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select()
            .single()

            if(error){
                console.log( 'xóa thất bại')
                // throw error
            }

            // console.log('xóa thành công', data)
            return {data, error}
    },

    getAllUsers: async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')

            if (error){
                console.log('lấy danh sách thất bại')
                // throw error
            }

            // console.log('lấy danh sách thành công', data)
            return {data, error}
    }
}

module.exports = userModel
// userModel.delete(4)
// userModel.updateUserRole('Admin', 4)
// userModel.getAllUsers()
// .then(result => {
//     console.log('Kết quả:', result)
// })
// .catch(error => {
//     console.log('Lỗi:', error)})