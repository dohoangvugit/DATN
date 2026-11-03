const advertiserModel = require('../models/advertiserModel')
const verifyBlockchain = require('../helper/verifyBlockchain')
const {getAdBalance} = require('../models/getInforModel')

const advertiserController = {

    enableAdvertiser: async (req, res) => {
        try {
            const authId = req.user.id
            const { data, error } = await advertiserModel.getRoles(authId)

            if (error || !data) {
                return res.status(500).json({
                    message: 'Không thể tìm thấy vai trò người dùng',
                    error: error?.message
                })
            }

            if (!Array.isArray(data.roles)) {
                return res.status(500).json({
                    message: 'Dữ liệu roles của người dùng không hợp lệ'
                })
            }

            const roles = data.roles

            if (!roles.includes('Advertiser')) {
                const { error: updateError } = await advertiserModel.updateRoles(
                    authId,
                    [...roles, 'Advertiser']
                )

                if (updateError) {
                    return res.status(500).json({
                        message: 'Không thể cập nhật vai trò Advertiser',
                        error: updateError.message
                    })
                }
            }

            return res.status(200).json({
                message: 'Đã bật vai trò Advertiser',
                redirectUrl: '/advertiser'
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Lỗi server',
                error: error.message
            })
        }
    },

    createDeposit: async (req, res) => {
        try {
            const { currency, tx_hash } = req.body
            const authId = req.user.id
            // console.log('id: ', authId)

            if( !currency || !tx_hash){
                return res.status(400).json({ message: 'thiếu thông tin nạp tiền' })
            }

            if (currency !== 'POL') {
                return res.status(400).json({ message: 'Chỉ hỗ trợ nạp POL trên mạng Polygon' })
            }

            const {data: hashData, error: hashError} = await advertiserModel.findHash(tx_hash)
            if(hashError){
                return res.status(400).json({ message: 'lỗi khi tìm kiếm hash' })
            }

            if(hashData){
                return res.status(400).json({ message: 'Tx hash đã được sử dụng, vui lòng cung cấp đúng Tx hash bạn nạp' })
            }

            let verification
            try{
                verification = await verifyBlockchain({tx_hash})
            }catch(error){
                return res.status(400).json({ message: 'lỗi xác minh giao dịch trên blockchain', error: error.message })
            }

            const actualAmount = verification.actualAmount

            const { data, error } = await advertiserModel.createDeposit({
                user_uuid: authId,
                amount: actualAmount,
                currency,
                tx_hash
            })

            if (error) {
                return res.status(400).json({ message: 'nạp tiền thất bại' })
            }

            const { error: balanceError } = await advertiserModel.addAdBalance(authId, actualAmount)
            if (balanceError) {
                return res.status(500).json({ message: 'Lỗi khi cập nhật số dư quảng cáo' })
            }

            return res.status(200).json({ 
                message: 'nạp tiền thành công',
                actualAmount,
                currency,
                data
            })

        } catch (error) {
            return res.status(500).json(
                {
                    message: 'Lỗi server',
                    error: error.message
                })
            }
        },

    renderAdvertiserDashboard: async (req, res) => {
        try{
            const authId = req.user.id
            const { data: dataAdBalance, error: errorAdBalance } = await getAdBalance(authId)

            // console.log(dataAdBalance)
            if(errorAdBalance){
                return res.status(400).json({
                    message: 'Lỗi lấy số dư',
                    error: errorAdBalance.message
                })
            }

            res.render('advertiser',{
                dataAdBalance
            })
        }catch(err){

        }
    },

    renderDeposit: (req,res) =>{
        res.render('deposit')
    }
}

module.exports = advertiserController