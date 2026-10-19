const { ethers } = require("ethers")
const provider = require('../config/provider')
const wallet = require('../config/wallet') 

async function verifyBlockchain({ tx_hash, amount}) {
    try {
        const superadminWallet =await  wallet.getAddress()

        const tx = await provider.getTransaction(tx_hash);
        if (!tx) {
            return { 
                status: 'pending',
                message: 'Giao dịch không tồn tại trên blockchain'

            }
        }

        const receipt = await provider.getTransactionReceipt(tx_hash)
        if (!receipt) {
            return { 
                status: 'pending',
                message: 'Giao dịch chưa được ghi nhận vào block' 
            }
        }

        if (receipt.status !== 1) {
            return { status: 'failed', message: 'Giao dịch không thành công trên blockchain' }
        }

        if (tx.to.toLowerCase() !== superadminWallet.toLowerCase()) {
            return { status: 'failed', message: 'Giao dịch không phải là giao dịch đến tài khoản superadmin' }
        }

        const actualAmount = parseFloat(ethers.formatEther(tx.value));
        if (actualAmount < parseFloat(amount)) {
            return { 
                status: 'failed',
                message: `Số tiền nạp thực tế (${actualAmount} POL) ít hơn số tiền yêu cầu (${amount} POL)` 
            };
        }

        return { 
            status: 'confirmed',
            message: 'Nạp tiền thành công, tiền sẽ sớm được nạp vào tài khoản của bạn',
            actualAmount: actualAmount,
        }

    }catch(error){
        console.log('lỗi khi xác minh blockchain', error.message)
        throw error
    }
}

module.exports = verifyBlockchain