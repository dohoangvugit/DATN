require('dotenv').config()

const { ethers } = require ('ethers')
const provider = require('./provider')

const wallet = new ethers.Wallet(process.env.KEY, provider)

module.exports = wallet

// console.log(wallet.getAddress())