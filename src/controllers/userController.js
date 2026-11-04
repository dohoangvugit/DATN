const userModel = require('../models/userModel')
const {createdLog} = require('../models/managerHistoryUserModel')
const userController = {

    updateUserRoles: async (req,res) =>{
        try{
            const actor = req.user.email
            const id = req.params.id
            const allowedRoles = ['Viewer', 'Advertiser', 'Admin', 'Superadmin']

            if (!Array.isArray(req.body.roles) ||
                req.body.roles.length === 0 ||
                req.body.roles.some(role => !allowedRoles.includes(role))) {
                return res.status(400).json({
                    message: 'Vui lòng chọn ít nhất một role hợp lệ'
                })
            }

            const roles = req.body.roles
            const {data: currentUser, error: errorCurrentUser} = await userModel.getUserById(id)

            if(errorCurrentUser || !currentUser){
                return res.status(404).json({
                    message: 'không tìm thấy user',
                    error: errorCurrentUser?.message
                })
            }

            const {data, error} = await userModel.updateUserRoles(id, roles)

            if (error){
                return res.status(400).json({
                    message: 'lỗi cập nhật roles',
                    error: error.message
                })
            }

            const changes = {
                old: {
                    username: currentUser.username,
                    email: currentUser.email,
                    roles: currentUser.roles,
                    balance: currentUser.balance,
                    ad_balance: currentUser.ad_balance
                },
                new: {
                    username: data.username,
                    email: data.email,
                    roles: data.roles,
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
                message: 'Cập nhật roles thành công',
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
                const allowedRoles = ['Viewer', 'Advertiser', 'Admin', 'Superadmin']
                const people = data.map(user => {
                    const roles = Array.isArray(user.roles) ? user.roles : []

                    return {
                        ...user,
                        rolesLabel: roles.join(', '),
                        roleOptions: allowedRoles.map(role => ({
                            value: role,
                            selected: roles.includes(role)
                        }))
                    }
                })

                return res.render('adminManagerUsers', {
                    people,
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

            if (role === 'Admin' && Array.isArray(user.roles) && user.roles.includes('Superadmin')) {
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
                    roles: user.roles,
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