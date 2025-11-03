import { Router } from 'express'
import { ethers } from 'ethers'

export const walletsRouter = Router()

walletsRouter.get('/:playerId/balance', async (req, res) => {
  try {
    const address = req.query.address as string | undefined
    if (!address) return res.status(400).json({ message: 'address query param required' })
    const rpc = process.env.RPC_URL
    const tokenAddress = process.env.TOKEN_ADDRESS
    if (!rpc || !tokenAddress) return res.status(500).json({ message: 'Server missing chain config' })
    const provider = new ethers.JsonRpcProvider(rpc)
    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ]
    const token = new ethers.Contract(tokenAddress, abi, provider)
    const balance = await token.balanceOf(address)
    return res.json({ playerId: req.params.playerId, balance: balance.toString() })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || 'Failed to fetch balance' })
  }
})


