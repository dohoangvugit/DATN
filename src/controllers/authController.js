const authModel = require('../models/authModel')
const {getRole} = require('../models/getInforModel')

const authController = {

    login: (req, res) => {
        res.render('login',)
    },

    register: ( req,res) =>{
        res.render('register')
    },

    loginSubmit: async (req,res) => {

            try{
                const {email,password} = req.body

                const {data,error} = await authModel.login(email,password)

                if(error){
                    if(error.code ==='email_not_confirmed'){
                        return res.status(400).json({
                            message: 'chưa xác nhận email'
                        })
                    } else {
                        return res.status(400).json({
                            message: 'sai email hoặc mật khẩu, vui lòng đăng nhập lại'                 
                        })
                    }
                }

                const token = data?.session?.access_token

                if(!token){
                    return res.status(400).json({
                        message: 'sai email hoặc mật khẩu, vui lòng đăng nhập lại'
                    })
                }


                res.cookie('access_token', token, {
                    httpOnly: true,
                    secure: false
                })

                const {data: dataRole, error: errorRole} = await getRole(data.user.id)

                if(errorRole || !dataRole){
                    return res.status(400).json({
                        message: 'không tìm thấy user',
                        error: errorRole.message
                    })
                }

                if( dataRole.role ==='Admin' || dataRole.role === 'Superadmin'){
                    res.redirect('/manager/users')
                }
                
                res.redirect('/tasks')
                
            }catch(error){
                console.error(error)
                return res.status(500).json({
                    message: 'lỗi server',
                    error: error.message
                })
            }

        },
    registerSubmit: async(req,res) => {

        try{
            const{email,username,password} = req.body
            const {data,error} = await authModel.register({email,username,password})

            if(error){
                return res.status(400).json({
                    message: 'đăng ký thất bại'
                })
            }

            return res.status(200).json({
                message: 'đăng ký thành công, hãy xác nhận email'
            })


        }catch(error){
            return res.status(500).json({
                message: 'lỗi server',
                error
            })          
        }
    },

    logout: async (req,res) => {
        try{
            await authModel.logout(req.cookies.access_token)

            res.clearCookie('access_token',{
                httpOnly: true,
                secure: false
            })
            return res.redirect('/login')
        }catch(error){
            return res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    },
}

module.exports = authController