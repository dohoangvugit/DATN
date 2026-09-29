const userModel = require('../models/userModel')
const supabase = require('../config/db')

const userController = {

    updateUserRole: async (req,res) =>{
        try{
            const id = req.params.id
            const updateRole = req.body.role
            const {data, error} = await userModel.updateUserRole(id, updateRole)

            if (error){
                res.status(400).json({
                    message: 'lỗi update user role',
                    error: error.message
                })
            }else{
                res.status(200).json({
                    message: 'update user role success',
                    role: data
                })
            }

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    getAllUsers: async (req,res) =>{
        try{
            const {data, error} = await userModel.getAllUsers()

            if(error){
                res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: error.message
                })
            }else{
                res.render('adminManagerUsers', {
                    people: data
                })
            }

        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    deleteUser: async (req,res) =>{
        try{
            const id = req.params.id
            const role = req.user.role
            
            if (role !== 'Admin' && role !== 'Superadmin') {
                return res.status(403).json({
                    message: 'Chỉ Admin hoặc Superadmin mới có quyền này',
                    error: 'Không có quyền xóa user'
                })
            }

            const { data: user, error: getUserError } = await supabase
            .from('users')
            .select('role')
            .eq('id', id)
            .single()

            if (getUserError) {
                return res.status(400).json({
                    message: 'Không tìm thấy user',
                    error: getUserError.message
                })
            }

            if (role === 'Admin' && user.role === 'Superadmin') {
                return res.status(403).json({
                    message: 'Admin không được xóa Superadmin',
                    error: 'Không có quyền xóa Superadmin'
                })
            }
            
            const {data, error} = await userModel.delete(id)

            if(error){
                res.status(400).json({
                    message: 'xóa thất bại',
                    error: error.message
                })
            }else{
                res.status(200).json(data)
            }
        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = userController