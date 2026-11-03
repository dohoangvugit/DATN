const {getRoles} = require('../models/getInforModel')

const authorize ={

    admin: async(req , res , next)=>{
        try{
            const result = await getRoles(req.user.id)
            const roles = result.data.roles
            const role = roles.includes('Superadmin') ? 'Superadmin' : 'Admin'
            if (!roles.includes('Admin') && !roles.includes('Superadmin')) {
                return res.status(403).json({message: 'chỉ admin mới có quyền này'})
            }
            console.log('chào admin')
            req.user.roles = roles
            req.user.role = role
            next()
        } catch (error){
            return res.status(500).json({message: 'lỗi server'})
        }

    },

    superadmin: async (req , res , next)=>{
        try{
            const result = await getRoles(req.user.id)
            const roles = result.data.roles
            if (!roles.includes('Superadmin')) {
                return res.status(403).json({message: 'chỉ superadmin mới có quyền này'})
            }

            console.log('chào superadmin')
            req.user.roles = roles
            req.user.role = 'Superadmin'
            next()
        } catch (error){
            return res.status(500).json({message: 'lỗi server'})
        }

    },
    
    advertiser: async (req, res, next) => {
        try {
            const result = await getRoles(req.user.id)
            const roles = result.data.roles
            if (!roles.includes('Advertiser')) {
                return res.status(403).json({
                    message: 'Chỉ Advertiser mới có quyền này'
                })
            }

            req.user.roles = roles
            req.user.role = 'Advertiser'
            next()
        } catch (error) {
            return res.status(500).json({
                message: 'Lỗi server'
            })
        }
    },

    viewer: async(req,res,next) =>{
        try{
            const result = await getRoles(req.user.id)
            const roles = result.data.roles
            if(!roles.includes('Viewer')){
                return res.status(403).json({
                    message: 'Chỉ Viewer mới vào được trang này'
                })
            }

            req.user.roles = roles
            req.user.role = 'Viewer'
            next()
        }catch(err){
            return res.status(500).json({
                message: 'lỗi server'
            })
        }
    }
}
module.exports = authorize
