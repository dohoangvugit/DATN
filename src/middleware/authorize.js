const supabase = require('../config/db')

const getRole = async (authUserId) => {
    const { data , error } = await supabase
        .from('users')
        .select('role')
        .eq('auth_user_id', authUserId)
        .single()

    if(error || !data) {
        console.log(' không tìm thấy user')
        throw error
    }

    return data.role
}

const authorize ={

    admin: async(req , res , next)=>{
        try{
            const role = await getRole(req.user.id)

            if (role !== 'Admin' && role !== 'Superadmin') {
                return res.status(403).json({message: 'chỉ admin mới có quyền này'})
            }
            console.log('chào admin')
            req.user.role = role
            next()
        } catch (error){
            return res.status(500).json({message: 'lỗi server'})
        }

    },

    superadmin: async (req , res , next)=>{
        try{
            const role = await getRole(req.user.id)

            if (role !== 'Superadmin') {
                return res.status(403).json({message: 'chỉ superadmin mới có quyền này'})
            }

            console.log('chào superadmin')
            req.user.role = role
            next()
        } catch (error){
            return res.status(500).json({message: 'lỗi server'})
        }

    }
}

module.exports = authorize
