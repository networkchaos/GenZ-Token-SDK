import { Router } from 'express'
import { z } from 'zod'
import { ethers } from 'ethers'
import { ledger } from '../services/ledger.js'

const MintSchema = z.object({
  userId: z.string().min(1),
  to: z.string().min(1),
  amountWei: z.string().regex(/^\d+$/),
  reason: z.string().optional(),
})

export const tokensRouter = Router()

tokensRouter.post('/mint', async (req, res) => {
  const parsed = MintSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues })

  // On-chain mint via MINTER_ROLE
  try {
    const rpc = process.env.RPC_URL
    const tokenAddress = process.env.TOKEN_ADDRESS
    const minterKey = process.env.GENZ_MINTER_PRIVATE_KEY
    if (!rpc || !tokenAddress || !minterKey) return res.status(500).json({ message: 'Server missing chain config' })

    const provider = new ethers.JsonRpcProvider(rpc)
    const wallet = new ethers.Wallet(minterKey, provider)
    const abi = [
      'function mint(address to, uint256 amount) external',
      'function decimals() public view returns (uint8)'
    ]
    const token = new ethers.Contract(tokenAddress, abi, wallet)
    const tx = await token.mint(parsed.data.to, parsed.data.amountWei)
    const receipt = await tx.wait()

    const mintId = `mint_${Date.now()}`
    ledger.recordMint({ id: mintId, userId: parsed.data.userId, amountWei: parsed.data.amountWei, txHash: receipt?.hash })
    return res.json({ transactionId: receipt?.hash, mintId })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || 'Mint failed' })
  }
})

const TransferSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amountWei: z.string().regex(/^\d+$/),
})

tokensRouter.post('/transfer', async (req, res) => {
  const parsed = TransferSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues })
  // Note: ERC20 transfers are client-side signed; this endpoint could be used for server-initiated transfers
  return res.status(501).json({ message: 'Not implemented: server-initiated transfer' })
})


