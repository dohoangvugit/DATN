const supabase = require('../config/db')

const authModel = {

    register: async (userData) => {

        const { data: dataAuth, error: errorAuth } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                
            })

            if (errorAuth) {
                console.log('đăng ký auth thất bại', errorAuth.message)
                throw errorAuth
            }

        const { data, error } = await supabase
            .from('users')
            .insert([
                { 
                    auth_user_id: dataAuth.user.id,
                    username: userData.username,
                    email: userData.email,
                }
            ])
            .select()

        if (error) {
            console.error('đăng ký thất bại', error.message)
            throw error
        }
        // console.log('đăng ký thành công', data)
        return data
    },

    login: async (email, password) => {

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error){
            if (error.code === 'email_not_confirmed') {
                console.log('mail chưa xác minh, đăng nhập thất bại')
            } else {
                console.log('đăng nhập thất bại, sai tài khoản hoặc mật khẩu')
            }
            throw error
        }

        // console.log('đăng nhập thành công', data)
        return data
    },

    logout: async() =>{
        const { error } = await supabase.auth.signOut()

        if( error ){
            console.log('đăng xuát thất bại', error.message)
            throw error
        }

        console.log('đăng xuất thành công')
    }
}

module.exports = authModel

