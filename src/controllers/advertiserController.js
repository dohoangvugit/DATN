const advertiserModel = require('../models/advertiserModel')
const verifyBlockchain = require('../helper/verifyBlockchain')
const { getAdBalance } = require('../models/getInforModel')

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

            if (!currency || !tx_hash) {
                return res.status(400).json({ message: 'thiếu thông tin nạp tiền' })
            }

            if (currency !== 'POL') {
                return res.status(400).json({ message: 'Chỉ hỗ trợ nạp POL trên mạng Polygon' })
            }

            const { data: hashData, error: hashError } = await advertiserModel.findHash(tx_hash)
            if (hashError) {
                return res.status(400).json({ message: 'lỗi khi tìm kiếm hash' })
            }

            if (hashData) {
                return res.status(400).json({ message: 'Tx hash đã được sử dụng, vui lòng cung cấp đúng Tx hash bạn nạp' })
            }

            let verification
            try {
                verification = await verifyBlockchain({ tx_hash })
            } catch (error) {
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
            return res.status(500).json({
                message: 'Lỗi server',
                error: error.message
            })
        }
    },

    renderAdvertiserDashboard: async (req, res) => {
        try {
            const authId = req.user.id
            const { data: dataAdBalance, error: errorAdBalance } = await getAdBalance(authId)

            if (errorAdBalance) {
                return res.status(400).json({
                    message: 'Lỗi lấy số dư',
                    error: errorAdBalance.message
                })
            }

            res.render('advertiser', {
                dataAdBalance
            })
        } catch (err) {
            // Xử lý lỗi render nếu cần
        }
    },

    renderDeposit: (req, res) => {
        res.render('deposit')
    },

    createTask: async (req, res) => {
        try {
            const authId = req.user.id
            const { title, description, url, reward, quantity } = req.body

            if (!title || !url || !reward || !quantity) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin nhiệm vụ!' })
            }

            const taskReward = Number(reward)
            const taskQuantity = Number(quantity)
            
            if (isNaN(taskReward) || taskReward <= 0 || isNaN(taskQuantity) || taskQuantity <= 0) {
                return res.status(400).json({ message: 'Phần thưởng và số lượng nhiệm vụ không hợp lệ!' })
            }

            const baseCost = taskReward * taskQuantity
            const platformFee = baseCost * 0.10
            const totalDeducted = baseCost + platformFee 

            const { data: advertiser, error: advErr } = await advertiserModel.getUserByAuthId(authId)
            if (advErr || !advertiser) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng!' })
            }

            if (Number(advertiser.ad_balance) < totalDeducted) {
                return res.status(400).json({
                    message: `Số dư ví quảng cáo không đủ! Bạn cần ${totalDeducted} POL (gồm ${baseCost} + 10% phí), nhưng chỉ có ${advertiser.ad_balance} POL.`
                })
            }

            const newAdBalance = Number(advertiser.ad_balance) - totalDeducted
            const { error: updateAdvErr } = await advertiserModel.updateAdBalance(authId, newAdBalance)
            if (updateAdvErr) {
                return res.status(500).json({ message: 'Lỗi khi trừ số dư quảng cáo' })
            }

            const { data: newTask, error: taskErr } = await advertiserModel.createTask({
                title,
                description,
                url,
                reward: taskReward,
                quantity: taskQuantity,
                created_by: advertiser.id
            })

            if (taskErr) {
                await advertiserModel.updateAdBalance(authId, advertiser.ad_balance)
                return res.status(500).json({
                    message: 'Lỗi khi tạo nhiệm vụ, đã hoàn lại tiền vào ví',
                    error: taskErr.message
                })
            }

            return res.status(200).json({
                message: 'Tạo nhiệm vụ thành công!',
                totalDeducted,
                remaining_ad_balance: newAdBalance,
                task: newTask
            })

        } catch (error) {
            return res.status(500).json({
                message: 'Lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = advertiserController