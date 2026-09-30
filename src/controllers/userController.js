const userModel = require('../models/userModel')
const {createdLog} = require('../models/managerHistoryUserModel')
const userController = {

    updateUserRole: async (req,res) =>{
        try{
            const actor = req.user.email
            const id = req.params.id
            const updateRole = req.body.role
            const {data, error} = await userModel.updateUserRole(id, updateRole)

            if (error){
                return res.status(400).json({
                    message: 'lỗi update user role',
                    error: error.message
                })
            }

            const changes = {
                new:{
                    role: updateRole
                }
            }

            const {data: dataUpdateUserRole, error: errorUpdateUserRole} = await createdLog(
                actor,
                'Sửa',
                data.id,
                data.username,
                changes
            )

            if(errorUpdateUserRole){
                return res.status(400).json({
                    message: 'thêm vào log thất bại',
                    error: errorUpdateUserRole.message
                })
            }

            res.status(200).json({
                    message: 'update user role success',
                    dataUpdateUserRole,
                    errorUpdateUserRole
                })
        

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
            const actor = req.user.email
            const id = req.params.id
            const role = req.user.role
            
            if (role !== 'Admin' && role !== 'Superadmin') {
                return res.status(403).json({
                    message: 'Chỉ Admin hoặc Superadmin mới có quyền này',
                    error: 'Không có quyền xóa user'
                })
            }

            const {data: userAll, error: errorGetAllUser} = await userModel.getAllUsers()

            if(errorGetAllUser){
                return res.status(400).json({
                    message: 'không tìm thấy user',
                    error: errorGetAllUser.message
                })
            }

            const user = userAll.find(user => user.id == id)


            if (role === 'Admin' && user.role === 'Superadmin') {
                return res.status(403).json({
                    message: 'Admin không được xóa Superadmin',
                    error: 'Không có quyền xóa Superadmin'
                })
            }

            const changes = {
                old: {
                    username: user.username,
                    email: user.email,
                    balance: user.balance,
                    role: user.role,
                }
            }

            const {data, error} = await userModel.delete(id)

            if(error){
                return res.status(400).json({
                    message: 'xóa user thất bại',
                    error: error.message
                })
            }

            const {data: dataDeleteLogs, error: errorDeleteLogs} = await createdLog(
                actor,
                'Xóa',
                data.id,
                data.username,
                changes
            )

            if(errorDeleteLogs){
                return res.status(400).json({
                    message: 'thêm vào log thất bại',
                    error: errorDeleteLogs.message
                })
            }

            res.status(200).json({
                message: 'xóa user thành công',
                dataDeleteLogs,
                data
            })


        }catch(error){
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = userController