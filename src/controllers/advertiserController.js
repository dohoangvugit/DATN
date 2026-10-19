const advertiserModel = require('../models/advertiserModel')
const verifyBlockchain = require('../helper/verifyBlockchain')

const advertiserController = {

    createDeposit: async (req, res) => {
        try {
            const {  amount, currency, network, tx_hash } = req.body
            const id = req.params.id


            if(!amount || !currency || !tx_hash){
                return res.status(400).json({ message: 'thiếu thông tin nạp tiền' })
            }

            const {data: hashData, error: hashError} = await advertiserModel.findHash(tx_hash)
            if(hashError){
                return res.status(400).json({ message: 'lỗi khi tìm kiếm hash' })
            }

            if(hashData){
                return res.status(400).json({ message: 'Tx hash sai, vui lòng cung cấp đúng Tx hash bạn nạp' })
            }

           const verification = await verifyBlockchain({tx_hash, amount})

            const { data, error } = await advertiserModel.createDeposit({
                user_id: id,
                amount: verification.actualAmount,
                currency,
                status: verification.status,
                tx_hash
            })

            if (error) {
                return res.status(400).json({ message: 'nạp tiền thất bại' })
            }

            if(verification.status === 'confirmed'){
                await advertiserModel.addAdBalance(id, verification.actualAmount)
                return res.status(200).json({ message: 'nạp tiền thành công', data })
            }

        } catch (error) {
            return res.status(500).json({
                        message: 'Lỗi server',
                        error: error.message
                    })
                }
            },
    
    
}

module.exports = advertiserController