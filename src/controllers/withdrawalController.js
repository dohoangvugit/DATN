const getInforModel = require('../models/getInforModel')
const updateBalanceModel = require('../models/updateBalanceModel')
const wallet = require('../config/wallet')
const { ethers } = require('ethers')

const withdrawalController = {
    renderWithraw: (req, res) => {
        res.render('withdraw')
    },

    postWithdraw: async (req, res) => {
        try {
            const { amount, address } = req.body
            const authUserId = req.user.id

            if (!amount || !address) {
                return res.status(400).json({
                    message: 'nhập thiếu thông tin'
                })
            }

            if (amount < 0.01) {
                return res.status(400).json({
                    message: 'số tiền phải lớn hơn 0.01'
                })
            }

            const { data: dataBalance, error: errorBalance } = await getInforModel.getBalance(authUserId)

            if (errorBalance || !dataBalance) {
                return res.status(400).json({
                    message: 'lỗi truy xuất thông tin'
                })
            }

            if (dataBalance.balance < amount) {
                return res.status(400).json({
                    message: 'số dư không đủ'
                })
            }

            try {
                const request = {
                    to: address,
                    value: ethers.parseEther(amount.toString()) 
                }

                const response = await wallet.sendTransaction(request)
                const receipt = await response.wait()

                if (receipt.status === 1) {
                    const newBalance = dataBalance.balance - amount

                    const { error: errorUpdateBalance } = await updateBalanceModel.updateBalance(authUserId, newBalance)
                    
                    if (errorUpdateBalance) {
                        console.error('Lỗi cập nhật balance trong DB sau khi đã chuyển tiền:', errorUpdateBalance)
                    }
                    
                    return res.status(200).json({
                        message: 'thanh toán thành công',
                        txHash: response.hash,
                        balance: newBalance
                    })
                } else {
                    return res.status(400).json({
                        message: 'thanh toán thất bại trên blockchain'
                    })
                }

            } catch (error) {
                console.error('loi giao dich:', error)
                return res.status(500).json({ error: 'giao dich that bai', message: error.message })
            }

        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'lỗi server',
                error: error.message
            })
        }
    }
}

module.exports = withdrawalController