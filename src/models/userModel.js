const supabase = require('../config/db')

const userModel = {

    updateUserRole: async (role, id) => {
        const { data, error } =  await supabase
            .from('users')
            .update({ role })
            .eq('id', id)
            .select()
        if (error) {
            console.error('cập nhật thất bại', error.message)
            throw error
        }
        // console.log('cập nhật thành công', data)
        return data
    },

    delete: async (id) =>{

        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select()

            if(error){_
                console.log( 'xóa thất bại')
                throw error
            }

            console.log('xóa thành công', data)
    },

    getAllUsers: async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')

            if (error){
                console.log('lấy danh sách thất bại')
                throw error
            }

            // console.log('lấy danh sách thành công', data)
            return data
    }
}

module.exports = userModel
// userModel.delete(4)
// userModel.updateUserRole('Admin', 4)
// userModel.getAllUsers()