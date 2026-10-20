const { ethers } = require("ethers")
const provider = require('../config/provider')
const wallet = require('../config/wallet') 

async function verifyBlockchain({ tx_hash, amount }) {
    try {
        const superadminWallet = await wallet.getAddress()

            console.log("Ví hệ thống (superadminWallet):", superadminWallet)

        const tx = await provider.getTransaction(tx_hash)
        if (!tx) {
            throw new Error('Giao dịch không tồn tại trên blockchain')
        }

        const receipt = await provider.getTransactionReceipt(tx_hash)
        if (!receipt) {
            throw new Error('Giao dịch chưa được ghi nhận vào block')
        }

        if (receipt.status !== 1) {
            throw new Error('Giao dịch không thành công trên blockchain')
        }

        if (tx.to.toLowerCase() !== superadminWallet.toLowerCase()) {
            console.log("Ví nhận thực tế trong Tx (tx.to):", tx.to)

            throw new Error('Nạp tiền thất bại, giao dịch không đến được tài khoản của chúng tôi')
        }

        const actualAmount = parseFloat(ethers.formatEther(tx.value))
        if (actualAmount < parseFloat(amount)) {
            throw new Error('Số tiền thực tế bạn nạp không khớp với số tiền yêu cầu')
        }

        return { 
            success: true,
            message: 'Xác thực blockchain thành công',
            actualAmount: actualAmount,
        }

    } catch (error) {
        console.log('lỗi khi xác minh blockchain:', error.message)
        throw error // Ném lỗi để Controller bắt được
    }
}

module.exports = verifyBlockchain