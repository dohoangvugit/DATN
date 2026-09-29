require('dotenv').config()

const { ethers } = require ('ethers')

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)


module.exports = provider