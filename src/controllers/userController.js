const userModel = require('../models/userModel')
const {createdLog} = require('../models/managerHistoryUserModel')
const userController = {

    updateUserRole: async (req,res) =>{
        try{
            const actor = req.user.email
            const id = req.params.id
            const updateRole = req.body.role
            const allowedRoles = ['Viewer', 'Advertiser', 'Admin', 'Superadmin']
            
            const {data, error} = await userModel.updateUserRole(id, updateRole)

            if (error){
                return res.status(400).json({
                    message: 'lỗi update user role',
                    error: error.message
                })
            }

            const changes = {
                old: {
                    username: currentUser.username,
                    email: currentUser.email,
                    role: currentUser.role,
                    balance: currentUser.balance,
                    ad_balance: currentUser.ad_balance
                },
                new: {
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    balance: data.balance,
                    ad_balance: data.ad_balance
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

            return res.status(200).json({
                message: 'Cập nhật vai trò thành công',
                data: dataUpdateUserRole
            })
        

        }catch(error){
            console.error('Lỗi cập nhật vai trò người dùng:', error)
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },

    getAllUsers: async (req,res) =>{
        try{
            const {data, error} = await userModel.getAllUsers()

            if(error){
                return res.status(400).json({
                    message: 'lấy danh sách thất bại',
                    error: error.message
                })
            }else{
                return res.render('adminManagerUsers', {
                    people: data,
                    isSuperadmin: req.user.role === 'Superadmin'
                })
            }

        }catch(error){
            console.error('Lỗi lấy danh sách người dùng:', error)
            return res.status(500).json({
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

            const {data: user, error: errorGetUser} = await userModel.getUserById(id)

            if(errorGetUser || !user){
                return res.status(404).json({
                    message: 'không tìm thấy user',
                    error: errorGetUser?.message
                })
            }

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
                    ad_balance: user.ad_balance,
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

            return res.status(200).json({
                message: 'xóa user thành công',
                data: dataDeleteLogs,
                deletedUser: data
            })


        }catch(error){
            console.error('Lỗi xóa người dùng:', error)
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = userController