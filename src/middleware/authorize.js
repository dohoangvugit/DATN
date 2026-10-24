const {getRole} = require('../models/getInforModel')

const authorize ={

    admin: async(req , res , next)=>{
        try{
            const result = await getRole(req.user.id)
            const role = result.data.role
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
            const result = await getRole(req.user.id)
            const role = result.data.role
            if (role !== 'Superadmin') {
                return res.status(403).json({message: 'chỉ superadmin mới có quyền này'})
            }

            console.log('chào superadmin')
            req.user.role = role
            next()
        } catch (error){
            return res.status(500).json({message: 'lỗi server'})
        }

    },
    
    advertiser: async (req, res, next) => {
        try {
            const result = await getRole(req.user.id)
            const role = result.data.role
            if (role !== 'Advertiser') {
                return res.status(403).json({
                    message: 'Chỉ Advertiser mới có quyền này'
                })
            }

            req.user.role = role
            next()
        } catch (error) {
            return res.status(500).json({
                message: 'Lỗi server'
            })
        }
    },

    viewer: async(req,res,next) =>{
        try{
            const result = await getRole(req.user.id)
            const role = result.data.role
            if(role !== 'Viewer'){
                return res.status(403).json({
                    message: 'Chỉ Viewer mới vào được trang này'
                })
            }

            next()
        }catch(err){
            return res.status(500).json({
                message: 'lỗi server'
            })
        }
    }
}
module.exports = authorize
