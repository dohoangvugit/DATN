const supabase = require('../config/db')

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token

        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy access token trong cookie' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        res.clearCookie('access_token')
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
    }

    req.user = user

    next()
    } catch (err) {

        res.clearCookie('access_token')

        return res.status(500).json({ message: 'Lỗi server khi xác thực', error: err.message })
    }
}

module.exports =  authenticate 